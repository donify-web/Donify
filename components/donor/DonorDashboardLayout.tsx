import React from 'react';
import { PageView, User } from '../../types';
import { Logo } from '../shared/Logo';
import { Home, TrendingUp, Newspaper, Settings, LogOut, Bell, Menu, Shield, CheckCircle, AlertCircle } from 'lucide-react';

interface DonorDashboardLayoutProps {
    user: User;
    currentView: PageView;
    onNavigate: (view: PageView) => void;
    onLogout: () => void;
    children: React.ReactNode;
}

export default function DonorDashboardLayout({ user, currentView, onNavigate, onLogout, children }: DonorDashboardLayoutProps) {
    const navItems = [
        { id: 'app', label: 'Votar', icon: <Home size={24} /> },
        { id: 'dashboard-impact', label: 'Mi Impacto', icon: <TrendingUp size={24} /> },
        { id: 'dashboard-news', label: 'Noticias', icon: <Newspaper size={24} /> },
        { id: 'settings', label: 'Ajustes', icon: <Settings size={24} /> },
    ];

    if (user.isAdmin) {
        navItems.push({ id: 'admin', label: 'Admin Panel', icon: <Shield size={24} /> });
    }

    const canVote = user.isSubscribed || (user.lastDonationDate && new Date(user.lastDonationDate).getMonth() === new Date().getMonth());

    const isNavActive = (id: string) => {
        if (id === 'app') return currentView === 'app';
        return currentView === id;
    };

    return (
        <div className="min-h-screen bg-bgMain font-sans flex text-textMain">
            {/* DESKTOP SIDEBAR */}
            <aside className="hidden lg:flex w-64 bg-white border-r border-gray-200 flex-col sticky top-0 h-screen z-20">
                <div className="p-6 flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('landing')}>
                    <Logo className="w-8 h-8 text-primary" />
                    <span className="font-bold text-xl text-gray-800">Donify</span>
                </div>

                <nav className="flex-1 px-4 space-y-2 mt-4">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => onNavigate(item.id as PageView)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${isNavActive(item.id)
                                ? 'bg-primary/10 text-primary shadow-sm'
                                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 line-through-none'
                                }`}
                        >
                            {item.icon}
                            {item.label}
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <div className="bg-gray-50 rounded-xl p-3 flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-sm">
                            {user.name.charAt(0)}
                        </div>
                        <div className="overflow-hidden">
                            <p className="font-bold text-sm text-gray-900 truncate">{user.name}</p>
                            <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="text-xs text-gray-500 truncate capitalize">{user.subscriptionTier || 'Básico'}</span>
                                <div className={`w-2 h-2 rounded-full ${canVote ? 'bg-green-500' : 'bg-red-500'}`} title={canVote ? 'Voto Habilitado' : 'Voto Deshabilitado'}></div>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={onLogout}
                        className="w-full flex items-center justify-center gap-2 text-gray-400 hover:text-red-500 text-sm font-medium transition-colors"
                    >
                        <LogOut size={16} /> Cerrar Sesión
                    </button>
                </div>
            </aside>

            {/* MAIN CONTENT AREA */}
            <div className="flex-1 flex flex-col min-h-screen relative pb-24 lg:pb-0">
                {/* Mobile Header */}
                <header className="lg:hidden bg-white/80 backdrop-blur-md px-4 py-3 border-b border-gray-200 sticky top-0 z-30 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <Logo className="w-6 h-6 text-primary" />
                        <span className="font-bold text-lg text-gray-900">Donify</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="text-gray-500 hover:text-primary"><Bell size={24} /></button>
                    </div>
                </header>

                <main className="flex-1">
                    {children}
                </main>

                {/* MOBILE BOTTOM NAVIGATION */}
                <nav className="lg:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 z-50 flex justify-between items-center px-6 py-2 pb-safe">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => onNavigate(item.id as PageView)}
                            className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${isNavActive(item.id)
                                ? 'text-primary'
                                : 'text-gray-400 hover:text-gray-600'
                                }`}
                        >
                            {React.cloneElement(item.icon as React.ReactElement<any>, { size: 24, strokeWidth: isNavActive(item.id) ? 3 : 2 })}
                            <span className="text-[10px] font-bold">{item.label}</span>
                        </button>
                    ))}
                </nav>
            </div>
        </div>
    );
}
