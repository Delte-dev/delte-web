import React, { useState } from 'react';
import { X, Lock } from 'lucide-react';

interface AdminPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AdminPasswordModal: React.FC<AdminPasswordModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password === 'Frank@031298') {
      onSuccess();
      setPassword('');
      setError('');
    } else {
      setError('Contraseña incorrecta');
      setPassword('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-card rounded-2xl max-w-md w-full border-2 border-primary shadow-2xl">
        <div className="flex justify-between items-center p-6 border-b border-border">
          <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
            <Lock className="h-6 w-6" />
            Acceso Administrativo
          </h2>
          <button onClick={onClose} className="btn btn-secondary p-2">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Contraseña de administrador:
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              className="w-full py-3 px-4 border border-border rounded-lg bg-bg-secondary text-text-primary"
              autoFocus
              required
            />
            {error && (
              <p className="text-accent-red text-sm mt-2">{error}</p>
            )}
          </div>
          
          <button
            type="submit"
            className="w-full btn btn-primary flex items-center justify-center gap-2"
          >
            <Lock className="h-4 w-4" />
            Acceder
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminPasswordModal;