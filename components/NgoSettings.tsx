import React, { useState } from 'react';
import { NgoUser, PageView } from '../types';
import { ArrowLeft, Save, Upload, Building2, Mail, Phone, MapPin, Globe, Facebook, Instagram, Twitter, Linkedin, FileText } from 'lucide-react';
import { Logo } from './Logo';

interface NgoSettingsProps {
    ngoUser: NgoUser;
    onNavigate: (view: PageView) => void;
}

export default function NgoSettings({ ngoUser, onNavigate }: NgoSettingsProps) {
    const [formData, setFormData] = useState<NgoUser>(ngoUser);
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        // TODO: Save to Supabase
        setTimeout(() => {
            setIsSaving(false);
            alert('Configuración guardada exitosamente');
        }, 1000);
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

    return (
        <div className="min-h-screen bg-bgMain">
            {/* HEADER */}
            <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
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

                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-6 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50"
                        >
                            <Save size={18} />
                            {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                        </button>
                    </div>
                </div>
            </nav>

            {/* CONTENT */}
            <div className="max-w-4xl mx-auto px-6 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Configuración de Perfil</h1>
                    <p className="text-gray-600">Actualiza la información de tu organización</p>
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
                                    <option value="social">Social</option>
                                    <option value="medio-ambiente">Medio Ambiente</option>
                                    <option value="educacion">Educación</option>
                                    <option value="salud">Salud</option>
                                    <option value="derechos-humanos">Derechos Humanos</option>
                                    <option value="animales">Animales</option>
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
                                Logo
                            </label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
                                {formData.logoUrl ? (
                                    <img src={formData.logoUrl} alt="Logo" className="w-32 h-32 mx-auto object-cover rounded-lg mb-2" />
                                ) : (
                                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                                )}
                                <p className="text-sm text-gray-600">Haz clic para subir</p>
                                <p className="text-xs text-gray-400 mt-1">PNG, JPG (máx. 2MB)</p>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Banner
                            </label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
                                {formData.bannerUrl ? (
                                    <img src={formData.bannerUrl} alt="Banner" className="w-full h-32 object-cover rounded-lg mb-2" />
                                ) : (
                                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                                )}
                                <p className="text-sm text-gray-600">Haz clic para subir</p>
                                <p className="text-xs text-gray-400 mt-1">PNG, JPG (máx. 5MB)</p>
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
