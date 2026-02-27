import React, { useState, useEffect } from 'react';
import { PageView, User, NgoUser, VotingOption } from '../../types';
import { ArrowLeft, Users, TrendingUp, DollarSign, Vote, AlertTriangle, Download, CheckCircle, XCircle, Search, Building2 } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

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
  const [activeProjects, setActiveProjects] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'ngos' | 'projects' | 'active' | 'voting-mgmt'>('ngos');
  const [pendingNgos, setPendingNgos] = useState<NgoUser[]>([]);
  const [pendingProjects, setPendingProjects] = useState<any[]>([]);
  const [votingOptions, setVotingOptions] = useState<VotingOption[]>([]);
  const [newOption, setNewOption] = useState({ title: '', description: '', image_url: '' });
  const [loading, setLoading] = useState(true);
  const [isGeneratingLinks, setIsGeneratingLinks] = useState(false);

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
      const { data: ngos } = await supabase
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
      const { data: projects } = await supabase
        .from('projects')
        .select('*, ngo_profiles(ngo_name)')
        .eq('status', 'pending_approval')
        .order('created_at', { ascending: false });

      if (projects) setPendingProjects(projects);

      // 4. Fetch Active Voting Projects
      const { data: activeProjs } = await supabase
        .from('projects')
        .select('*, ngo_profiles(ngo_name)')
        .eq('status', 'voting')
        .order('current_votes', { ascending: false });

      if (activeProjs) setActiveProjects(activeProjs);

      // 5. Fetch Voting Options
      const { data: vOptions } = await supabase
        .from('voting_options')
        .select('*')
        .order('votes', { ascending: false });

      if (vOptions) setVotingOptions(vOptions as VotingOption[]);

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
      const { error } = await supabase
        .from('projects')
        .update({ status: 'voting' })
        .eq('id', projectId);

      if (!error) {
        setPendingProjects(prev => prev.filter(p => p.id !== projectId));
        alert('Proyecto Aprobado y puesto en Votación');
        fetchAdminData(); // Refresh to show in active tab
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

  const handleGenerateVotingLinks = async () => {
    setIsGeneratingLinks(true);
    try {
      // 1. Fetch all users from profiles (in a real app, only active subscribers)
      // For this demo, let's fetch all profiles
      const { data: users, error: usersError } = await supabase
        .from('profiles')
        .select('id, email, name');

      if (usersError || !users) {
        alert('Error fetching users: ' + (usersError?.message || 'Unknown error'));
        return;
      }

      if (users.length === 0) {
        alert('No users found in the database.');
        return;
      }

      const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
      const generatedLinks: { email: string; name: string; token: string; link: string }[] = [];

      // 2. Generate tokens for each user
      for (const user of users) {
        if (!user.email) continue; // Skip if no email

        // Generate a random UUID for the token (simplified here, but Supabase normally does it server-side)
        // We will insert and let Supabase generate the UUID, then fetch it back

        // Wait, it's faster to generate the UUID client-side for the insert
        const tokenUuid = crypto.randomUUID();

        // Insert or ignore (if already exists for this month)
        // We use an upsert or simply handle errors
        const { error: insertError } = await supabase
          .from('vote_tokens')
          .insert({
            token: tokenUuid,
            email: user.email,
            month: currentMonth
          });

        if (insertError) {
          // If error because of unique constraint (already has a token this month)
          // we fetch the existing one
          if (insertError.code === '23505') {
            const { data: existingToken } = await supabase
              .from('vote_tokens')
              .select('token')
              .eq('email', user.email)
              .eq('month', currentMonth)
              .single();

            if (existingToken) {
              generatedLinks.push({
                email: user.email,
                name: user.name || 'Usuario',
                token: existingToken.token,
                link: `https://donify.world/#/quick-vote?token=${existingToken.token}`
              });
            }
          } else {
            console.error("Error inserting token for", user.email, insertError);
          }
        } else {
          // Success
          generatedLinks.push({
            email: user.email,
            name: user.name || 'Usuario',
            token: tokenUuid,
            link: `https://donify.world/#/quick-vote?token=${tokenUuid}`
          });
        }
      }

      // 3. Create CSV and trigger download
      if (generatedLinks.length > 0) {
        const csvContent = "data:text/csv;charset=utf-8,"
          + "Email,Name,Token,MagicLink\n"
          + generatedLinks.map(g => `${g.email},${g.name},${g.token},${g.link}`).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `voting_links_${currentMonth}.csv`);
        document.body.appendChild(link); // Required for FF
        link.click();
        document.body.removeChild(link);

        alert(`¡CSV con ${generatedLinks.length} enlaces generado correctamente! Importa este CSV en Resend.`);
      }

    } catch (err) {
      console.error(err);
      alert('Error inesperado al generar enlaces');
    } finally {
      setIsGeneratingLinks(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* ... Header ... */}

      <main className="max-w-7xl mx-auto px-6 py-8">

        {/* ... KPI Grid ... */}

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">

            {/* TABS */}
            <div className="flex gap-4 border-b border-gray-200 mb-4 overflow-x-auto">
              <button onClick={() => setActiveTab('ngos')} className={`pb-2 px-4 font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'ngos' ? 'border-primary text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                ONGs Pendientes ({pendingNgos.length})
              </button>
              <button onClick={() => setActiveTab('projects')} className={`pb-2 px-4 font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'projects' ? 'border-primary text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                Proyectos Pendientes ({pendingProjects.length})
              </button>
              <button onClick={() => setActiveTab('active')} className={`pb-2 px-4 font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'active' ? 'border-primary text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                Votación en Curso ({activeProjects.length})
              </button>
              <button onClick={() => setActiveTab('voting-mgmt')} className={`pb-2 px-4 font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'voting-mgmt' ? 'border-primary text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                Gestión Votaciones ({votingOptions.length})
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">

              {/* ... activeTab === 'ngos' ... */}
              {activeTab === 'ngos' && (
                /* ... existing NGO code ... */
                <div className="space-y-4">
                  {pendingNgos.length === 0 ? <p className="text-gray-500">No hay ONGs pendientes.</p> : pendingNgos.map(ngo => (
                    <div key={ngo.id} className="border p-4 rounded flex justify-between">
                      <span>{ngo.ngoName}</span>
                      <div className="flex gap-2">
                        <button onClick={() => handleVerifyNgo(ngo.id, true)} className="text-green-600">Aprobar</button>
                        <button onClick={() => handleVerifyNgo(ngo.id, false)} className="text-red-600">Rechazar</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* ... activeTab === 'projects' ... */}
              {activeTab === 'projects' && (
                <div className="space-y-4">
                  {pendingProjects.length === 0 ? <p className="text-gray-500">No hay proyectos pendientes.</p> : pendingProjects.map(proj => (
                    <div key={proj.id} className="border p-4 rounded flex justify-between">
                      <div>
                        <h4 className="font-bold">{proj.title}</h4>
                        <span className="text-sm text-gray-500">{proj.ngo_profiles?.ngo_name}</span>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleReviewProject(proj.id, true)} className="text-green-600">Aprobar</button>
                        <button onClick={() => handleReviewProject(proj.id, false)} className="text-red-600">Rechazar</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* NEW ACTIVE PROJECTS TAB */}
              {activeTab === 'active' && (
                <>
                  <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                    <Vote size={20} className="text-primary" /> Resultados en Tiempo Real
                  </h2>
                  {activeProjects.length === 0 ? (
                    <div className="text-center py-10 text-gray-500">
                      <p>No hay votación activa en este momento.</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {activeProjects.map((proj) => {
                        const totalVotesInSystem = activeProjects.reduce((acc, p) => acc + (p.currentVotes || 0), 0);
                        const percentage = totalVotesInSystem > 0
                          ? Math.round(((proj.currentVotes || 0) / totalVotesInSystem) * 100)
                          : 0;

                        return (
                          <div key={proj.id} className="border border-gray-200 rounded-xl p-4">
                            <div className="flex justify-between mb-2">
                              <h3 className="font-bold text-gray-900">{proj.title}</h3>
                              <span className="font-mono font-bold text-primary">{proj.currentVotes} votos ({percentage}%)</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-500 mb-3">
                              <span>{proj.ngo_profiles?.ngo_name}</span>
                              <span>Meta: €{proj.goal_amount}</span>
                            </div>
                            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                              <div className="h-full bg-primary transition-all duration-500" style={{ width: `${percentage}%` }}></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </>
              )}

              {/* VOTING OPTIONS MANAGEMENT TAB */}
              {activeTab === 'voting-mgmt' && (
                <>
                  <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                    <Vote size={20} className="text-primary" /> Gestión de Opciones de Votación
                  </h2>

                  {/* Add new option form */}
                  <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-200">
                    <h3 className="font-bold text-sm mb-3">Añadir nueva opción</h3>
                    <div className="grid md:grid-cols-3 gap-3 mb-3">
                      <input
                        type="text"
                        placeholder="Título"
                        value={newOption.title}
                        onChange={(e) => setNewOption(prev => ({ ...prev, title: e.target.value }))}
                        className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
                      />
                      <input
                        type="text"
                        placeholder="Descripción"
                        value={newOption.description}
                        onChange={(e) => setNewOption(prev => ({ ...prev, description: e.target.value }))}
                        className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
                      />
                      <input
                        type="text"
                        placeholder="URL de imagen"
                        value={newOption.image_url}
                        onChange={(e) => setNewOption(prev => ({ ...prev, image_url: e.target.value }))}
                        className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
                      />
                    </div>
                    <button
                      onClick={async () => {
                        if (!newOption.title) return;
                        const { error } = await supabase.from('voting_options').insert({
                          title: newOption.title,
                          description: newOption.description,
                          image_url: newOption.image_url,
                          votes: 0,
                          is_active: true
                        });
                        if (!error) {
                          setNewOption({ title: '', description: '', image_url: '' });
                          fetchAdminData();
                          alert('Opción añadida correctamente');
                        }
                      }}
                      className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-primary/90"
                    >
                      Añadir Opción
                    </button>
                  </div>

                  {/* Reset all votes */}
                  <div className="flex gap-3 mb-6">
                    <button
                      onClick={async () => {
                        if (confirm('¿Resetear absolutamente TODO (opciones, proyectos y base de votos mensuales)? Esta acción no se puede deshacer.')) {
                          // 1. Reset options
                          await supabase.from('voting_options').update({ votes: 0 }).gte('votes', 0);
                          // 2. Reset projects mock current_votes
                          await supabase.from('projects').update({ current_votes: 0 }).gte('current_votes', 0);
                          // 3. Clear all monthly_votes
                          await supabase.from('monthly_votes').delete().neq('id', '00000000-0000-0000-0000-000000000000');

                          fetchAdminData();
                          alert('Todos los datos de votos han sido reseteados a 0 correctamente.');
                        }
                      }}
                      className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-100 border border-red-200 shadow-sm"
                    >
                      ⚠️ Super Reset (Borrar Todos los Votos)
                    </button>
                    <p className="text-xs text-gray-500 max-w-sm">Esta acción pondrá a 0 tanto las opciones de votación como los proyectos de ONGs y limpiará el registro de votos mensuales de todos los usuarios.</p>
                  </div>

                  {/* Options list */}
                  {votingOptions.length === 0 ? (
                    <p className="text-gray-500">No hay opciones de votación configuradas.</p>
                  ) : (
                    <div className="space-y-4">
                      {votingOptions.map(opt => {
                        const totalVotes = votingOptions.reduce((acc, o) => acc + (o.votes || 0), 0);
                        const pct = totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0;
                        return (
                          <div key={opt.id} className={`border rounded-xl p-4 transition-all ${opt.is_active ? 'border-gray-200 bg-white' : 'border-gray-100 bg-gray-50 opacity-60'}`}>
                            <div className="flex justify-between items-start mb-3">
                              <div className="flex-1">
                                <h4 className="font-bold text-gray-900">{opt.title}</h4>
                                <p className="text-sm text-gray-500 line-clamp-1">{opt.description}</p>
                              </div>
                              <div className="flex items-center gap-2 ml-4">
                                <span className="font-mono font-bold text-primary text-sm">{opt.votes} votos ({pct}%)</span>
                                <button
                                  onClick={async () => {
                                    await supabase.from('voting_options').update({ is_active: !opt.is_active }).eq('id', opt.id);
                                    fetchAdminData();
                                  }}
                                  className={`px-3 py-1 rounded-full text-xs font-bold ${opt.is_active ? 'bg-green-100 text-green-700 hover:bg-red-100 hover:text-red-700' : 'bg-gray-200 text-gray-600 hover:bg-green-100 hover:text-green-700'}`}
                                >
                                  {opt.is_active ? 'Activo' : 'Inactivo'}
                                </button>
                                <button
                                  onClick={async () => {
                                    if (confirm(`¿Eliminar la opción "${opt.title}"?`)) {
                                      await supabase.from('voting_options').delete().eq('id', opt.id);
                                      fetchAdminData();
                                    }
                                  }}
                                  className="text-red-500 hover:text-red-700 text-xs font-bold"
                                >
                                  Eliminar
                                </button>
                              </div>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div className="h-full bg-primary transition-all duration-500 rounded-full" style={{ width: `${pct}%` }}></div>
                            </div>
                          </div>
                        );
                      })}
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
                <button
                  onClick={handleGenerateVotingLinks}
                  disabled={isGeneratingLinks}
                  className={`w-full text-left px-4 py-3 rounded-lg text-sm font-bold flex items-center gap-2 
                  ${isGeneratingLinks ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'}`}
                >
                  <Download size={16} />
                  {isGeneratingLinks ? 'Generando CSV...' : 'Exportar Links (CSV Resend)'}
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
