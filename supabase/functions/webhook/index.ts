import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import Stripe from 'https://esm.sh/stripe@14.21.0?target=deno'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2024-11-20.acacia',
  httpClient: Stripe.createFetchHttpClient(),
})

const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET') || ''

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const signature = req.headers.get('stripe-signature')
  
  if (!signature) {
    return new Response('No signature', { status: 400 })
  }

  try {
    const body = await req.text()
    
    // Verify webhook signature
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    
    console.log('Webhook event:', event.type)

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.client_reference_id
        const customerId = session.customer as string

        if (userId) {
          const isSubscription = session.mode === 'subscription';
          
          const updateData: any = {
            stripe_customer_id: customerId,
            updated_at: new Date().toISOString()
          };

          if (isSubscription) {
            updateData.is_subscribed = true;
            updateData.subscription_status = 'active';
          } else {
            // One-time donation (Extra 5€)
            updateData.last_donation_date = new Date().toISOString();
          }

          // Update profile with Stripe customer ID and status
          await supabaseClient
            .from('profiles')
            .update(updateData)
            .eq('id', userId)
            
          console.log(`Updated user ${userId} (Mode: ${session.mode}) with customer ${customerId}`)
        }
        break
      }

      case 'invoice.paid': {
        const invoice = event.data.object as Stripe.Invoice
        const customerId = invoice.customer as string

        // Find user by customer ID
        const { data: user } = await supabaseClient
          .from('profiles')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single()

        if (user) {
          // Success renewal: ensure is_subscribed is true and refresh donation date
          await supabaseClient
            .from('profiles')
            .update({
              is_subscribed: true,
              subscription_status: 'active',
              last_donation_date: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })
            .eq('id', user.id)
            
          console.log(`Renewed subscription for customer ${customerId}`)
        }
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        const customerId = invoice.customer as string

        const { data: user } = await supabaseClient
          .from('profiles')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single()

        if (user) {
          await supabaseClient
            .from('profiles')
            .update({
              subscription_status: 'past_due',
              updated_at: new Date().toISOString()
            })
            .eq('id', user.id)
            
          console.log(`Payment failed for customer ${customerId}`)
        }
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        // Find user by customer ID and update subscription status
        const { data: user } = await supabaseClient
          .from('profiles')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single()

        if (user) {
          // Determine tier if metadata contains it or based on price mapping
          // For now, we update status and ID
          await supabaseClient
            .from('profiles')
            .update({
              subscription_id: subscription.id,
              subscription_status: subscription.status,
              updated_at: new Date().toISOString()
            })
            .eq('id', user.id)
            
          console.log(`Updated subscription for customer ${customerId}`)
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        // Find user and mark as unsubscribed
        const { data: user } = await supabaseClient
          .from('profiles')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single()

        if (user) {
          await supabaseClient
            .from('profiles')
            .update({
              is_subscribed: false,
              subscription_id: null,
              subscription_status: 'canceled',
              updated_at: new Date().toISOString()
            })
            .eq('id', user.id)
            
          console.log(`Canceled subscription for customer ${customerId}`)
        }
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    console.error('Webhook error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
