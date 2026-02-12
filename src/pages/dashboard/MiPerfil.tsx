import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { getUserProfile, updateUserProfile, createUserProfile, getSedes } from '@/services/database';
import { uploadAvatar } from '@/services/storage';
import { toast } from 'sonner';
import { QRCodeSVG } from 'qrcode.react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Camera,
  Edit,
  Save,
  X,
  Eye,
  EyeOff,
  Shield,
  Key,
  Bell,
  Upload,
  Plus,
  Minus,
  CheckCircle,
  AlertTriangle,
  Info,
  Lock,
  Unlock,
  Smartphone,
  CreditCard,
  Heart,
  Activity,
  Trash2,
  Copy,
  ExternalLink,
  QrCode,
  Scan,
  Loader2
} from 'lucide-react';

// Change Password Form Component
const ChangePasswordForm: React.FC<{ userId: string | null }> = ({ userId }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChanging, setIsChanging] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userId) {
      toast.error('No se pudo identificar al usuario');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    try {
      setIsChanging(true);

      // Update password using Supabase Auth
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        toast.error(error.message || 'Error al cambiar la contraseña');
        return;
      }

      toast.success('Contraseña actualizada exitosamente');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      console.error('Error changing password:', error);
      toast.error('Error inesperado al cambiar la contraseña');
    } finally {
      setIsChanging(false);
    }
  };

  return (
    <form onSubmit={handleChangePassword} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Contraseña Actual</label>
        <div className="relative">
          <input
            type={showCurrentPassword ? 'text' : 'password'}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white focus:outline-none focus:border-gray-400 pr-10"
            placeholder="Ingresa tu contraseña actual"
          />
          <button
            type="button"
            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
          >
            {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Nueva Contraseña</label>
        <div className="relative">
          <input
            type={showNewPassword ? 'text' : 'password'}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white focus:outline-none focus:border-gray-400 pr-10"
            placeholder="Ingresa tu nueva contraseña"
          />
          <button
            type="button"
            onClick={() => setShowNewPassword(!showNewPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
          >
            {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Confirmar Nueva Contraseña</label>
        <div className="relative">
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white focus:outline-none focus:border-gray-400 pr-10"
            placeholder="Confirma tu nueva contraseña"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
          >
            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={isChanging || !currentPassword || !newPassword || !confirmPassword}
        className="px-4 py-2 rounded-lg font-medium transition-colors text-black flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        style={{backgroundColor: '#b5fc00'}}
        onMouseEnter={(e) => {
          if (!isChanging && currentPassword && newPassword && confirmPassword) {
            (e.target as HTMLButtonElement).style.backgroundColor = '#a3e600';
          }
        }}
        onMouseLeave={(e) => {
          if (!isChanging && currentPassword && newPassword && confirmPassword) {
            (e.target as HTMLButtonElement).style.backgroundColor = '#b5fc00';
          }
        }}
      >
        {isChanging ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Cambiando...
          </>
        ) : (
          <>
            <Key className="w-4 h-4" />
            Cambiar Contraseña
          </>
        )}
      </button>
    </form>
  );
};

const MiPerfil: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [sedes, setSedes] = useState<Array<{id: string, name: string}>>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const defaultProfile = {
    name: '',
    email: '',
    phone: '',
    birthDate: '',
    age: '',
    gender: 'Femenino' as 'Femenino' | 'Masculino' | 'Otro',
    sede: '',
    sedeId: '',
    memberSince: '',
    avatar: '',
    gymCode: '',
    emergencyContact: {
      name: '',
      phone: '',
      relationship: ''
    }
  };

  const [profile, setProfile] = useState(defaultProfile);

  const tabs = [
    { id: 'personal', name: 'Personal', icon: User },
    { id: 'seguridad', name: 'Seguridad', icon: Shield }
  ];


  // Load user profile and sedes on mount
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setIsLoading(true);
        
        // Get current user
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
          console.error('Error getting user:', authError);
          toast.error('No se pudo obtener la información del usuario');
          setIsLoading(false);
          return;
        }

        setUserId(user.id);

        // Load sedes with error handling
        let sedesData: any[] = [];
        try {
          sedesData = await getSedes();
          setSedes(sedesData.map(s => ({ id: s.id, name: s.name })));
        } catch (sedesError) {
          console.error('Error loading sedes:', sedesError);
          // Continue even if sedes fail
        }

        // Load user profile with error handling
        let profileData = null;
        try {
          profileData = await getUserProfile(user.id);
        } catch (profileError: any) {
          console.error('Error loading user profile:', profileError);
          // If it's a schema cache error, continue with default profile
          if (profileError?.code === 'PGRST204' || profileError?.message?.includes('schema cache')) {
            console.warn('Schema cache issue, using default profile');
          } else {
            toast.error('Error al cargar el perfil. Intenta recargar la página.');
            setIsLoading(false);
            return;
          }
        }
        
        if (profileData) {
          // Find sede name by id
          const sede = sedesData.find(s => s.id === profileData.sede_id);
          
          setProfile({
            name: profileData.full_name || '',
            email: profileData.email || '',
            phone: profileData.phone || '',
            birthDate: profileData.birth_date || '',
            age: profileData.age?.toString() || '',
            gender: (profileData.gender as 'Femenino' | 'Masculino' | 'Otro') || 'Femenino',
            sede: sede?.name || '',
            sedeId: profileData.sede_id || '',
            memberSince: profileData.member_since || new Date().toISOString(),
            avatar: profileData.avatar_url || '',
            gymCode: profileData.gym_code || '',
            emergencyContact: {
              name: profileData.emergency_contact_name || '',
              phone: profileData.emergency_contact_phone || '',
              relationship: profileData.emergency_contact_relationship || ''
            }
          });
        } else {
          // If no profile exists, create one with user email
          setProfile({
            ...defaultProfile,
            email: user.email || '',
            memberSince: new Date().toISOString()
          });
        }
      } catch (error: any) {
        console.error('Unexpected error loading profile:', error);
        toast.error('Error inesperado al cargar el perfil');
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleSave = async () => {
    if (!userId) {
      toast.error('Usuario no autenticado');
      return;
    }

    try {
      setIsSaving(true);

      // Find sede_id from sede name
      const selectedSede = sedes.find(s => s.name === profile.sede);
      const sedeId = selectedSede?.id || null;

      // Prepare update data - exclude optional fields that might not be in schema cache
      const updateData: any = {
        full_name: profile.name,
        email: profile.email,
        phone: profile.phone,
        birth_date: profile.birthDate || null,
        age: profile.age ? parseInt(profile.age) : null,
        gender: profile.gender,
        sede_id: sedeId,
        emergency_contact_name: profile.emergencyContact.name || null,
        emergency_contact_phone: profile.emergencyContact.phone || null,
        emergency_contact_relationship: profile.emergencyContact.relationship || null,
        avatar_url: profile.avatar || null
      };

      // Only include optional fields if they have values
      // These will be added once schema cache refreshes
      if (profile.gymCode && profile.gymCode.trim() !== '') {
        updateData.gym_code = profile.gymCode;
      }

      // Check if profile exists, if not we need to create it
      const existingProfile = await getUserProfile(userId);
      
      if (!existingProfile) {
        // Create new profile
        const created = await createUserProfile(userId, updateData);
        
        if (created) {
          toast.success('Perfil creado exitosamente');
        } else {
          toast.error('Error al crear el perfil');
          return;
        }
      } else {
        // Update existing profile
        const updated = await updateUserProfile(userId, updateData);
        
        if (updated) {
          toast.success('Perfil actualizado exitosamente');
        } else {
          toast.error('Error al actualizar el perfil');
          return;
        }
      }

      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Error al guardar el perfil');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = async () => {
    if (!userId) return;

    // Reload profile from database
    const profileData = await getUserProfile(userId);
    if (profileData) {
      const sedesData = await getSedes();
      const sede = sedesData.find(s => s.id === profileData.sede_id);
      
      setProfile({
        name: profileData.full_name || '',
        email: profileData.email || '',
        phone: profileData.phone || '',
        birthDate: profileData.birth_date || '',
        age: profileData.age?.toString() || '',
        gender: (profileData.gender as 'Femenino' | 'Masculino' | 'Otro') || 'Femenino',
        sede: sede?.name || '',
        sedeId: profileData.sede_id || '',
        memberSince: profileData.member_since || new Date().toISOString(),
        avatar: profileData.avatar_url || '',
        gymCode: profileData.gym_code || '',
        emergencyContact: {
          name: profileData.emergency_contact_name || '',
          phone: profileData.emergency_contact_phone || '',
          relationship: profileData.emergency_contact_relationship || ''
        }
      });
    }
    setIsEditing(false);
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !userId) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Por favor selecciona un archivo de imagen');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('La imagen debe ser menor a 5MB');
      return;
    }

    try {
      setIsUploadingAvatar(true);

      // Upload image to Supabase Storage
      const avatarUrl = await uploadAvatar(userId, file);

      if (!avatarUrl) {
        toast.error('Error al subir la imagen');
        setIsUploadingAvatar(false);
        return;
      }

      // Update profile with new avatar URL
      const updated = await updateUserProfile(userId, { avatar_url: avatarUrl });

      if (updated) {
        setProfile({ ...profile, avatar: avatarUrl });
        toast.success('Foto de perfil actualizada exitosamente');
      } else {
        toast.error('Error al actualizar el perfil');
      }
    } catch (error: any) {
      console.error('Error uploading avatar:', error);
      toast.error(error.message || 'Error al subir la imagen');
    } finally {
      setIsUploadingAvatar(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400 mx-auto mb-4" />
          <p className="text-gray-400">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">Mi Perfil</h1>
          <p className="text-gray-300 mt-1 text-sm sm:text-base">Gestiona tu información personal y configuraciones</p>
        </div>
      </div>

      {/* Profile Header */}
      <div className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
          <div className="relative">
            {profile.avatar ? (
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden bg-gray-600 flex items-center justify-center border-2 border-gray-700">
                <img 
                  src={profile.avatar} 
                  alt="Avatar" 
                  className="w-full h-full object-cover"
                  onError={() => {
                    // If image fails to load, clear avatar URL to show default icon
                    setProfile({ ...profile, avatar: '' });
                  }}
                />
              </div>
            ) : (
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gray-600 flex items-center justify-center border-2 border-gray-700">
                <User className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" />
              </div>
            )}
            <button 
              onClick={handleAvatarClick}
              disabled={isUploadingAvatar}
              className="absolute bottom-0 right-0 w-7 h-7 sm:w-8 sm:h-8 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploadingAvatar ? (
                <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 text-gray-300 animate-spin" />
              ) : (
                <Camera className="w-3 h-3 sm:w-4 sm:h-4 text-gray-300" />
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </div>
          <div className="flex-1 w-full sm:w-auto text-center sm:text-left">
            <h2 className="text-xl sm:text-2xl font-bold text-white">{profile.name}</h2>
            <p className="text-gray-400 mb-2 text-sm sm:text-base">Miembro desde {new Date(profile.memberSince).toLocaleDateString('es-GT')}</p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 sm:gap-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-gray-300 text-xs sm:text-sm">{profile.sede}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-gray-300 text-xs sm:text-sm">{profile.gender}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <button 
              onClick={() => setShowQR(!showQR)}
              className="w-full sm:w-auto px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <QrCode className="w-4 h-4" />
              QR Code
            </button>
            {!isEditing ? (
              <button 
                onClick={() => setIsEditing(true)}
                className="w-full sm:w-auto px-4 py-2 rounded-lg font-medium transition-colors text-black flex items-center justify-center gap-2 text-sm sm:text-base"
                style={{backgroundColor: '#b5fc00'}}
                onMouseEnter={(e) => {
                  (e.target as HTMLButtonElement).style.backgroundColor = '#a3e600';
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLButtonElement).style.backgroundColor = '#b5fc00';
                }}
              >
                <Edit className="w-4 h-4" />
                Editar
              </button>
            ) : (
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <button 
                  onClick={handleCancel}
                  className="w-full sm:w-auto px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <X className="w-4 h-4" />
                  Cancelar
                </button>
                <button 
                  onClick={handleSave}
                  disabled={isSaving}
                  className="w-full sm:w-auto px-4 py-2 rounded-lg font-medium transition-colors text-black flex items-center justify-center gap-2 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{backgroundColor: '#b5fc00'}}
                  onMouseEnter={(e) => {
                    if (!isSaving) {
                      (e.target as HTMLButtonElement).style.backgroundColor = '#a3e600';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSaving) {
                      (e.target as HTMLButtonElement).style.backgroundColor = '#b5fc00';
                    }
                  }}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Guardar
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <div className="flex gap-2 mb-6">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                  selectedTab === tab.id
                    ? 'text-black'
                    : 'text-gray-300 hover:text-white bg-gray-700 hover:bg-gray-600'
                }`}
                style={selectedTab === tab.id ? {backgroundColor: '#b5fc00'} : {}}
              >
                <Icon className="w-4 h-4" />
                {tab.name}
              </button>
            );
          })}
        </div>

        {/* Personal Information */}
        {selectedTab === 'personal' && (
          <div className="space-y-6">
            <h3 className="text-lg sm:text-xl font-bold text-white">Información Personal</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Nombre Completo</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({...profile, name: e.target.value})}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-gray-500 disabled:bg-gray-800 disabled:text-gray-400"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Correo Electrónico</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({...profile, email: e.target.value})}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-gray-500 disabled:bg-gray-800 disabled:text-gray-400"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Teléfono</label>
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => setProfile({...profile, phone: e.target.value})}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-gray-500 disabled:bg-gray-800 disabled:text-gray-400"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Fecha de Nacimiento</label>
                <input
                  type="date"
                  value={profile.birthDate}
                  onChange={(e) => setProfile({...profile, birthDate: e.target.value})}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-gray-500 disabled:bg-gray-800 disabled:text-gray-400"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Edad</label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={profile.age}
                  onChange={(e) => setProfile({...profile, age: e.target.value})}
                  disabled={!isEditing}
                  placeholder="Ingresa tu edad"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-gray-500 disabled:bg-gray-800 disabled:text-gray-400"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Género</label>
                <select
                  value={profile.gender}
                  onChange={(e) => setProfile({...profile, gender: e.target.value as 'Femenino' | 'Masculino' | 'Otro'})}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-gray-500 disabled:bg-gray-800 disabled:text-gray-400"
                >
                  <option value="Femenino">Femenino</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Sede Principal</label>
                <select
                  value={profile.sede}
                  onChange={(e) => {
                    const selectedSede = sedes.find(s => s.name === e.target.value);
                    setProfile({
                      ...profile, 
                      sede: e.target.value,
                      sedeId: selectedSede?.id || ''
                    });
                  }}
                  disabled={!isEditing || isLoading}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-gray-500 disabled:bg-gray-800 disabled:text-gray-400"
                >
                  <option value="">Seleccionar sede</option>
                  {sedes.map(sede => (
                    <option key={sede.id} value={sede.name}>{sede.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Mi Código</label>
                <input
                  type="text"
                  value={profile.gymCode}
                  onChange={(e) => setProfile({...profile, gymCode: e.target.value})}
                  disabled={!isEditing}
                  placeholder="Ingresa el código que te dio el gimnasio"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-gray-500 disabled:bg-gray-800 disabled:text-gray-400"
                />
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="bg-gray-700 rounded-lg p-4">
              <h4 className="text-white font-medium mb-4">Contacto de Emergencia</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Nombre</label>
                  <input
                    type="text"
                    value={profile.emergencyContact.name}
                    onChange={(e) => setProfile({
                      ...profile, 
                      emergencyContact: {...profile.emergencyContact, name: e.target.value}
                    })}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white focus:outline-none focus:border-gray-400 disabled:bg-gray-700 disabled:text-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Teléfono</label>
                  <input
                    type="tel"
                    value={profile.emergencyContact.phone}
                    onChange={(e) => setProfile({
                      ...profile, 
                      emergencyContact: {...profile.emergencyContact, phone: e.target.value}
                    })}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white focus:outline-none focus:border-gray-400 disabled:bg-gray-700 disabled:text-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Relación</label>
                  <input
                    type="text"
                    value={profile.emergencyContact.relationship}
                    onChange={(e) => setProfile({
                      ...profile, 
                      emergencyContact: {...profile.emergencyContact, relationship: e.target.value}
                    })}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white focus:outline-none focus:border-gray-400 disabled:bg-gray-700 disabled:text-gray-400"
                  />
                </div>
              </div>
            </div>

          </div>
        )}

        {/* Security */}
        {selectedTab === 'seguridad' && (
          <div className="space-y-6">
            <h3 className="text-lg sm:text-xl font-bold text-white">Seguridad</h3>
            
            <div className="bg-gray-700 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-white font-medium mb-1">Contraseña</h4>
                  <p className="text-gray-400 text-sm">Actualiza tu contraseña para mantener tu cuenta segura</p>
                </div>
              </div>
              
              <ChangePasswordForm userId={userId} />
            </div>
          </div>
        )}

      </div>

      {/* Quick Actions */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-xl font-bold text-white mb-4">Acciones Rápidas</h3>
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
          <button className="p-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-left">
            <div className="flex items-center gap-3 mb-2">
              <Trash2 className="w-5 h-5" style={{color: '#b5fc00'}} />
              <span className="text-white font-medium">Eliminar Cuenta</span>
            </div>
            <p className="text-gray-400 text-sm">Eliminar permanentemente</p>
          </button>
        </div>
      </div>

      {/* QR Code Modal */}
      {showQR && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4" onClick={() => setShowQR(false)}>
          <div className="bg-gray-800 rounded-xl p-6 max-w-sm w-full border border-gray-700" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold text-lg">Mi Código QR</h3>
              <button 
                onClick={() => setShowQR(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="text-center">
              <div className="w-64 h-64 bg-white rounded-lg mx-auto mb-4 p-4 flex items-center justify-center">
                {userId && profile.email ? (
                  <QRCodeSVG
                    value={JSON.stringify({
                      userId: userId,
                      email: profile.email,
                      name: profile.name,
                      memberId: `SCANDINAVIA-${userId.substring(0, 8).toUpperCase()}`,
                      memberSince: profile.memberSince || new Date().toISOString()
                    })}
                    size={224}
                    level="H"
                    includeMargin={true}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                  </div>
                )}
              </div>
              
              <p className="text-gray-300 text-sm mb-4">
                Muestra este código en la recepción para acceso rápido
              </p>
              
              {userId && (
                <div className="bg-gray-700 rounded-lg p-3 mb-4">
                  <p className="text-gray-400 text-xs mb-1">ID de Miembro</p>
                  <p className="text-white font-mono text-sm">
                    SCANDINAVIA-{userId.substring(0, 8).toUpperCase()}
                  </p>
                </div>
              )}
              
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    if (userId && profile.email) {
                      const qrData = JSON.stringify({
                        userId: userId,
                        email: profile.email,
                        name: profile.name,
                        memberId: `SCANDINAVIA-${userId.substring(0, 8).toUpperCase()}`,
                        memberSince: profile.memberSince || new Date().toISOString()
                      });
                      navigator.clipboard.writeText(qrData);
                      toast.success('Código QR copiado al portapapeles');
                    }
                  }}
                  className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  Copiar
                </button>
                <button
                  onClick={() => setShowQR(false)}
                  className="flex-1 px-4 py-2 rounded-lg font-medium transition-colors text-black"
                  style={{backgroundColor: '#b5fc00'}}
                  onMouseEnter={(e) => {
                    (e.target as HTMLButtonElement).style.backgroundColor = '#a3e600';
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLButtonElement).style.backgroundColor = '#b5fc00';
                  }}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MiPerfil;