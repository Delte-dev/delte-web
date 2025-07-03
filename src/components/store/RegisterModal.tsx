import React, { useState } from 'react';
import { X, User, Phone, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { countryCodes } from '../../utils/countries';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onLogin: () => void;
  onNotification: (type: 'success' | 'error' | 'warning' | 'info', title: string, message: string) => void;
}

const RegisterModal: React.FC<RegisterModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onLogin,
  onNotification
}) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    countryCode: '+51',
    email: '',
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone || !formData.email || !formData.username || !formData.password) {
      onNotification('warning', 'Campos requeridos', 'Por favor completa todos los campos.');
      return;
    }

    if (formData.password.length < 6) {
      onNotification('warning', 'Contraseña muy corta', 'La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setLoading(true);

    try {
      // Check if username or email already exists
      const { data: existingUsers, error: checkError } = await supabase
        .from('users')
        .select('username, email')
        .or(`username.eq.${formData.username},email.eq.${formData.email}`);

      if (checkError) {
        throw checkError;
      }

      if (existingUsers && existingUsers.length > 0) {
        const existingUser = existingUsers[0];
        if (existingUser.username === formData.username) {
          onNotification('error', 'Usuario existente', 'Este nombre de usuario ya está en uso.');
          return;
        }
        if (existingUser.email === formData.email) {
          onNotification('error', 'Email existente', 'Este correo electrónico ya está registrado.');
          return;
        }
      }

      // Create new user
      const { error: insertError } = await supabase
        .from('users')
        .insert({
          id: `user-${Date.now()}`,
          name: formData.name,
          phone: formData.phone,
          country_code: formData.countryCode,
          email: formData.email,
          username: formData.username,
          password_hash: formData.password // In production, hash this properly
        });

      if (insertError) {
        throw insertError;
      }

      onSuccess();
      setFormData({
        name: '',
        phone: '',
        countryCode: '+51',
        email: '',
        username: '',
        password: ''
      });
    } catch (error) {
      console.error('Registration error:', error);
      onNotification('error', 'Error de registro', 'No se pudo crear la cuenta. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-card rounded-2xl max-w-md w-full border-2 border-primary shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-border">
          <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
            <User className="h-6 w-6" />
            Crear Cuenta
          </h2>
          <button onClick={onClose} className="btn btn-secondary p-2">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Nombre completo:
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-text-secondary" />
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full pl-10 pr-4 py-3 border border-border rounded-lg bg-bg-secondary text-text-primary"
                placeholder="Ingresa tu nombre completo"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Teléfono:
            </label>
            <div className="flex gap-2">
              <select
                value={formData.countryCode}
                onChange={(e) => setFormData(prev => ({ ...prev, countryCode: e.target.value }))}
                className="w-32 py-3 px-3 border border-border rounded-lg bg-bg-secondary text-text-primary"
              >
                {countryCodes.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.flag} {country.code}
                  </option>
                ))}
              </select>
              <div className="relative flex-1">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-text-secondary" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full pl-10 pr-4 py-3 border border-border rounded-lg bg-bg-secondary text-text-primary"
                  placeholder="Número de teléfono"
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Correo electrónico:
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-text-secondary" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full pl-10 pr-4 py-3 border border-border rounded-lg bg-bg-secondary text-text-primary"
                placeholder="correo@ejemplo.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Usuario:
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-text-secondary" />
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                className="w-full pl-10 pr-4 py-3 border border-border rounded-lg bg-bg-secondary text-text-primary"
                placeholder="Nombre de usuario único"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Contraseña:
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-text-secondary" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                className="w-full pl-10 pr-12 py-3 border border-border rounded-lg bg-bg-secondary text-text-primary"
                placeholder="Mínimo 6 caracteres"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary hover:text-text-primary"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full btn btn-primary flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Creando cuenta...
              </>
            ) : (
              <>
                <User className="h-4 w-4" />
                Crear Cuenta
              </>
            )}
          </button>
          
          <div className="text-center pt-4 border-t border-border">
            <p className="text-text-secondary">
              ¿Ya tienes cuenta?{' '}
              <button
                type="button"
                onClick={onLogin}
                className="text-primary hover:underline font-medium"
              >
                Inicia sesión aquí
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterModal;