import React, { useState } from 'react';
import { Menu, X, Rocket } from 'lucide-react';
import { PageView } from '../types';
import { Logo } from './Logo';

interface PublicNavbarProps {
    onNavigate: (page: PageView) => void;
    onLoginClick: () => void;
}

export default function PublicNavbar({ onNavigate, onLoginClick }: PublicNavbarProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navItems = [
        { label: 'Cómo funciona', view: 'how-it-works' as PageView },
        { label: 'Organizaciones', view: 'organizations' as PageView },
        { label: 'Precios', view: 'pricing' as PageView },
        { label: 'Contacto', view: 'contact' as PageView },
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-gray-100 z-50">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <button
                        onClick={() => onNavigate('landing')}
                        className="flex items-center gap-2 group"
                    >
                        <Logo className="w-8 h-8 text-primary transition-transform group-hover:scale-110" />
                        <span className="font-bold text-xl text-gray-900 tracking-tight">Donify</span>
                    </button>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        {navItems.map((item) => (
                            <button
                                key={item.view}
                                onClick={() => onNavigate(item.view)}
                                className="text-sm font-medium text-gray-600 hover:text-primary transition-colors"
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>

                    {/* CTAs */}
                    <div className="hidden md:flex items-center gap-4">
                        <button
                            onClick={onLoginClick}
                            className="text-sm font-semibold text-gray-900 hover:text-primary transition-colors"
                        >
                            Iniciar sesión
                        </button>
                        <button
                            onClick={() => onNavigate('pricing')}
                            className="bg-gray-900 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-black transition-all hover:scale-105 shadow-lg shadow-gray-900/20 flex items-center gap-2"
                        >
                            <Rocket size={16} />
                            Empezar ahora
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden absolute top-20 left-0 right-0 bg-white border-b border-gray-100 shadow-xl animate-in slide-in-from-top-5">
                    <div className="p-6 space-y-4">
                        {navItems.map((item) => (
                            <button
                                key={item.view}
                                onClick={() => {
                                    onNavigate(item.view);
                                    setIsMenuOpen(false);
                                }}
                                className="block w-full text-left py-3 text-base font-medium text-gray-600 hover:text-primary border-b border-gray-50 last:border-0"
                            >
                                {item.label}
                            </button>
                        ))}
                        <div className="pt-4 space-y-3">
                            <button
                                onClick={() => {
                                    onLoginClick();
                                    setIsMenuOpen(false);
                                }}
                                className="w-full py-3 text-center font-semibold text-gray-900 border border-gray-200 rounded-xl hover:bg-gray-50 mb-3"
                            >
                                Iniciar sesión
                            </button>
                            <button
                                onClick={() => {
                                    onNavigate('pricing');
                                    setIsMenuOpen(false);
                                }}
                                className="w-full py-3 text-center font-semibold text-white bg-primary rounded-xl hover:bg-primary/90 shadow-lg shadow-primary/30"
                            >
                                Empezar ahora
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
