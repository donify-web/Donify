import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '../lib/supabaseClient';
import { User, SubscriptionTier } from '../types';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signOut: () => Promise<void>;
    refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // Helper to safely parse user data
    const mapSessionToUser = async (userId: string, email: string, authMetadata?: any) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            const nameFromEmail = email.includes('@') ? email.split('@')[0] : email;

            if (data) {
                // Use account_type field from profile
                const accountType = data.account_type || 'donor';
                return {
                    id: data.id,
                    email: data.email || email,
                    name: data.full_name || nameFromEmail,
                    isSubscribed: data.is_subscribed,
                    subscriptionTier: data.subscription_tier,
                    hasVotedThisMonth: data.has_voted_this_month,
                    lastDonationDate: data.last_donation_date,
                    isAdmin: accountType === 'admin',
                    isNgo: accountType === 'ngo',
                    ngoId: accountType === 'ngo' ? data.id : undefined
                } as User;
            } else {
                // Profile fetch failed (RLS or timing) - fall back to auth metadata
                // This is set during signup in Login.tsx
                const accountType = authMetadata?.account_type || 'donor';
                console.warn('⚠️ Profile not found, using auth metadata. account_type:', accountType);
                return {
                    id: userId,
                    email: email,
                    name: authMetadata?.full_name || nameFromEmail,
                    isSubscribed: false,
                    hasVotedThisMonth: false,
                    isAdmin: accountType === 'admin',
                    isNgo: accountType === 'ngo',
                    ngoId: accountType === 'ngo' ? userId : undefined
                } as User;
            }
        } catch (err) {
            console.error('❌ Profile map error:', err);
            const accountType = authMetadata?.account_type || 'donor';
            return {
                id: userId,
                email: email,
                name: authMetadata?.full_name || 'Usuario',
                isSubscribed: false,
                hasVotedThisMonth: false,
                isAdmin: false,
                isNgo: accountType === 'ngo',
                ngoId: accountType === 'ngo' ? userId : undefined
            } as User;
        }
    };

    const fetchUser = async (session: any) => {
        if (!session?.user) {
            setUser(null);
            setLoading(false);
            return;
        }

        const email = session.user.email || 'no-email';
        // Pass auth metadata as fallback for when profile read fails (e.g. RLS)
        const authMetadata = session.user.user_metadata || {};
        const profile = await mapSessionToUser(session.user.id, email, authMetadata);
        setUser(profile);
        setLoading(false);
    };

    useEffect(() => {
        // 1. Check active session
        supabase.auth.getSession().then(({ data: { session } }) => {
            fetchUser(session);
        });

        // 2. Listen for changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            // We set loading true only on explicit login events to avoid flickering, 
            // but for safety/correctness in this 'blank screen' debug scenario, 
            // let's be deliberate.
            if (session) {
                // If we already have a user and the IDs match, we might want to skip, 
                // but let's re-fetch to be safe (profile might have changed).
                // To avoid UI flash, we don't set loading=true here unless user was null.
                if (!user) setLoading(true);
                fetchUser(session);
            } else {
                setUser(null);
                setLoading(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const signOut = async () => {
        await supabase.auth.signOut();
        setUser(null);
    };

    const refreshProfile = async () => {
        if (!user) return;
        // We assume the session is still valid if user is set
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
            await fetchUser(session);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, signOut, refreshProfile }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
