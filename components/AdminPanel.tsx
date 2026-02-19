import React, { useState, useEffect } from 'react';
import { PageView, User, NgoUser } from '../types';
import { ArrowLeft, Users, TrendingUp, DollarSign, Vote, AlertTriangle, Download, CheckCircle, XCircle, Search, Building2 } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

interface AdminPanelProps {
  onNavigate: (view: PageView) => void;
  currentUser: User;
}

interface AdminStats {
  totalUsers: number;
  totalNgos: number;
  monthlyPool: number;
  votesCast: number;
}

export default function AdminPanel({ onNavigate, currentUser }: AdminPanelProps) {
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalNgos: 0,
    monthlyPool: 0,
    votesCast: 0
  });
  const [pendingNgos, setPendingNgos] = useState<NgoUser[]>([]);
  const [pendingProjects, setPendingProjects] = useState<any[]>([]); // Using any for now or need to import NgoProject type with 'ngo_profiles' join if needed for NGO Name
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'ngos' | 'projects'>('ngos');

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Stats
      const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
      const { count: ngoCount } = await supabase.from('ngo_profiles').select('*', { count: 'exact', head: true });
      const { count: voteCount } = await supabase.from('monthly_votes').select('*', { count: 'exact', head: true });

      // Mock Pool Calculation (e.g. 5€ * users)
      const calculatedPool = (userCount || 0) * 5;

      setStats({
        totalUsers: userCount || 0,
        totalNgos: ngoCount || 0,
        monthlyPool: calculatedPool,
        votesCast: voteCount || 0
      });

      // 2. Fetch Pending NGOs
      const { data: ngos, error: ngoError } = await supabase
        .from('ngo_profiles')
        .select('*')
        .eq('is_verified', false)
        .order('created_at', { ascending: false });

      if (ngos) {
        const mappedNgos: NgoUser[] = ngos.map(n => ({
          id: n.id,
          ngoName: n.ngo_name,
          email: n.email,
          isVerified: n.is_verified,
          logoUrl: n.logo_url,
          category: n.category,
          description: n.description,
          website: n.website,
          cif: n.cif
        }));
        setPendingNgos(mappedNgos);
      }

      // 3. Fetch Pending Projects
      // We also fetch the NGO name to display it.
      const { data: projects, error: projError } = await supabase
        .from('projects')
        .select('*, ngo_profiles(ngo_name)')
        .eq('status', 'pending_approval')
        .order('created_at', { ascending: false });

      if (projects) {
        setPendingProjects(projects);
      }

    } catch (error) {
      console.error("Error fetching admin data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyNgo = async (ngoId: string, approve: boolean) => {
    if (approve) {
      const { error } = await supabase
        .from('ngo_profiles')
        .update({ is_verified: true, is_active: true })
        .eq('id', ngoId);

      if (!error) {
        setPendingNgos(prev => prev.filter(n => n.id !== ngoId));
        alert('ONG Aprobada y Activada');
      }
    } else {
      if (confirm('¿Estás seguro de rechazar esta solicitud? Se eliminará el perfil.')) {
        const { error } = await supabase
          .from('ngo_profiles')
          .delete()
          .eq('id', ngoId);

        if (!error) {
          setPendingNgos(prev => prev.filter(n => n.id !== ngoId));
        }
      }
    }
  };

  const handleReviewProject = async (projectId: string, approve: boolean) => {
    if (approve) {
      // Set status to 'voting' directly? Or 'draft' (approved but not active)?
      // Prompt says: "Admin (or auto-logic) selects the top 3 projects to be active... status=voting"
      // Let's assume verifying it makes it 'voting' for simplicity or 'draft' -> Admin manually sets to voting separately?
      // Let's set to 'voting' so it appears on Landing immediately or 'approved' state if we had one.
      // Since schema only has 'draft', 'pending_approval', 'voting', 'completed'.
      // I will set it to 'voting' for now, or assume this makes it eligible.
      // Let's use 'voting' (Active).
      const { error } = await supabase
        .from('projects')
        .update({ status: 'voting' })
        .eq('id', projectId);

      if (!error) {
        setPendingProjects(prev => prev.filter(p => p.id !== projectId));
        alert('Proyecto Aprobado y puesto en Votación');
      }
    } else {
      if (confirm('¿Rechazar proyecto? Se devolverá a Borrador.')) {
        const { error } = await supabase
          .from('projects')
          .update({ status: 'draft' })
          .eq('id', projectId);

        if (!error) {
          setPendingProjects(prev => prev.filter(p => p.id !== projectId));
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Admin Header */}
      <div className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center shadow-md sticky top-0 z-50">
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
              <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><Users size={20} /></div>
              <span className="text-xs font-bold text-green-600">Total</span>
            </div>
            <h3 className="text-2xl font-bold">{loading ? '...' : stats.totalUsers.toLocaleString()}</h3>
            <p className="text-gray-500 text-sm">Usuarios Totales</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-green-50 text-green-600 rounded-lg"><DollarSign size={20} /></div>
              <span className="text-xs font-bold text-green-600">Est.</span>
            </div>
            <h3 className="text-2xl font-bold">{loading ? '...' : stats.monthlyPool.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</h3>
            <p className="text-gray-500 text-sm">Bote Acumulado</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-purple-50 text-purple-600 rounded-lg"><Vote size={20} /></div>
              <span className="text-xs font-bold text-gray-400">Mes actual</span>
            </div>
            <h3 className="text-2xl font-bold">{loading ? '...' : stats.votesCast.toLocaleString()}</h3>
            <p className="text-gray-500 text-sm">Votos Emitidos</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-orange-50 text-orange-600 rounded-lg"><Building2 size={20} /></div>
              <span className="text-xs font-bold text-gray-400">Registradas</span>
            </div>
            <h3 className="text-2xl font-bold">{loading ? '...' : stats.totalNgos.toLocaleString()}</h3>
            <p className="text-gray-500 text-sm">ONGs en Plataforma</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">

          {/* Main Column: Verifications & Approvals */}
          <div className="md:col-span-2 space-y-6">

            {/* TABS */}
            <div className="flex gap-4 border-b border-gray-200 mb-4">
              <button onClick={() => setActiveTab('ngos')} className={`pb-2 px-4 font-bold border-b-2 transition-colors ${activeTab === 'ngos' ? 'border-primary text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                ONGs Pendientes ({pendingNgos.length})
              </button>
              <button onClick={() => setActiveTab('projects')} className={`pb-2 px-4 font-bold border-b-2 transition-colors ${activeTab === 'projects' ? 'border-primary text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                Proyectos Pendientes ({pendingProjects.length})
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">

              {activeTab === 'ngos' && (
                <>
                  <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                    <AlertTriangle size={20} className="text-orange-500" /> ONGs por Verificar
                  </h2>
                  {pendingNgos.length === 0 ? (
                    <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                      <CheckCircle size={40} className="mx-auto text-green-500 mb-2 opacity-50" />
                      <p>No hay solicitudes de ONG pendientes.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {pendingNgos.map((ngo) => (
                        <div key={ngo.id} className="border border-gray-200 rounded-lg p-4 hover:border-primary/30 transition-colors">
                          <div className="flex justify-between items-start">
                            <div className="flex gap-4">
                              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                                {ngo.logoUrl ? <img src={ngo.logoUrl} className="w-full h-full object-cover" /> : <Building2 size={20} className="text-gray-400" />}
                              </div>
                              <div>
                                <h3 className="font-bold text-gray-900">{ngo.ngoName}</h3>
                                <p className="text-sm text-gray-500">{ngo.email} • {ngo.cif || 'Sin CIF'}</p>
                                <a href={ngo.website} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline mt-1 block">
                                  {ngo.website || 'Sin sitio web'}
                                </a>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleVerifyNgo(ngo.id, false)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                                title="Rechazar"
                              >
                                <XCircle size={20} />
                              </button>
                              <button
                                onClick={() => handleVerifyNgo(ngo.id, true)}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg font-bold text-sm hover:bg-green-700 flex items-center gap-2 shadow-sm"
                              >
                                <CheckCircle size={16} /> Aprobar
                              </button>
                            </div>
                          </div>
                          <div className="mt-3 bg-gray-50 p-3 rounded text-sm text-gray-700">
                            <p className="font-semibold text-xs text-gray-500 uppercase mb-1">Descripción / Misión</p>
                            {ngo.description || 'Sin descripción proporcionada.'}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {activeTab === 'projects' && (
                <>
                  <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                    <AlertTriangle size={20} className="text-orange-500" /> Proyectos Pendientes de Revisión
                  </h2>
                  {pendingProjects.length === 0 ? (
                    <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                      <CheckCircle size={40} className="mx-auto text-green-500 mb-2 opacity-50" />
                      <p>No hay proyectos pendientes de revisión.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {pendingProjects.map((proj) => (
                        <div key={proj.id} className="border border-gray-200 rounded-lg p-4 hover:border-primary/30 transition-colors">
                          <div className="flex justify-between items-start">
                            <div className="flex gap-4">
                              <div className="w-16 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                                {proj.image_url ? <img src={proj.image_url} className="w-full h-full object-cover" /> : <Building2 size={20} className="text-gray-400" />}
                              </div>
                              <div>
                                <h3 className="font-bold text-gray-900">{proj.title}</h3>
                                <p className="text-sm text-gray-500">
                                  ONG: <span className="font-semibold">{proj.ngo_profiles?.ngo_name || 'Desconocida'}</span> • {proj.category}
                                </p>
                                <p className="text-xs text-gray-500 font-mono mt-1">Meta: €{proj.goal_amount}</p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleReviewProject(proj.id, false)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                                title="Devolver a Borrador"
                              >
                                <XCircle size={20} />
                              </button>
                              <button
                                onClick={() => handleReviewProject(proj.id, true)}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg font-bold text-sm hover:bg-green-700 flex items-center gap-2 shadow-sm"
                              >
                                <CheckCircle size={16} /> Aprobar
                              </button>
                            </div>
                          </div>
                          <div className="mt-3 bg-gray-50 p-3 rounded text-sm text-gray-700">
                            <p className="font-semibold text-xs text-gray-500 uppercase mb-1">Descripción</p>
                            {proj.description || 'Sin descripción.'}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Sidebar: System Actions */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold mb-4">Acciones Críticas</h2>
              <div className="space-y-3">
                <button className="w-full text-left px-4 py-3 bg-red-50 text-red-600 rounded-lg text-sm font-bold hover:bg-red-100 flex items-center gap-2">
                  <AlertTriangle size={16} /> Cerrar Votación Mensual
                </button>
                <button className="w-full text-left px-4 py-3 bg-gray-50 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-100 flex items-center gap-2">
                  <Download size={16} /> Exportar CSV Donantes
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

function ShieldIcon({ className }: { className?: string }) {
  return <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
}
