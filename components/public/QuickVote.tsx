import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { PageView } from '../../types';
import { CheckCircle2, XCircle, Loader2, ArrowRight, Users } from 'lucide-react';
import { Logo } from '../shared/Logo';

interface QuickVoteProps {
    onNavigate: (view: PageView) => void;
}

interface VotingOption {
    id: string;
    title: string;
    description: string;
    image_url: string;
    votes: number;
}

// Phase 1: validating token
// Phase 2: choosing a cause
// Phase 3: done states
type Phase = 'validating' | 'choosing' | 'submitting' | 'success' | 'already_voted' | 'error';

export default function QuickVote({ onNavigate }: QuickVoteProps) {
    const [phase, setPhase] = useState<Phase>('validating');
    const [errorMessage, setErrorMessage] = useState('');
    const [options, setOptions] = useState<VotingOption[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [tokenRecord, setTokenRecord] = useState<{ id: string } | null>(null);

    // Read URL params — supports both ?token=X&cause=Y (direct) and just ?token=X
    const getParams = () => {
        const hashParams = window.location.hash.split('?')[1] ?? '';
        const p = new URLSearchParams(hashParams);
        return { token: p.get('token'), causeId: p.get('cause') };
    };

    useEffect(() => {
        const init = async () => {
            const { token, causeId } = getParams();

            if (!token) {
                setPhase('error');
                setErrorMessage('Enlace no válido. Falta el token.');
                return;
            }

            // 1. Validate token
            const { data: tokens, error } = await supabase
                .from('vote_tokens')
                .select('*')
                .eq('token', token);

            if (error || !tokens || tokens.length === 0) {
                setPhase('error');
                setErrorMessage('El enlace no es válido o ha expirado.');
                return;
            }

            const voteToken = tokens[0];

            if (voteToken.used) {
                setPhase('already_voted');
                return;
            }

            setTokenRecord({ id: voteToken.id });

            // 2a. If causeId in URL → vote directly
            if (causeId) {
                await processVote(voteToken.id, causeId);
                return;
            }

            // 2b. No causeId → load options and let user choose
            const { data: opts, error: optsErr } = await supabase
                .from('voting_options')
                .select('id, title, description, image_url, votes')
                .eq('is_active', true)
                .order('votes', { ascending: false });

            if (optsErr || !opts || opts.length === 0) {
                setPhase('error');
                setErrorMessage('No hay opciones de votación disponibles en este momento.');
                return;
            }

            setOptions(opts);
            setPhase('choosing');
        };

        setTimeout(init, 600);
    }, []);

    const processVote = async (tokenId: string, causeId: string) => {
        setPhase('submitting');

        // Fetch current votes
        const { data: optionData } = await supabase
            .from('voting_options')
            .select('votes')
            .eq('id', causeId)
            .single();

        const currentVotes = optionData?.votes ?? 0;

        // Increment votes
        const { error: updateVoteErr } = await supabase
            .from('voting_options')
            .update({ votes: currentVotes + 1 })
            .eq('id', causeId);

        if (updateVoteErr) {
            setPhase('error');
            setErrorMessage('Hubo un problema registrando tu voto. Inténtalo de nuevo.');
            return;
        }

        // Mark token as used
        await supabase
            .from('vote_tokens')
            .update({ used: true, cause_voted: causeId })
            .eq('id', tokenId)
            .eq('used', false);

        setPhase('success');
    };

    const handleSelectAndVote = async (causeId: string) => {
        if (!tokenRecord) return;
        setSelectedId(causeId);
        await processVote(tokenRecord.id, causeId);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center px-4 py-10 relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl -z-0" />

            {/* Logo */}
            <div className="flex items-center gap-2 mb-10 relative z-10 cursor-pointer" onClick={() => onNavigate('landing')}>
                <Logo className="w-8 h-8 text-primary" />
                <span className="font-bold text-2xl text-gray-900">Donify</span>
            </div>

            {/* ── VALIDATING ── */}
            {(phase === 'validating' || phase === 'submitting') && (
                <div className="bg-white p-10 rounded-3xl shadow-xl border border-gray-100 max-w-md w-full text-center relative z-10 animate-in fade-in duration-400">
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6 mx-auto">
                        <Loader2 className="w-10 h-10 text-primary animate-spin" />
                    </div>
                    <h2 className="text-xl font-black text-gray-900 mb-2">
                        {phase === 'validating' ? 'Validando tu enlace...' : 'Registrando tu voto...'}
                    </h2>
                    <p className="text-gray-500 text-sm">Un momento por favor</p>
                </div>
            )}

            {/* ── CHOOSE CAUSE ── */}
            {phase === 'choosing' && (
                <div className="relative z-10 w-full max-w-4xl animate-in fade-in duration-500">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center gap-2 bg-white px-3 py-1.5 rounded-full shadow-sm border border-gray-100 text-xs font-bold text-primary uppercase tracking-widest mb-4">
                            <Users size={12} /> Votación Mensual
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-2">Elige tu causa</h1>
                        <p className="text-gray-500 font-medium text-sm max-w-lg mx-auto">
                            Tu voto es secreto, único y solo puede usarse una vez este mes. Apoya la causa que más te importe.
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {options.map((opt) => (
                            <div
                                key={opt.id}
                                className="bg-white rounded-2xl overflow-hidden shadow-[0_4px_20px_rgb(0,0,0,0.05)] border border-gray-100 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 flex flex-col group"
                            >
                                {/* Image */}
                                <div className="h-44 overflow-hidden relative">
                                    <img
                                        src={opt.image_url}
                                        alt={opt.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm text-gray-600 text-[10px] font-bold px-2.5 py-1 rounded-full border border-gray-100 shadow-sm flex items-center gap-1">
                                        <Users size={10} /> {opt.votes} votos
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-5 flex flex-col flex-1">
                                    <h3 className="font-black text-gray-900 text-sm mb-1.5 leading-snug">{opt.title}</h3>
                                    <p className="text-gray-500 text-xs leading-relaxed flex-1 mb-4">{opt.description}</p>

                                    <button
                                        onClick={() => handleSelectAndVote(opt.id)}
                                        disabled={!!selectedId}
                                        className="w-full py-2.5 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary-dark transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        Votar por esta causa
                                        <ArrowRight size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ── SUCCESS ── */}
            {phase === 'success' && (
                <div className="bg-white p-10 rounded-3xl shadow-xl border border-gray-100 max-w-md w-full text-center relative z-10 animate-in zoom-in-95 duration-500">
                    <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mb-6 mx-auto">
                        <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                    </div>
                    <h2 className="text-2xl font-black text-gray-900 mb-3">¡Voto Registrado!</h2>
                    <p className="text-gray-600 text-sm mb-8 leading-relaxed">
                        Gracias por participar. Tu voto ha sido sumado correctamente a la causa elegida.
                    </p>
                    <button
                        onClick={() => { history.replaceState(null, '', window.location.pathname); onNavigate('landing'); }}
                        className="w-full bg-gray-900 text-white py-3 px-6 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-black transition-colors text-sm"
                    >
                        Volver al inicio <ArrowRight size={16} />
                    </button>
                </div>
            )}

            {/* ── ALREADY VOTED ── */}
            {phase === 'already_voted' && (
                <div className="bg-white p-10 rounded-3xl shadow-xl border border-gray-100 max-w-md w-full text-center relative z-10 animate-in fade-in duration-500">
                    <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center mb-6 mx-auto">
                        <CheckCircle2 className="w-10 h-10 text-amber-600" />
                    </div>
                    <h2 className="text-2xl font-black text-gray-900 mb-2">Ya habías votado</h2>
                    <p className="text-gray-600 text-sm mb-8">Este enlace mensual ya fue utilizado. ¡Gracias por participar!</p>
                    <button
                        onClick={() => onNavigate('landing')}
                        className="w-full bg-gray-100 text-gray-900 py-3 px-6 rounded-2xl font-bold hover:bg-gray-200 transition-colors text-sm"
                    >
                        Volver al inicio
                    </button>
                </div>
            )}

            {/* ── ERROR ── */}
            {phase === 'error' && (
                <div className="bg-white p-10 rounded-3xl shadow-xl border border-gray-100 max-w-md w-full text-center relative z-10 animate-in fade-in duration-500">
                    <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mb-6 mx-auto">
                        <XCircle className="w-10 h-10 text-red-600" />
                    </div>
                    <h2 className="text-2xl font-black text-gray-900 mb-2">Oops...</h2>
                    <p className="text-red-500 font-medium text-sm mb-8">{errorMessage}</p>
                    <button
                        onClick={() => onNavigate('landing')}
                        className="w-full bg-gray-100 text-gray-900 py-3 px-6 rounded-2xl font-bold hover:bg-gray-200 transition-colors text-sm"
                    >
                        Volver al inicio
                    </button>
                </div>
            )}

            <p className="mt-10 text-xs font-medium text-gray-400 relative z-10">Donify Secure Voting · Un voto por persona por mes</p>
        </div>
    );
}
