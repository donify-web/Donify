
import { loadStripe } from '@stripe/stripe-js';
import { supabase } from './supabaseClient';

// Use environment variable for Stripe Publishable Key
const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_1234567890...'; 

export const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

// Comprehensive Price IDs for all tiers and payment frequencies
export const PRICE_IDS = {
  // One-time donation
  DONATION_5: import.meta.env.VITE_PRICE_DONATION_5 || 'price_donate_5_eur',
  
  // BRONZE TIER
  BRONZE_SIMPLE_MONTHLY: import.meta.env.VITE_PRICE_BRONZE_SIMPLE_MONTHLY || 'price_bronze_simple_monthly',
  BRONZE_SIMPLE_YEARLY: import.meta.env.VITE_PRICE_BRONZE_SIMPLE_YEARLY || 'price_bronze_simple_yearly',
  BRONZE_PRO_MONTHLY: import.meta.env.VITE_PRICE_BRONZE_PRO_MONTHLY || 'price_bronze_pro_monthly',
  BRONZE_PRO_YEARLY: import.meta.env.VITE_PRICE_BRONZE_PRO_YEARLY || 'price_bronze_pro_yearly',
  
  // PLATA/SILVER TIER (Bi-weekly)
  PLATA_SIMPLE_BIWEEKLY: import.meta.env.VITE_PRICE_PLATA_SIMPLE_BIWEEKLY || 'price_plata_simple_biweekly',
  PLATA_SIMPLE_YEARLY: import.meta.env.VITE_PRICE_PLATA_SIMPLE_YEARLY || 'price_plata_simple_yearly',
  PLATA_PRO_BIWEEKLY: import.meta.env.VITE_PRICE_PLATA_PRO_BIWEEKLY || 'price_plata_pro_biweekly',
  PLATA_PRO_YEARLY: import.meta.env.VITE_PRICE_PLATA_PRO_YEARLY || 'price_plata_pro_yearly',

  // ORO/GOLD TIER (Weekly)
  ORO_SIMPLE_WEEKLY: import.meta.env.VITE_PRICE_ORO_SIMPLE_WEEKLY || 'price_oro_simple_weekly',
  ORO_SIMPLE_YEARLY: import.meta.env.VITE_PRICE_ORO_SIMPLE_YEARLY || 'price_oro_simple_yearly',
  ORO_PRO_WEEKLY: import.meta.env.VITE_PRICE_ORO_PRO_WEEKLY || 'price_oro_pro_weekly',
  ORO_PRO_YEARLY: import.meta.env.VITE_PRICE_ORO_PRO_YEARLY || 'price_oro_pro_yearly',

  // DIAMANTE/DIAMOND TIER (Daily)
  DIAMANTE_SIMPLE_DAILY: import.meta.env.VITE_PRICE_DIAMANTE_SIMPLE_DAILY || 'price_diamante_simple_daily',
  DIAMANTE_SIMPLE_YEARLY: import.meta.env.VITE_PRICE_DIAMANTE_SIMPLE_YEARLY || 'price_diamante_simple_yearly',
  DIAMANTE_PRO_DAILY: import.meta.env.VITE_PRICE_DIAMANTE_PRO_DAILY || 'price_diamante_pro_daily',
  DIAMANTE_PRO_YEARLY: import.meta.env.VITE_PRICE_DIAMANTE_PRO_YEARLY || 'price_diamante_pro_yearly',

  // Legacy aliases for backwards compatibility
  BRONZE_SIMPLE: import.meta.env.VITE_PRICE_BRONZE_SIMPLE_MONTHLY || 'price_bronze_simple_monthly',
  BRONZE_PRO: import.meta.env.VITE_PRICE_BRONZE_PRO_MONTHLY || 'price_bronze_pro_monthly',
  SILVER_SIMPLE: import.meta.env.VITE_PRICE_PLATA_SIMPLE_BIWEEKLY || 'price_plata_simple_biweekly',
  SILVER_PRO: import.meta.env.VITE_PRICE_PLATA_PRO_BIWEEKLY || 'price_plata_pro_biweekly',
  GOLD_SIMPLE: import.meta.env.VITE_PRICE_ORO_SIMPLE_WEEKLY || 'price_oro_simple_weekly',
  GOLD_PRO: import.meta.env.VITE_PRICE_ORO_PRO_WEEKLY || 'price_oro_pro_weekly',
  DIAMOND_SIMPLE: import.meta.env.VITE_PRICE_DIAMANTE_SIMPLE_DAILY || 'price_diamante_simple_daily',
  DIAMOND_PRO: import.meta.env.VITE_PRICE_DIAMANTE_PRO_DAILY || 'price_diamante_pro_daily',
};

/**
 * Initiates a Stripe Checkout Session.
 * 
 * In a real production app, this calls a Supabase Edge Function to create the session securely.
 */
export const initiateCheckout = async (priceId: string, userId: string, mode: 'payment' | 'subscription' = 'subscription') => {
  try {
    console.log(`[Stripe] Creating checkout session for ${priceId} (${mode}), user ${userId}`);

    // Call Supabase Edge Function to create the session server-side
    const { data: session, error } = await supabase.functions.invoke('create-checkout-session', {
      body: { priceId, userId, mode, returnUrl: window.location.origin }
    });

    if (error) {
      console.error('[Stripe] Edge function error:', error);
      throw new Error(error.message || JSON.stringify(error));
    }

    if (!session?.url) {
      console.error('[Stripe] No URL returned from edge function:', session);
      throw new Error('No se recibió URL de checkout de Stripe.');
    }

    // Redirect to Stripe Checkout hosted page (modern approach)
    window.location.href = session.url;

    return { success: true };

  } catch (error) {
    console.error('[Stripe Error]', error);
    return { success: false, error };
  }
};

/**
 * Modifies an existing subscription (upgrade/downgrade tier).
 * Calls Supabase Edge Function to handle the change via Stripe API.
 */
export const modifySubscription = async (subscriptionId: string, newPriceId: string, userId: string) => {
  try {
    console.log(`[Stripe] Modifying subscription ${subscriptionId} to ${newPriceId} for user ${userId}`);

    // Call Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('modify-subscription', {
      body: { subscriptionId, newPriceId, userId }
    });

    if (error) throw error;
    return { success: true, data };

  } catch (error) {
    console.error('[Stripe Error - Modify Subscription]', error);
    return { success: false, error };
  }
};

/**
 * Switches payment frequency (monthly ↔ yearly) for an existing subscription.
 * This updates the subscription to use a different price ID with the same tier.
 */
export const switchPaymentFrequency = async (subscriptionId: string, newPriceId: string, userId: string) => {
  try {
    console.log(`[Stripe] Switching payment frequency for subscription ${subscriptionId} to ${newPriceId}`);

    // Uses the same backend function as modifySubscription
    return await modifySubscription(subscriptionId, newPriceId, userId);

  } catch (error) {
    console.error('[Stripe Error - Switch Frequency]', error);
    return { success: false, error };
  }
};

/**
 * Redirects the user to the Stripe Customer Portal to manage payment methods and subscriptions.
 */
export const redirectToCustomerPortal = async (customerId: string) => {
  try {
    console.log(`[Stripe] Redirecting customer ${customerId} to billing portal`);

    const { data, error } = await supabase.functions.invoke('create-portal-session', {
      body: { customerId, returnUrl: window.location.origin + '/settings' }
    });

    if (error) throw error;
    if (data?.url) {
      window.location.href = data.url;
    }
    return { success: true };
  } catch (error) {
    console.error('[Stripe Error - Portal]', error);
    return { success: false, error };
  }
};
