// supabase/functions/send-voting-emails/index.ts
//
// MODO 1 (por defecto): "sync"
//   Genera tokens en vote_tokens y los sube como atributo VOTE_TOKEN a cada contacto de Brevo.
//   Luego tú mandas la campaña desde el editor visual de Brevo usando {{ contact.VOTE_TOKEN }}.
//
// MODO 2: "send"
//   Además de sincronizar tokens, también manda los emails directamente (sin usar editor de Brevo).
//
// Cómo llamarlo (PowerShell):
//   Invoke-RestMethod -Uri "https://xmgeufzuqkxfhpfvjkkg.supabase.co/functions/v1/send-voting-emails" `
//     -Method POST `
//     -Headers @{"Content-Type"="application/json"; "x-cron-secret"="donify-voting-2026"} `
//     -Body '{"month": "2026-02", "mode": "sync"}'

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const BREVO_API_KEY = Deno.env.get("BREVO_API_KEY")!;
const CRON_SECRET   = Deno.env.get("CRON_SECRET")!;
const SUPABASE_URL  = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const SENDER   = { name: "Donify", email: "no-reply@donify.world" };
const BASE_URL = "https://donify.world";

serve(async (req) => {
  // ── Auth ─────────────────────────────────────────────────────────────────────
  const secret = req.headers.get("x-cron-secret");
  if (!CRON_SECRET || secret !== CRON_SECRET) {
    return json({ error: "Unauthorized" }, 401);
  }

  // ── Params ───────────────────────────────────────────────────────────────────
  const body        = await req.json().catch(() => ({}));
  const currentMonth: string = body.month ?? new Date().toISOString().slice(0, 7);
  // mode: "sync" → only update Brevo contact attrs (use Brevo visual editor to send campaign)
  //        "send" → also send emails using your Brevo template
  const mode: string     = body.mode ?? "sync";
  // templateId: your Brevo template ID (find it in Brevo → Templates → your template number)
  const templateId: number | null = body.templateId ?? null;

  // ── Supabase admin client ─────────────────────────────────────────────────────
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  // ── 1. Fetch subscribers ──────────────────────────────────────────────────────
  const { data: users, error: usersError } = await supabase
    .from("profiles")
    .select("id, email, full_name");
    // Remove the `.not("subscription_tier","is",null)` filter while testing,
    // re-add it in production.

  if (usersError) return json({ error: usersError.message }, 500);
  if (!users || users.length === 0) return json({ message: "No users found.", synced: 0 });

  // ── 2. Ensure VOTE_TOKEN attribute exists in Brevo ───────────────────────────
  await ensureBrevoAttribute();

  const results: { email: string; status: string; error?: string }[] = [];

  // ── 3. For each user: generate token + sync to Brevo + (optionally) send email
  for (const user of users) {
    if (!user.email) continue;

    const tokenUuid = crypto.randomUUID();
    const expires_at = new Date(
      new Date().getFullYear(), new Date().getMonth() + 1, 5
    ).toISOString();

    // Upsert token in Supabase
    const { data: tokenData, error: insertError } = await supabase
      .from("vote_tokens")
      .upsert(
        { token: tokenUuid, email: user.email, month: currentMonth, expires_at },
        { onConflict: "email,month", ignoreDuplicates: false }
      )
      .select("token")
      .single();

    let finalToken = tokenData?.token ?? tokenUuid;
    if (insertError) {
      const { data: existing } = await supabase
        .from("vote_tokens")
        .select("token")
        .eq("email", user.email)
        .eq("month", currentMonth)
        .single();
      if (existing) finalToken = existing.token;
    }

    const name = user.full_name || "Donante";

    // ── Sync token as Brevo contact attribute ─────────────────────────────────
    const syncOk = await syncBrevoContact(user.email, name, finalToken);

    if (mode === "send") {
      // ── Also send email using Brevo template ─────────────────────────────────
      const voteLink = `${BASE_URL}/#/quick-vote?token=${finalToken}`;
      const ok = await sendBrevoEmail(user.email, name, finalToken, voteLink, currentMonth, templateId);
      results.push({ email: user.email, status: ok ? "sent" : "failed" });
    } else {
      results.push({ email: user.email, status: syncOk ? "synced" : "sync_failed" });
    }
  }

  const succeeded = results.filter(r => r.status === "sent" || r.status === "synced").length;
  const failed    = results.filter(r => r.status !== "sent" && r.status !== "synced").length;

  console.log(`[${mode}] Done. OK: ${succeeded}, Failed: ${failed}`);
  return json({ month: currentMonth, mode, succeeded, failed, results });
});

// ── Helpers ───────────────────────────────────────────────────────────────────

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

/** Create VOTE_TOKEN contact attribute in Brevo if it doesn't exist yet */
async function ensureBrevoAttribute() {
  try {
    await fetch("https://api.brevo.com/v3/contacts/attributes/normal/VOTE_TOKEN", {
      method: "POST",
      headers: { "api-key": BREVO_API_KEY, "Content-Type": "application/json" },
      body: JSON.stringify({ value: "" }),
    });
  } catch (_) { /* ignore — attribute may already exist */ }
}

