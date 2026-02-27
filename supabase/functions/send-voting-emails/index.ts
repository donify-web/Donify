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
    .select("id, email, full_name, subscription_tier");

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

    // Try to INSERT a fresh token for this month.
    // If one already exists (unique constraint on email+month), fetch it instead.
    let finalToken = tokenUuid;

    const { error: insertError } = await supabase
      .from("vote_tokens")
      .insert({ token: tokenUuid, email: user.email, month: currentMonth, expires_at });

    if (insertError) {
      // Row already exists — fetch the token that's actually in the DB
      const { data: existing } = await supabase
        .from("vote_tokens")
        .select("token")
        .eq("email", user.email)
        .eq("month", currentMonth)
        .single();
      if (existing?.token) finalToken = existing.token;
    }

    const name = user.full_name || "Donante";

    // Send email with dynamic cause cards
    const tier = user.subscription_tier || 'oro/diamante';
    const htmlContent = buildVotingEmail(name, finalToken, currentMonth, causes, tier);

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
  return causes.map((cause, index) => {
    const voteLink = `${BASE_URL}/#/quick-vote?token=${token}&cause=${cause.id}`;
    // Margin bottom for all except the last card
    const marginAttr = index === causes.length - 1 ? '' : 'padding-bottom:24px;';
    
    return `
      <tr>
        <td style="${marginAttr}">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e5e7eb;box-shadow:0 4px 12px rgba(0,0,0,0.03);">
            <tr>
              <!-- Desktop: Image on left, Content on right -->
              <!-- Mobile: Requires responsive CSS in <head> but we use a stackable approach -->
              <td class="card-image-col" width="40%" style="overflow:hidden;">
                <img src="${cause.image_url}"
                     alt="${cause.title}"
                     width="100%"
                     style="width:100%;height:100%;min-height:180px;object-fit:cover;display:block;" />
              </td>
              <td class="card-content-col" width="60%" valign="middle" style="padding:24px;">
                <p style="margin:0 0 8px;font-size:18px;font-weight:800;color:#111827;line-height:1.3;letter-spacing:-0.3px;">${cause.title}</p>
                <p style="margin:0 0 16px;font-size:14px;color:#4b5563;line-height:1.6;">${cause.description}</p>
                
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td width="55%" valign="middle">
                      <p style="margin:0;font-size:12px;color:#059669;font-weight:700;display:inline-block;background:#ecfdf5;padding:4px 10px;border-radius:20px;">
                        ❤️ ${cause.votes} votos
                      </p>
                    </td>
                    <td width="45%" align="right" valign="middle">
                      <a href="${voteLink}"
                         style="display:inline-block;background:#1a7a5e;color:#ffffff;text-decoration:none;font-size:14px;font-weight:700;padding:10px 20px;border-radius:8px;box-shadow:0 2px 4px rgba(26,122,94,0.2);transition:all 0.2s;">
                        Votar &rarr;
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>`;
  }).join('');
}

