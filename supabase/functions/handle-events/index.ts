// Path: supabase/functions/handle-events/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!

serve(async (req) => {
  const { type, email, name } = await req.json()

  let subject = ""
  let html = ""

  if (type === 'WELCOME') {
    subject = "Welcome to Donify!"
    html = `<h1>Hello ${name || 'Friend'}!</h1><p>Welcome to the transparency revolution.</p>`
  } else if (type === 'SPECIAL_IMPORT') {
    subject = "Your Specialized Import is Ready"
    html = `<h1>Special Access Granted</h1><p>Your one-time specialized import has been processed.</p>`
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 
      'Authorization': `Bearer ${RESEND_API_KEY}`, 
      'Content-Type': 'application/json' 
    },
    body: JSON.stringify({
      from: 'Donify <donify.org@gmail.com>', // Change to your verified domain later
      to: email,
      subject: subject,
      html: html
    })
  })

  const data = await res.json()
  return new Response(JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } })
})