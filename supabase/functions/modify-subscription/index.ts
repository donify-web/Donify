import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import Stripe from 'https://esm.sh/stripe@14.21.0?target=deno'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2024-11-20.acacia',
  httpClient: Stripe.createFetchHttpClient(),
})

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { subscriptionId, newPriceId, userId } = await req.json()

    if (!subscriptionId || !newPriceId || !userId) {
      throw new Error('subscriptionId, newPriceId, and userId are required')
    }

    // Retrieve sub to get the item ID
    const currentSub = await stripe.subscriptions.retrieve(subscriptionId);
    const itemId = currentSub.items.data[0].id;

    // Update the subscription with the new price
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      items: [
        {
          id: itemId,
          price: newPriceId,
        },
      ],
      proration_behavior: 'always_invoice', // Invoice immediately for upgrades
    })

    // Optional: Update user record in Supabase
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    await supabaseClient
      .from('profiles')
      .update({ subscription_id: subscription.id, updated_at: new Date().toISOString() })
      .eq('id', userId)

    return new Response(
      JSON.stringify({ 
        success: true, 
        subscription: {
          id: subscription.id,
          status: subscription.status,
          current_period_end: subscription.current_period_end,
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error modifying subscription:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
