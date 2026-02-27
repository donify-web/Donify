// supabase/functions/send-voting-emails/index.ts
//
// Cada mes 1 a las 9:00 AM UTC, pg_cron llama a esta función.
// La función:
//   1. Obtiene las causas activas de voting_options
//   2. Para cada suscriptor genera un token único
//   3. Envía un email HTML con tarjetas de cada causa, con botones personalizados
//
// Llamada manual (PowerShell):
//   Invoke-RestMethod -Uri "https://xmgeufzuqkxfhpfvjkkg.supabase.co/functions/v1/send-voting-emails" `
//     -Method POST `
//     -Headers @{"Content-Type"="application/json"; "x-cron-secret"="donify-voting-2026"} `
//     -Body '{"month": "2026-02"}'

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const BREVO_API_KEY = Deno.env.get("BREVO_API_KEY")!;
const CRON_SECRET   = Deno.env.get("CRON_SECRET")!;
const SUPABASE_URL  = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const SENDER   = { name: "Donify", email: "no-reply@donify.world" };
const BASE_URL = "https://donify.world";

interface VotingOption {
  id: string;
  title: string;
  description: string;
  image_url: string;
  votes: number;
}

serve(async (req) => {
  // ── Auth ─────────────────────────────────────────────────────────────────────
  const secret = req.headers.get("x-cron-secret");
  if (!CRON_SECRET || secret !== CRON_SECRET) {
    return json({ error: "Unauthorized" }, 401);
  }

  const body = await req.json().catch(() => ({}));
  const currentMonth: string = body.month ?? new Date().toISOString().slice(0, 7);

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  // ── 1. Fetch active voting causes ─────────────────────────────────────────────
  const { data: causes, error: causesErr } = await supabase
    .from("voting_options")
    .select("id, title, description, image_url, votes")
    .eq("is_active", true)
    .order("votes", { ascending: false });

  if (causesErr || !causes || causes.length === 0) {
    return json({ error: "No active voting options found." }, 400);
  }

  // ── 2. Fetch subscribers ──────────────────────────────────────────────────────
  const { data: users, error: usersError } = await supabase
    .from("profiles")
    .select("id, email, full_name");

  if (usersError) return json({ error: usersError.message }, 500);
  if (!users || users.length === 0) return json({ message: "No users found.", sent: 0 });

  const results: { email: string; status: string; error?: string }[] = [];

  // ── 3. For each user: generate token → build email → send ─────────────────────
  for (const user of users) {
    if (!user.email) continue;

    const tokenUuid = crypto.randomUUID();
    const expires_at = new Date(
      new Date().getFullYear(), new Date().getMonth() + 1, 5
    ).toISOString();

    // Upsert token
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

    // Send email with dynamic cause cards
    const htmlContent = buildVotingEmail(name, finalToken, currentMonth, causes);

    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": BREVO_API_KEY,
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        sender: SENDER,
        to: [{ email: user.email, name }],
        subject: `🗳️ ¡Elige tu causa de ${formatMonth(currentMonth)}!`,
        htmlContent,
      }),
    });

    if (res.ok) {
      results.push({ email: user.email, status: "sent" });
    } else {
      const err = await res.json().catch(() => ({}));
      console.error("Brevo error for", user.email, err);
      results.push({ email: user.email, status: "failed", error: JSON.stringify(err) });
    }
  }

  const sent   = results.filter(r => r.status === "sent").length;
  const failed = results.filter(r => r.status === "failed").length;
  console.log(`Done. Sent: ${sent}, Failed: ${failed}`);

  return json({ month: currentMonth, sent, failed, results });
});

// ── Helpers ───────────────────────────────────────────────────────────────────

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function formatMonth(month: string): string {
  const [year, m] = month.split("-");
  const months = ["enero","febrero","marzo","abril","mayo","junio",
    "julio","agosto","septiembre","octubre","noviembre","diciembre"];
  return `${months[parseInt(m) - 1]} ${year}`;
}

