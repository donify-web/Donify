import React, { useState, useEffect } from 'react';
import { NgoUser, PageView } from '../../types';
import { ArrowLeft, Save, Upload, Building2, Mail, Phone, MapPin, Globe, Facebook, Instagram, Twitter, Linkedin, FileText, Loader2, Check } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

interface NgoSettingsProps {
    ngoUser: NgoUser;
    onNavigate: (view: PageView) => void;
}

export default function NgoSettings({ ngoUser, onNavigate }: NgoSettingsProps) {
    const [formData, setFormData] = useState<NgoUser>(ngoUser);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState('');

    useEffect(() => {
        fetchProfile();
    }, [ngoUser.id]);

    const fetchProfile = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('ngo_profiles')
                .select('*')
                .eq('id', ngoUser.id)
                .single();

            if (error) throw error;

            if (data) {
                setFormData({
                    id: data.id,
                    ngoName: data.ngo_name,
                    email: data.email,
                    logoUrl: data.logo_url,
                    bannerUrl: data.banner_url,
                    isVerified: data.is_verified,
                    description: data.description,
                    mission: data.mission,
                    legalName: data.legal_name,
                    cif: data.cif,
                    phone: data.phone,
                    address: data.address,
                    website: data.website,
                    category: data.category,
                    socialMedia: data.social_media || {}
                });
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        setSaveMessage('');

        try {
            const updates = {
                ngo_name: formData.ngoName,
                email: formData.email,
                logo_url: formData.logoUrl,
                banner_url: formData.bannerUrl,
                description: formData.description,
                mission: formData.mission,
                legal_name: formData.legalName,
                cif: formData.cif,
                phone: formData.phone,
                address: formData.address,
                website: formData.website,
                category: formData.category,
                social_media: formData.socialMedia,
                updated_at: new Date()
            };

            const { error } = await supabase
                .from('ngo_profiles')
                .update(updates)
                .eq('id', ngoUser.id);

            if (error) throw error;

            setSaveMessage('Cambios guardados correctamente');
            setTimeout(() => setSaveMessage(''), 3000);

        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Error al guardar cambios');
        } finally {
            setIsSaving(false);
        }
    };

    const handleInputChange = (field: keyof NgoUser, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSocialMediaChange = (platform: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            socialMedia: {
                ...prev.socialMedia,
                [platform]: value
            }
        }));
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-bgMain flex items-center justify-center">
                <Loader2 className="animate-spin text-primary" size={32} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-bgMain pb-20">
            {/* HEADER */}
            <nav className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => onNavigate('ngo-dashboard')}
                                className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors"
                            >
                                <ArrowLeft size={20} />
                                <span className="font-medium">Volver al Dashboard</span>
                            </button>
                        </div>

                        <div className="flex items-center gap-4">
                            {saveMessage && (
                                <span className="text-green-600 text-sm font-semibold flex items-center gap-1 animate-fade-in">
                                    <Check size={16} /> {saveMessage}
                                </span>
                            )}
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-6 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* CONTENT */}
            <div className="max-w-4xl mx-auto px-6 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Configuración de Perfil</h1>
                    <p className="text-gray-600">Actualiza la información pública de tu organización.</p>
                </div>

                {/* INFORMACIÓN BÁSICA */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
                    <div className="flex items-center gap-2 mb-6">
                        <Building2 className="text-primary" size={24} />
                        <h2 className="text-xl font-bold text-gray-900">Información Básica</h2>
                    </div>

                    <div className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Nombre de la ONG *
                                </label>
                                <input
                                    type="text"
                                    value={formData.ngoName}
                                    onChange={(e) => handleInputChange('ngoName', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                                    placeholder="Ej: Cruz Roja Española"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Nombre Legal
                                </label>
                                <input
                                    type="text"
                                    value={formData.legalName || ''}
                                    onChange={(e) => handleInputChange('legalName', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                                    placeholder="Nombre oficial registrado"
                                />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    CIF/NIF
                                </label>
                                <input
                                    type="text"
                                    value={formData.cif || ''}
                                    onChange={(e) => handleInputChange('cif', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                                    placeholder="G12345678"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Categoría
                                </label>
                                <select
                                    value={formData.category || ''}
                                    onChange={(e) => handleInputChange('category', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                                >
                                    <option value="">Seleccionar categoría</option>
                                    <option value="Social">Social</option>
                                    <option value="Medio Ambiente">Medio Ambiente</option>
                                    <option value="Educación">Educación</option>
                                    <option value="Salud">Salud</option>
                                    <option value="Derechos Humanos">Derechos Humanos</option>
                                    <option value="Animales">Animales</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Descripción
                            </label>
                            <textarea
                                value={formData.description || ''}
                                onChange={(e) => handleInputChange('description', e.target.value)}
                                rows={3}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                                placeholder="Breve descripción de tu organización..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Misión
                            </label>
                            <textarea
                                value={formData.mission || ''}
                                onChange={(e) => handleInputChange('mission', e.target.value)}
                                rows={3}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                                placeholder="¿Cuál es la misión de tu organización?"
                            />
                        </div>
                    </div>
                </div>

                {/* IMÁGENES */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
                    <div className="flex items-center gap-2 mb-6">
                        <Upload className="text-primary" size={24} />
                        <h2 className="text-xl font-bold text-gray-900">Imágenes</h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Logo (URL por ahora)
                            </label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer group">
                                {formData.logoUrl ? (
                                    <img src={formData.logoUrl} alt="Logo" className="w-32 h-32 mx-auto object-cover rounded-lg mb-4 shadow-sm" />
                                ) : (
                                    <div className="w-32 h-32 mx-auto bg-gray-50 rounded-lg flex items-center justify-center mb-4">
                                        <Upload className="w-8 h-8 text-gray-300" />
                                    </div>
                                )}
                                <input
                                    type="url"
                                    className="w-full text-xs p-2 border border-gray-200 rounded text-gray-600 mb-2"
                                    placeholder="https://..."
                                    value={formData.logoUrl || ''}
                                    onChange={(e) => handleInputChange('logoUrl', e.target.value)}
                                />
                                <p className="text-xs text-gray-400">Pega un enlace a tu logo</p>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Banner (URL por ahora)
                            </label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer group">
                                {formData.bannerUrl ? (
                                    <img src={formData.bannerUrl} alt="Banner" className="w-full h-32 object-cover rounded-lg mb-4 shadow-sm" />
                                ) : (
                                    <div className="w-full h-32 bg-gray-50 rounded-lg flex items-center justify-center mb-4">
                                        <Upload className="w-8 h-8 text-gray-300" />
                                    </div>
                                )}
                                <input
                                    type="url"
                                    className="w-full text-xs p-2 border border-gray-200 rounded text-gray-600 mb-2"
                                    placeholder="https://..."
                                    value={formData.bannerUrl || ''}
                                    onChange={(e) => handleInputChange('bannerUrl', e.target.value)}
                                />
                                <p className="text-xs text-gray-400">Pega un enlace a tu banner</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CONTACTO */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
                    <div className="flex items-center gap-2 mb-6">
                        <Mail className="text-primary" size={24} />
                        <h2 className="text-xl font-bold text-gray-900">Información de Contacto</h2>
                    </div>

                    <div className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                    <Mail size={16} />
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                                    placeholder="contacto@ong.org"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                    <Phone size={16} />
                                    Teléfono
                                </label>
                                <input
                                    type="tel"
                                    value={formData.phone || ''}
                                    onChange={(e) => handleInputChange('phone', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                                    placeholder="+34 123 456 789"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                <MapPin size={16} />
                                Dirección
                            </label>
                            <input
                                type="text"
                                value={formData.address || ''}
                                onChange={(e) => handleInputChange('address', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                                placeholder="Calle, número, ciudad, código postal"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                <Globe size={16} />
                                Sitio Web
                            </label>
                            <input
                                type="url"
                                value={formData.website || ''}
                                onChange={(e) => handleInputChange('website', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                                placeholder="https://www.tuong.org"
                            />
                        </div>
                    </div>
                </div>

                {/* REDES SOCIALES */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Redes Sociales</h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                <Facebook size={16} className="text-blue-600" />
                                Facebook
                            </label>
                            <input
                                type="url"
                                value={formData.socialMedia?.facebook || ''}
                                onChange={(e) => handleSocialMediaChange('facebook', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                                placeholder="https://facebook.com/tuong"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                <Instagram size={16} className="text-pink-600" />
                                Instagram
                            </label>
                            <input
                                type="url"
                                value={formData.socialMedia?.instagram || ''}
                                onChange={(e) => handleSocialMediaChange('instagram', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                                placeholder="https://instagram.com/tuong"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                <Twitter size={16} className="text-blue-400" />
                                Twitter/X
                            </label>
                            <input
                                type="url"
                                value={formData.socialMedia?.twitter || ''}
                                onChange={(e) => handleSocialMediaChange('twitter', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                                placeholder="https://twitter.com/tuong"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                <Linkedin size={16} className="text-blue-700" />
                                LinkedIn
                            </label>
                            <input
                                type="url"
                                value={formData.socialMedia?.linkedin || ''}
                                onChange={(e) => handleSocialMediaChange('linkedin', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                                placeholder="https://linkedin.com/company/tuong"
                            />
                        </div>
                    </div>
                </div>

                {/* ESTADO DE VERIFICACIÓN */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-white rounded-full">
                            <FileText className="text-primary" size={24} />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-gray-900 mb-2">Estado de Verificación</h3>
                            {formData.isVerified ? (
                                <div className="flex items-center gap-2 text-green-700">
                                    <span className="font-semibold">✓ Organización Verificada</span>
                                </div>
                            ) : (
                                <div>
                                    <p className="text-gray-700 mb-3">Tu organización aún no está verificada. Para participar en las votaciones, necesitas completar el proceso de verificación.</p>
                                    <button className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg font-semibold text-sm">
                                        Solicitar Verificación
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