function buildVotingEmail(name: string, token: string, month: string, causes: VotingOption[], tier: string): string {
  const causeCards = buildCauseCards(token, causes);
  const displayTier = tier.charAt(0).toUpperCase() + tier.slice(1);

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Vota en Donify</title>
  <style>
    @media only screen and (max-width: 600px) {
      .card-image-col, .card-content-col {
        display: block !important;
        width: 100% !important;
      }
      .card-image-col img {
        height: 200px !important;
      }
    }
  </style>
</head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:40px 16px;">
    <tr>
      <td align="center">
        <!-- Main Container -->
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;border-radius:20px;overflow:hidden;box-shadow:0 10px 40px rgba(0,0,0,0.06);background:#ffffff;">

          <!-- Premium Header -->
          <tr>
            <td style="background:#023047;padding:40px 40px 32px;text-align:center;">
              <img src="https://wsrv.nl/?url=donify.world/logo.svg&output=png" alt="Donify" width="60" height="60" style="border-radius:14px;margin-bottom:12px;display:inline-block;" />
              <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:900;letter-spacing:-1px;">Donify</h1>
              <p style="margin:12px 0 0;color:#0ca1b3;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:3px;">
                Votación Mensual &bull; ${formatMonth(month)}
              </p>
            </td>
          </tr>

          <!-- Intro -->
          <tr>
            <td style="padding:40px 40px 10px;">
              <h2 style="margin:0 0 16px;font-size:24px;font-weight:800;color:#0f172a;line-height:1.2;letter-spacing:-0.5px;">
                Hola, ${name}.<br/>Tu voto hace el cambio real.
              </h2>
              <p style="margin:0 0 24px;font-size:16px;color:#475569;line-height:1.6;">
                Como suscriptor <strong>${displayTier}</strong> de Donify, tienes la responsabilidad y el privilegio de elegir qué organización recibe nuestro apoyo financiero este mes.
              </p>
              
              <!-- Divider -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="border-bottom:2px dashed #e2e8f0;padding-bottom:10px;"></td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Causes Section -->
          <tr>
            <td style="padding:20px 40px 40px;">
              <p style="margin:0 0 24px;font-size:12px;font-weight:800;color:#0ca1b3;text-transform:uppercase;letter-spacing:1.5px;">
                Explora las causas candidatas:
              </p>
              
              <!-- Cards -->
              <table width="100%" cellpadding="0" cellspacing="0">
                ${causeCards}
              </table>
              
            </td>
          </tr>

          <!-- Security Notice -->
          <tr>
            <td style="background:#f8fafc;padding:24px 40px;border-top:1px solid #e2e8f0;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="24" valign="top">
                    <span style="font-size:16px;">🔒</span>
                  </td>
                  <td style="padding-left:12px;">
                    <p style="margin:0;font-size:13px;color:#64748b;line-height:1.5;">
                      <strong>Este es tu enlace seguro.</strong> Tu voto no requiere iniciar sesión, es secreto y de un solo uso. La votación se cierra el día 5 del próximo mes.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#0f172a;padding:32px 40px;text-align:center;">
              <p style="margin:0 0 12px;font-size:18px;font-weight:800;color:#ffffff;letter-spacing:-0.5px;">Donify</p>
              
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
                <tr>
                  <td align="center">
                    <a href="https://www.instagram.com/donifyworld?igsh=MWtqd2Y1Y2doMGQ3MA%3D%3D" style="display:inline-block;margin:0 8px;background:#1e293b;border-radius:50%;width:36px;height:36px;text-align:center;line-height:44px;text-decoration:none;">
                      <img src="https://img.icons8.com/ios-filled/50/94a3b8/instagram-new.png" alt="Instagram" width="18" height="18" style="display:inline-block;vertical-align:middle;border:0;">
                    </a>
                    <a href="https://www.tiktok.com/@donifyworld?_r=1&_t=ZN-94E0lzMZLcc" style="display:inline-block;margin:0 8px;background:#1e293b;border-radius:50%;width:36px;height:36px;text-align:center;line-height:44px;text-decoration:none;">
                      <img src="https://img.icons8.com/ios-filled/50/94a3b8/tiktok.png" alt="TikTok" width="18" height="18" style="display:inline-block;vertical-align:middle;border:0;">
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin:0 0 16px;font-size:13px;color:#94a3b8;line-height:1.6;">
                Revolucionando la transparencia en las donaciones.<br/>100% de tu suscripción va a la causa ganadora.
              </p>
              <p style="margin:0;font-size:12px;color:#475569;">
                © ${new Date().getFullYear()} Donify &nbsp;&bull;&nbsp; <a href="${BASE_URL}" style="color:#0ca1b3;text-decoration:none;">donify.world</a>
              </p>
            </td>
          </tr>

        </table>
        
        <!-- View in browser / Unsubscribe (Optional standard footer text) -->
        <p style="margin:24px 0 0;font-size:12px;color:#94a3b8;text-align:center;">
          Recibes esto porque eres suscriptor de Donify.<br/>
          Si tienes problemas técnicos, contáctanos en soporte@donify.world.
        </p>
      </td>
    </tr>
  </table>

</body>
</html>`;
}
