// Path: supabase/functions/stripe-webhook/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@12.0.0'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, { apiVersion: '2022-11-15' })
const RESEND_API_KEY = Deno.env.get('re_Mdyfi3vh_CpP68m4DEaL3CPBGoBNVTJzF')!
const supabaseUrl = Deno.env.get('https://xmgeufzuqkxfhpfvjkkg.supabase.co')!
const supabaseKey = Deno.env.get('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhtZ2V1Znp1cWt4ZmhwZnZqa2tnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTAzODAwOCwiZXhwIjoyMDg0NjE0MDA4fQ.nta2fsMNYdz5Wz0u6Sbu0sisgtEES8G8krrBhhgIrMk')!

serve(async (req) => {
  const signature = req.headers.get('Stripe-Signature')!
  const body = await req.text()
  
  try {
    const event = stripe.webhooks.constructEvent(body, signature, Deno.env.get('STRIPE_WEBHOOK_SECRET')!)
    
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object
      const email = session.customer_details.email
      // Get the Price ID to determine the tier
      const priceId = session.line_items?.data?.[0]?.price?.id || session.metadata?.priceId
      
      // 1. Determine Tier based on Price ID (You will get these IDs from your Stripe Dashboard)
      let tier = 'Bronze' 
      // Replace these strings with your ACTUAL Stripe Price IDs later
      if (priceId === 'price_GOLD_ID_HERE') tier = 'Gold' 
      if (priceId === 'price_DIAMOND_ID_HERE') tier = 'Diamond'

      console.log(`User ${email} bought ${tier}`)

      // 2. Send "Thank You" Email
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${RESEND_API_KEY}`, 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({
          from: 'Donify <onboarding@resend.dev>', // Change this if you verified your domain
          to: email,
          subject: `Welcome to Donify ${tier}!`,
          html: `<h1>Welcome to the ${tier} Tier!</h1><p>Your payment was successful.</p>`
        })
      })

      // 3. Update User Profile in Supabase
      const supabase = createClient(supabaseUrl, supabaseKey)
      // Find user by email
      const { data: userData } = await supabase.from('auth.users').select('id').eq('email', email).single()
      
      if (userData) {
         await supabase.from('profiles').update({ subscription_tier: tier }).eq('id', userData.id)
      }
    }

    return new Response(JSON.stringify({ received: true }), { headers: { 'Content-Type': 'application/json' } })
  } catch (err) {
    console.error(err)
    return new Response(err.message, { status: 400 })
  }
})