function buildCauseCards(token: string, causes: VotingOption[]): string {
  return causes.map(cause => {
    const voteLink = `${BASE_URL}/#/quick-vote?token=${token}&cause=${cause.id}`;
    return `
      <td width="${Math.floor(100 / causes.length)}%" valign="top" style="padding:0 8px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #e5e7eb;">
          <!-- Cause image -->
          <tr>
            <td style="padding:0;height:160px;overflow:hidden;">
              <img src="${cause.image_url}"
                   alt="${cause.title}"
                   width="100%"
                   style="width:100%;height:160px;object-fit:cover;display:block;" />
            </td>
          </tr>
          <!-- Cause content -->
          <tr>
            <td style="padding:16px 16px 20px;">
              <p style="margin:0 0 6px;font-size:14px;font-weight:800;color:#111827;line-height:1.3;">${cause.title}</p>
              <p style="margin:0 0 14px;font-size:12px;color:#6b7280;line-height:1.6;">${cause.description}</p>
              <p style="margin:0 0 14px;font-size:11px;color:#9ca3af;font-weight:600;">👥 ${cause.votes} votos recibidos</p>
              <a href="${voteLink}"
                 style="display:block;text-align:center;background:#1a7a5e;color:#ffffff;text-decoration:none;font-size:13px;font-weight:800;padding:11px 16px;border-radius:10px;">
                Vota esta causa
              </a>
            </td>
          </tr>
        </table>
      </td>`;
  }).join('');
}

function buildVotingEmail(name: string, token: string, month: string, causes: VotingOption[]): string {
  const causeCards = buildCauseCards(token, causes);
  const totalVoters = causes.reduce((sum, c) => sum + (c.votes || 0), 0);

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Vota en Donify</title>
</head>
<body style="margin:0;padding:0;background:#f4f7f4;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f7f4;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background:#1a7a5e;border-radius:16px 16px 0 0;padding:28px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:26px;font-weight:900;letter-spacing:-0.5px;">Donify</h1>
              <p style="margin:6px 0 0;color:rgba(255,255,255,0.7);font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:2.5px;">
                Sistema de Votación · ${formatMonth(month)}
              </p>
            </td>
          </tr>

          <!-- Intro -->
          <tr>
            <td style="background:#ffffff;padding:32px 40px 24px;">
              <p style="margin:0 0 6px;font-size:12px;color:#9ca3af;font-weight:700;text-transform:uppercase;letter-spacing:1px;">
                Hola, ${name} 👋
              </p>
              <h2 style="margin:0 0 14px;font-size:22px;font-weight:900;color:#111827;line-height:1.3;">
                ¡Elige la causa que recibirá los fondos de ${formatMonth(month)}!
              </h2>
              <p style="margin:0 0 10px;font-size:14px;color:#4b5563;line-height:1.7;">
                Como suscriptor de Donify, tu voto decide qué organización recibe los fondos este mes.
                Más de <strong>${totalVoters} votos</strong> ya han sido emitidos. El tuyo puede marcar la diferencia.
              </p>
              <p style="margin:0;font-size:13px;color:#6b7280;">
                🔒 Enlace personal · Un solo uso · Expira el 5 del mes siguiente
              </p>
            </td>
          </tr>

          <!-- Section title -->
          <tr>
            <td style="background:#ffffff;padding:0 40px 20px;">
              <p style="margin:0;font-size:13px;font-weight:800;color:#1a7a5e;text-transform:uppercase;letter-spacing:1.5px;">
                Causas destacadas de este mes en Donify
              </p>
            </td>
          </tr>

          <!-- Cause cards row -->
          <tr>
            <td style="background:#ffffff;padding:0 32px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  ${causeCards}
                </tr>
              </table>
            </td>
          </tr>

          <!-- Info strip -->
          <tr>
            <td style="background:#f0f9f4;padding:18px 40px;border-top:1px solid #d1fae5;">
              <p style="margin:0;font-size:12px;color:#374151;line-height:1.7;text-align:center;">
                💡 <strong>¿Cómo funciona?</strong> Haz clic en el botón de la causa que prefieras. Tu voto se registra automáticamente —
                no necesitas iniciar sesión. Cada suscriptor tiene un solo voto al mes.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f9fafb;border-radius:0 0 16px 16px;padding:20px 40px;border-top:1px solid #e5e7eb;text-align:center;">
              <p style="margin:0;font-size:11px;color:#9ca3af;">
                © ${new Date().getFullYear()} Donify · La democracia de la donación<br />
                <a href="${BASE_URL}" style="color:#1a7a5e;text-decoration:none;">donify.world</a>
                &nbsp;·&nbsp;
                <a href="${BASE_URL}/#/legal" style="color:#9ca3af;text-decoration:none;">Política de privacidad</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`;
}
