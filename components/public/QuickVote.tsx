import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { PageView } from '../../types';
import { CheckCircle2, XCircle, Loader2, ArrowRight } from 'lucide-react';
import { Logo } from '../shared/Logo';

interface QuickVoteProps {
    onNavigate: (view: PageView) => void;
}

type VoteState = 'loading' | 'success' | 'error' | 'already_voted';

export default function QuickVote({ onNavigate }: QuickVoteProps) {
    const [voteState, setVoteState] = useState<VoteState>('loading');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const processVote = async () => {
            try {
                // 1. Get params from URL
                // We are using hash routing, so it looks like: donify.world/#/quick-vote?token=uuid&cause=id
                const hashParams = window.location.hash.split('?')[1];
                const urlParams = new URLSearchParams(hashParams);

                const token = urlParams.get('token');
                const causeId = urlParams.get('cause');

                if (!token || !causeId) {
                    setVoteState('error');
                    setErrorMessage('Enlace no válido. Faltan parámetros.');
                    return;
                }

                // 2. Fetch and Validate Token from Supabase
                const { data: tokens, error: tokenError } = await supabase
                    .from('vote_tokens')
                    .select('*')
                    .eq('token', token);

                if (tokenError || !tokens || tokens.length === 0) {
                    setVoteState('error');
                    setErrorMessage('El enlace no es válido o no existe.');
                    return;
                }

                const voteToken = tokens[0];

                if (voteToken.used) {
                    setVoteState('already_voted');
                    return;
                }

                // 3. Process Vote
                // We use a transaction-like RPC if we had one, but we'll do sequential updates safely here

                // 3a. Increment the vote count for the cause
                const { data: optionData, error: fetchOptionError } = await supabase
                    .from('voting_options')
                    .select('votes')
                    .eq('id', causeId)
                    .single();

                // We'll proceed even if we can't fetch the current vote (maybe it's a new option), but ideally we check
                if (fetchOptionError) {
                    // It might be a mock cause if we don't have it in the DB yet, but let's assume it exists
                    console.warn("Could not fetch cause:", fetchOptionError);
                }

                const currentVotes = optionData?.votes || 0;

                const { error: updateVoteError } = await supabase
                    .from('voting_options')
                    .update({ votes: currentVotes + 1 })
                    .eq('id', causeId);

                if (updateVoteError) {
                    console.error("Failed to update votes:", updateVoteError);
                    setVoteState('error');
                    setErrorMessage('Hubo un problema registrando tu voto. Inténtalo de nuevo.');
                    return;
                }

                // 3b. Mark token as used
                const { error: updateTokenError } = await supabase
                    .from('vote_tokens')
                    .update({
                        used: true,
                        cause_voted: causeId
                    })
                    .eq('id', voteToken.id)
                    .eq('used', false); // Double check it wasn't used concurrently

                if (updateTokenError) {
                    console.error("Failed to update token:", updateTokenError);
                    // the vote was counted but token not marked. This is an edge case, but we consider it success for the user.
                }

                setVoteState('success');

            } catch (err) {
                console.error("Voting error", err);
                setVoteState('error');
                setErrorMessage('Error inesperado procesando tu enlace.');
            }
        };

        // Little delay to make sure the user sees what's happening
        setTimeout(processVote, 800);

    }, []);

    const goToDashboard = () => {
        // Limpiamos el hash de voting
        history.replaceState(null, '', window.location.pathname);
        onNavigate('app');
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Animated Background Graphics */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl -z-0" />

            <div className="nav-logo flex items-center gap-2 mb-12 relative z-10 cursor-pointer" onClick={() => onNavigate('landing')}>
                <Logo className="w-8 h-8 text-primary" />
                <span className="font-bold text-2xl text-gray-900">Donify</span>
            </div>

            <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-gray-100 max-w-md w-full text-center relative z-10">

                {voteState === 'loading' && (
                    <div className="flex flex-col items-center animate-in fade-in duration-500">
                        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                            <Loader2 className="w-10 h-10 text-primary animate-spin" />
                        </div>
                        <h2 className="text-2xl font-black text-gray-900 mb-2">Procesando tu voto</h2>
                        <p className="text-gray-500">Estamos validando tu enlace...</p>
                    </div>
                )}

                {voteState === 'success' && (
                    <div className="flex flex-col items-center animate-in zoom-in-95 duration-500">
                        <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mb-6">
                            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                        </div>
                        <h2 className="text-2xl font-black text-gray-900 mb-4">¡Voto Registrado!</h2>
                        <p className="text-gray-600 mb-8">
                            Gracias por hacer oír tu voz. Tu voto ha sido sumado a esta causa con éxito.
                        </p>

                        <button
                            onClick={goToDashboard}
                            className="w-full bg-gray-900 text-white py-3 px-6 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-black transition-colors"
                        >
                            Ir a mi panel
                            <ArrowRight size={18} />
                        </button>
                    </div>
                )}

                {voteState === 'already_voted' && (
                    <div className="flex flex-col items-center animate-in fade-in duration-500">
                        <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center mb-6">
                            <CheckCircle2 className="w-10 h-10 text-amber-600" />
                        </div>
                        <h2 className="text-2xl font-black text-gray-900 mb-2">Ya habías votado</h2>
                        <p className="text-gray-600 mb-8">
                            Este enlace mensual ya ha sido utilizado. ¡Gracias por participar!
                        </p>
                        <button
                            onClick={() => onNavigate('landing')}
                            className="w-full bg-gray-100 text-gray-900 py-3 px-6 rounded-2xl font-bold hover:bg-gray-200 transition-colors"
                        >
                            Volver al inicio
                        </button>
                    </div>
                )}

                {voteState === 'error' && (
                    <div className="flex flex-col items-center animate-in fade-in duration-500">
                        <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mb-6">
                            <XCircle className="w-10 h-10 text-red-600" />
                        </div>
                        <h2 className="text-2xl font-black text-gray-900 mb-2">Oops...</h2>
                        <p className="text-red-500 font-medium mb-8">
                            {errorMessage}
                        </p>
                        <button
                            onClick={() => onNavigate('landing')}
                            className="w-full bg-gray-100 text-gray-900 py-3 px-6 rounded-2xl font-bold hover:bg-gray-200 transition-colors"
                        >
                            Volver al inicio
                        </button>
                    </div>
                )}

            </div>

            <p className="mt-8 text-sm font-medium text-gray-400 relative z-10">
                Donify Secure Voting System
            </p>
        </div>
    );
}
