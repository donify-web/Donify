
export type PageView = 
  | 'landing' 
  | 'app' 
  | 'login' 
  | 'signup' 
  | 'pricing' 
  | 'how-it-works' 
  | 'contact' 
  | 'ngo-apply' 
  | 'legal' 
  | 'cookies'
  | 'admin'
  | 'organizations'
  | 'settings';

export type SubscriptionTier = 'bronce' | 'plata' | 'oro' | 'diamante';
export type SubscriptionType = 'simple' | 'pro';

export interface User {
  id: string;
  name: string;
  email: string;
  isSubscribed: boolean;
  subscriptionTier?: SubscriptionTier;
  hasVotedThisMonth: boolean;
  lastDonationDate?: string; // ISO Date
  isAdmin?: boolean; // New flag for admin access
}

export interface OngCandidate {
  id: string;
  name: string;
  category: string;
  description: string;
  imageUrl: string;
  progress: number;
}