/** Upsert contact in Brevo and set their VOTE_TOKEN attribute */
async function syncBrevoContact(email: string, name: string, token: string): Promise<boolean> {
  // Try to update existing contact first
  const updateRes = await fetch(`https://api.brevo.com/v3/contacts/${encodeURIComponent(email)}`, {
    method: "PUT",
    headers: { "api-key": BREVO_API_KEY, "Content-Type": "application/json", "Accept": "application/json" },
    body: JSON.stringify({ attributes: { VOTE_TOKEN: token, FIRSTNAME: name } }),
  });

  if (updateRes.ok || updateRes.status === 204) return true;

  // Contact doesn't exist yet → create it
  const createRes = await fetch("https://api.brevo.com/v3/contacts", {
    method: "POST",
    headers: { "api-key": BREVO_API_KEY, "Content-Type": "application/json", "Accept": "application/json" },
    body: JSON.stringify({ email, attributes: { VOTE_TOKEN: token, FIRSTNAME: name } }),
  });

  return createRes.ok || createRes.status === 201;
}

/** Send voting email via Brevo — uses template if templateId provided, else inline HTML */
async function sendBrevoEmail(
  email: string, name: string, token: string, voteLink: string,
  month: string, templateId: number | null
): Promise<boolean> {
  const payload: Record<string, unknown> = {
    sender: SENDER,
    to: [{ email, name }],
  };

  if (templateId) {
    // Use saved Brevo template — variables available as {{ params.VOTE_TOKEN }} in the template
    payload.templateId = templateId;
    payload.params = { VOTE_TOKEN: token, VOTE_LINK: voteLink };
  } else {
    // Fallback: send inline HTML
    payload.subject = `🗳️ ¡Tu voto del mes de ${formatMonth(month)} te espera!`;
    payload.htmlContent = buildVotingEmail(name, voteLink, month);
  }

  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: { "api-key": BREVO_API_KEY, "Content-Type": "application/json", "Accept": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.ok;
}

function formatMonth(month: string): string {
  const [year, m] = month.split("-");
  const months = ["enero","febrero","marzo","abril","mayo","junio",
    "julio","agosto","septiembre","octubre","noviembre","diciembre"];
  return `${months[parseInt(m) - 1]} ${year}`;
}

function buildVotingEmail(name: string, voteLink: string, month: string): string {
  return `
<!DOCTYPE html><html lang="es">
<head><meta charset="UTF-8"/><title>Tu voto Donify</title></head>
<body style="margin:0;padding:0;background:#f4f7f4;font-family:'Helvetica Neue',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f7f4;padding:40px 0;">
<tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.06);">
  <tr><td style="background:#1a7a5e;padding:28px 40px;text-align:center;">
    <h1 style="margin:0;color:#fff;font-size:24px;font-weight:900;">Donify</h1>
    <p style="margin:6px 0 0;color:rgba(255,255,255,0.75);font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:2px;">Sistema de Votación Mensual</p>
  </td></tr>
  <tr><td style="padding:40px 40px 32px;">
    <p style="margin:0 0 8px;font-size:13px;color:#9ca3af;font-weight:600;text-transform:uppercase;letter-spacing:1px;">Hola, ${name} 👋</p>
    <h2 style="margin:0 0 16px;font-size:26px;font-weight:900;color:#111827;">¡Tu voto del mes de <span style="color:#1a7a5e;">${formatMonth(month)}</span> te espera!</h2>
    <p style="margin:0 0 24px;font-size:15px;color:#4b5563;line-height:1.7;">
      Como suscriptor de Donify tienes potestad de voto este mes. Haz clic en el botón para emitir tu voto, <strong>sin necesidad de iniciar sesión</strong>.
    </p>
    <table width="100%" cellpadding="0" cellspacing="0"><tr>
      <td align="center" style="padding:8px 0 28px;">
        <a href="${voteLink}" style="display:inline-block;background:#1a7a5e;color:#fff;text-decoration:none;font-size:16px;font-weight:800;padding:16px 36px;border-radius:50px;">🗳️ Emitir mi voto ahora</a>
      </td>
    </tr></table>
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f9f4;border-radius:12px;margin-bottom:24px;">
      <tr><td style="padding:16px 20px;">
        <p style="margin:0;font-size:13px;color:#374151;line-height:1.6;">🔒 <strong>Enlace personal y seguro.</strong> Único para ti, un solo uso. Expira el 5 del mes siguiente.</p>
      </td></tr>
    </table>
    <p style="margin:0;font-size:13px;color:#9ca3af;">Si el botón no funciona: <a href="${voteLink}" style="color:#1a7a5e;word-break:break-all;">${voteLink}</a></p>
  </td></tr>
  <tr><td style="background:#f9fafb;padding:20px 40px;border-top:1px solid #e5e7eb;text-align:center;">
    <p style="margin:0;font-size:12px;color:#9ca3af;">© ${new Date().getFullYear()} Donify · <a href="https://donify.world" style="color:#1a7a5e;text-decoration:none;">donify.world</a></p>
  </td></tr>
</table>
</td></tr></table>
</body></html>`;
}
