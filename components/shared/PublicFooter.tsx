import React from 'react';
import { PageView } from '../../types';
import { Logo } from './Logo';

interface PublicFooterProps {
    onNavigate: (view: PageView) => void;
}

export default function PublicFooter({ onNavigate }: PublicFooterProps) {
    return (
        <footer className="bg-white/80 backdrop-blur-md border-t border-gray-200 py-12 px-6">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-2">
                    <Logo className="w-6 h-6 text-gray-400" />
                    <span className="font-semibold text-gray-500">Donify © 2026</span>
                </div>
                <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-500">
                    <button onClick={() => onNavigate('legal')} className="hover:text-gray-900 transition-colors">Términos</button>
                    <button onClick={() => onNavigate('privacy')} className="hover:text-gray-900 transition-colors">Privacidad</button>
                    <button onClick={() => onNavigate('transparency')} className="hover:text-gray-900 transition-colors">Transparencia</button>
                    <button onClick={() => onNavigate('cookies')} className="hover:text-gray-900 transition-colors">Cookies</button>
                    <button onClick={() => onNavigate('contact')} className="hover:text-gray-900 transition-colors">Contacto</button>
                    <button onClick={() => onNavigate('faq')} className="hover:text-gray-900 transition-colors">FAQ</button>
                </div>
            </div>
        </footer>
    );
}
