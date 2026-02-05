
import React from 'react';
import { PageView, User } from '../types';
import { ArrowLeft, Users, TrendingUp, DollarSign, Vote, AlertTriangle, Download } from 'lucide-react';

interface AdminPanelProps {
  onNavigate: (view: PageView) => void;
  currentUser: User;
}

export default function AdminPanel({ onNavigate, currentUser }: AdminPanelProps) {
  // Mock Data for Admin View
  const stats = {
    totalUsers: 12450,
    activeSubs: 8932,
    monthlyPool: 14502.50,
    votesCast: 6540
  };

  const liveVotes = [
    { name: 'Reforesta Futuro', votes: 2450, percent: 37 },
    { name: 'Comedores Dignos', votes: 2100, percent: 32 },
    { name: 'Tech for Kids', votes: 1990, percent: 31 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Admin Header */}
      <div className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-3">
          <button onClick={() => onNavigate('app')} className="hover:text-primary transition-colors">
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2">
              <ShieldIcon className="text-primary" /> Panel de Control
            </h1>
            <p className="text-xs text-gray-400">Logueado como {currentUser.email}</p>
          </div>
        </div>
        <div className="bg-primary/20 text-primary px-3 py-1 rounded-full text-xs font-bold border border-primary/50">
          SUPER ADMIN
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-8">
        
        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><Users size={20}/></div>
              <span className="text-xs font-bold text-green-600">+12%</span>
            </div>
            <h3 className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</h3>
            <p className="text-gray-500 text-sm">Usuarios Totales</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-green-50 text-green-600 rounded-lg"><DollarSign size={20}/></div>
              <span className="text-xs font-bold text-green-600">+5%</span>
            </div>
            <h3 className="text-2xl font-bold">{stats.monthlyPool.toLocaleString('es-ES', {style: 'currency', currency: 'EUR'})}</h3>
            <p className="text-gray-500 text-sm">Bote Acumulado (Mes)</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
             <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-purple-50 text-purple-600 rounded-lg"><Vote size={20}/></div>
              <span className="text-xs font-bold text-gray-400">73% Participación</span>
            </div>
            <h3 className="text-2xl font-bold">{stats.votesCast.toLocaleString()}</h3>
            <p className="text-gray-500 text-sm">Votos Emitidos</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
             <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-orange-50 text-orange-600 rounded-lg"><TrendingUp size={20}/></div>
              <span className="text-xs font-bold text-gray-400">Activos</span>
            </div>
            <h3 className="text-2xl font-bold">{stats.activeSubs.toLocaleString()}</h3>
            <p className="text-gray-500 text-sm">Suscripciones Activas</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          
          {/* Live Voting Monitor */}
          <div className="md:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Vote size={20} className="text-primary"/> Escrutinio en Tiempo Real
            </h2>
            <div className="space-y-6">
              {liveVotes.map((vote) => (
                <div key={vote.name}>
                  <div className="flex justify-between text-sm font-medium mb-2">
                    <span>{vote.name}</span>
                    <span className="text-gray-600">{vote.votes} votos ({vote.percent}%)</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3">
                    <div className="bg-primary h-3 rounded-full transition-all duration-1000" style={{ width: `${vote.percent}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold mb-4">Acciones Críticas</h2>
              <div className="space-y-3">
                <button className="w-full text-left px-4 py-3 bg-red-50 text-red-600 rounded-lg text-sm font-bold hover:bg-red-100 flex items-center gap-2">
                  <AlertTriangle size={16}/> Cerrar Votación Mensual
                </button>
                <button className="w-full text-left px-4 py-3 bg-gray-50 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-100 flex items-center gap-2">
                  <Download size={16}/> Exportar CSV Donantes
                </button>
              </div>
            </div>

            <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
              <h3 className="font-bold text-blue-900 text-sm mb-2">Estado del Sistema</h3>
              <div className="flex items-center gap-2 text-sm text-blue-700">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Stripe Payments: Online
              </div>
              <div className="flex items-center gap-2 text-sm text-blue-700 mt-1">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Database: Healthy
              </div>
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}

function ShieldIcon({className}: {className?: string}) {
    return <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
}
