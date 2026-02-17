
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
  | 'admin'
  | 'organizations'
  | 'settings'
  | 'ngo-dashboard'
  | 'ngo-settings'
  | 'ngo-projects';

export type SubscriptionTier = 'bronce' | 'plata' | 'oro' | 'diamante';
export type SubscriptionType = 'simple' | 'pro';
export type UserType = 'donor' | 'ngo' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  isSubscribed: boolean;
  subscriptionTier?: SubscriptionTier;
  hasVotedThisMonth: boolean;
  lastDonationDate?: string; // ISO Date
  isAdmin?: boolean;
  userType?: UserType; // Type of user account
}

export interface NgoUser {
  id: string;
  authUserId: string;
  ngoName: string;
  legalName?: string;
  cif?: string;
  category?: string;
  description?: string;
  mission?: string;
  logoUrl?: string;
  bannerUrl?: string;
  website?: string;
  email: string;
  phone?: string;
  address?: string;
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
  };
  isVerified: boolean;
  isActive: boolean;
  userType: 'ngo';
}

export interface NgoProject {
  id: string;
  ngoId: string;
  title: string;
  description: string;
  category: string;
  goalAmount?: number;
  imageUrl?: string;
  status: 'draft' | 'active' | 'voting' | 'completed' | 'archived';
  votingMonth?: string;
  currentVotes?: number;
}

export interface VoteStats {
  currentMonthVotes: number;
  ranking: number;
  totalNgos: number;
  estimatedRevenue: number;
  lastMonthVotes: number;
  historicalVotes: { month: string; votes: number }[];
}

export interface OngCandidate {
  id: string;
  name: string;
  category: string;
  description: string;
  imageUrl: string;
  progress: number;
}
