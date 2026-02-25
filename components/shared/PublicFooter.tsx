import React from 'react';
import { PageView } from '../../types';
import { Logo } from './Logo';
import { Instagram } from 'lucide-react';

interface PublicFooterProps {
    onNavigate: (view: PageView) => void;
}

const TikTokIcon = ({ className }: { className?: string }) => (
    <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className={className}
        xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 2.25-.97 4.41-2.58 5.89-1.61 1.48-3.8 2.24-6.02 2.1-2.22-.14-4.26-1.18-5.65-2.82-1.39-1.64-2.06-3.8-1.89-6.02.17-2.22 1.21-4.26 2.85-5.65 1.64-1.39 3.8-2.06 6.02-1.89v4c-1.04-.08-2.11.16-2.99.71-.88.55-1.52 1.43-1.74 2.45-.22 1.02-.04 2.1.48 3.01.52.91 1.41 1.53 2.45 1.72 1.04.19 2.13-.02 3.01-.56.88-.54 1.48-1.43 1.64-2.47.16-1.04-.07-2.13-.64-3.03-.57-.9-1.48-1.5-2.52-1.66V0c.01.01.02.01.02.02z" />
    </svg>
);

export default function PublicFooter({ onNavigate }: PublicFooterProps) {
    return (
        <footer className="bg-gray-900 py-16 px-6 relative overflow-hidden">
            {/* Very faint abstract background glow */}
            <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
                <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="flex items-center gap-2 pr-6 border-r border-gray-700 hidden md:flex">
                        <Logo className="w-6 h-6 text-gray-400 group-hover:text-primary transition-colors" />
                        <span className="font-semibold text-gray-400 tracking-wide">Donify © 2026</span>
                    </div>
                    {/* Social Media Links */}
                    <div className="flex items-center gap-4">
                        <a
                            href="https://www.instagram.com/donifyworld?igsh=MWtqd2Y1Y2doMGQ3MA%3D%3D"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-white transition-colors bg-gray-800 hover:bg-gray-700 p-3 rounded-full shadow-sm"
                        >
                            <Instagram size={20} />
                        </a>
                        <a
                            href="https://www.tiktok.com/@donifyworld?_r=1&_t=ZN-94E0lzMZLcc"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-white transition-colors bg-gray-800 hover:bg-gray-700 p-3 rounded-full shadow-sm"
                        >
                            <TikTokIcon className="w-5 h-5" />
                        </a>
                    </div>
                    <div className="flex items-center gap-2 md:hidden">
                        <Logo className="w-6 h-6 text-gray-400" />
                        <span className="font-semibold text-gray-400 tracking-wide">Donify © 2026</span>
                    </div>
                </div>
                <div className="flex flex-wrap justify-center md:justify-end gap-x-8 gap-y-4 text-sm font-medium text-gray-400">
                    <button onClick={() => onNavigate('legal')} className="hover:text-white transition-colors">Términos</button>
                    <button onClick={() => onNavigate('privacy')} className="hover:text-white transition-colors">Privacidad</button>
                    <button onClick={() => onNavigate('transparency')} className="hover:text-white transition-colors">Transparencia</button>
                    <button onClick={() => onNavigate('cookies')} className="hover:text-white transition-colors">Cookies</button>
                    <button onClick={() => onNavigate('contact')} className="hover:text-white transition-colors">Contacto</button>
                    <button onClick={() => onNavigate('faq')} className="hover:text-white transition-colors">FAQ</button>
                </div>
            </div>
        </footer>
    );
}
