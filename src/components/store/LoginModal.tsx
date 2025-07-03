import React, { useState } from 'react';
import { X, User, Lock, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { User as UserType } from '../../types/store';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: UserType) => void;
  onRegister: () => void;
  onNotification: (type: 'success' | 'error' | 'warning' | 'info', title: string, message: string) => void;
}

const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  onRegister,
  onNotification
}) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.username || !formData.password) {
      onNotification('warning', 'Campos requeridos', 'Por favor completa todos los campos.');
      return;
    }

    setLoading(true);

    try {
      // Simple password verification (in production, use proper hashing)
      const { data: users, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', formData.username)
        .eq('is_active', true)
        .limit(1);

      if (error) {
        throw error;
      }

      if (!users || users.length === 0) {
        onNotification('error', 'Usuario no encontrado', 'El usuario no existe o está inactivo.');
        return;
      }

      const user = users[0];
      
      // Simple password check (in production, use bcrypt or similar)
      if (user.password_hash !== formData.password) {
        onNotification('error', 'Contraseña incorrecta', 'La contraseña ingresada no es correcta.');
        return;
      }

      onLogin(user);
      setFormData({ username: '', password: '' });
    } catch (error) {
      console.error('Login error:', error);
      onNotification('error', 'Error de conexión', 'No se pudo conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-card rounded-2xl max-w-md w-full border-2 border-primary shadow-2xl">
        <div className="flex justify-between items-center p-6 border-b border-border">
          <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
            <User className="h-6 w-6" />
            Iniciar Sesión
          </h2>
          <button onClick={onClose} className="btn btn-secondary p-2">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
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
                placeholder="Ingresa tu usuario"
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
                placeholder="Ingresa tu contraseña"
                required
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
                Iniciando sesión...
              </>
            ) : (
              <>
                <User className="h-4 w-4" />
                Iniciar Sesión
              </>
            )}
          </button>
          
          <div className="text-center pt-4 border-t border-border">
            <p className="text-text-secondary">
              ¿No tienes cuenta?{' '}
              <button
                type="button"
                onClick={onRegister}
                className="text-primary hover:underline font-medium"
              >
                Regístrate aquí
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;