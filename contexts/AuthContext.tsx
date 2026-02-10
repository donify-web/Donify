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
    const mapSessionToUser = async (userId: string, email: string) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            const nameFromEmail = email.includes('@') ? email.split('@')[0] : email;

            if (data) {
                const isAdmin = email === 'admin@donify.org';
                return {
                    id: data.id,
                    email: data.email || email,
                    name: data.full_name || nameFromEmail,
                    isSubscribed: data.is_subscribed,
                    subscriptionTier: data.subscription_tier,
                    hasVotedThisMonth: data.has_voted_this_month,
                    lastDonationDate: data.last_donation_date,
                    isAdmin: isAdmin
                } as User;
            } else {
                // Fallback for new users who don't have a profile yet (race condition on signup trigger)
                return {
                    id: userId,
                    email: email,
                    name: nameFromEmail,
                    isSubscribed: false,
                    hasVotedThisMonth: false,
                    isAdmin: email === 'admin@donify.org'
                } as User;
            }
        } catch (err) {
            console.error('Profile map error:', err);
            // Absolute fallback to prevent blocking
            return {
                id: userId,
                email: email,
                name: 'Usuario',
                isSubscribed: false,
                hasVotedThisMonth: false,
                isAdmin: false
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
        const profile = await mapSessionToUser(session.user.id, email);
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
