
export type PageView = 
  | 'landing' 
  | 'app' 
  | 'login' 
  | 'signup' 
  | 'pricing' 
  | 'how-it-works' 
  | 'contact' 
  | 'ngo-apply' 
  | 'ngo-dashboard'
  | 'ngo-projects'
  | 'ngo-finance'
  | 'ngo-settings'
  | 'legal' 
  | 'privacy'
  | 'cookies'
  | 'admin'
  | 'organizations'
  | 'settings'
  | 'dashboard-impact'
  | 'dashboard-news';

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
  isNgo?: boolean; // New flag for NGO access
  ngoId?: string; // Link to the NGO profile if user is an NGO admin
}

export interface OngCandidate {
  id: string;
  name: string;
  category: string;
  description: string;
  imageUrl: string;
  progress: number;
}

export interface VoteStats {
    currentMonthVotes: number;
    ranking: number;
    totalNgos: number;
    estimatedRevenue: number;
    lastMonthVotes: number;
    historicalVotes: { month: string; votes: number }[];
}

export interface NgoProject {
    id: string;
    ngoId: string;
    title: string;
    description: string;
    category: string;
    goalAmount: number;
    imageUrl?: string;
    status: 'draft' | 'voting' | 'completed' | 'pending_approval';
    votingMonth?: string;
    currentVotes: number;
    ngoName?: string;
    ngoLogo?: string;
}

export interface NgoUser {
    id: string;
    ngoName: string;
    email: string;
    logoUrl?: string;
    bannerUrl?: string;
    isVerified: boolean;
    description?: string;
    mission?: string;
    legalName?: string;
    cif?: string;
    phone?: string;
    address?: string;
    website?: string;
    category?: string;
    socialMedia?: {
        facebook?: string;
        instagram?: string;
        twitter?: string;
        linkedin?: string;
    };
}

export interface NgoPayout {
    id: string;
    amount: number;
    currency: string;
    status: 'pending' | 'completed' | 'failed';
    payout_date?: string;
}

