import React, { useState, useEffect } from 'react';
import { SupportCard, ServiceLink, SupportButton } from '../types';
import { X, Plus, Trash2, Bold, Italic, Underline, Link as LinkIcon, Save } from 'lucide-react';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  cards: SupportCard[];
  onSaveCard: (card: SupportCard) => void;
  onDeleteCard: (cardId: string) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ 
  isOpen, 
  onClose, 
  cards, 
  onSaveCard, 
  onDeleteCard 
}) => {
  const [selectedCardId, setSelectedCardId] = useState<string>('');
  const [formData, setFormData] = useState<Partial<SupportCard>>({
    title: '',
    description: '',
    type: '',
    provider: '',
    domains: '',
    commands: '',
    email: '',
    password: '',
    steps: [],
    services: [],
    warning: '',
    compatibility: '',
    buttons: []
  });

  const [newStep, setNewStep] = useState('');
  const [newService, setNewService] = useState({ name: '', url: '' });
  const [newButton, setNewButton] = useState<Partial<SupportButton>>({ type: 'media', text: '' });

  useEffect(() => {
    if (selectedCardId) {
      const card = cards.find(c => c.id === selectedCardId);
      if (card) {
        setFormData(card);
      }
    } else {
      setFormData({
        title: '',
        description: '',
        type: '',
        provider: '',
        domains: '',
        commands: '',
        email: '',
        password: '',
        steps: [],
        services: [],
        warning: '',
        compatibility: '',
        buttons: []
      });
    }
  }, [selectedCardId, cards]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addStep = () => {
    if (newStep.trim()) {
      setFormData(prev => ({
        ...prev,
        steps: [...(prev.steps || []), newStep.trim()]
      }));
      setNewStep('');
    }
  };

  const removeStep = (index: number) => {
    setFormData(prev => ({
      ...prev,
      steps: prev.steps?.filter((_, i) => i !== index) || []
    }));
  };

  const addService = () => {
    if (newService.name.trim() && newService.url.trim()) {
      setFormData(prev => ({
        ...prev,
        services: [...(prev.services || []), { ...newService }]
      }));
      setNewService({ name: '', url: '' });
    }
  };

  const removeService = (index: number) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services?.filter((_, i) => i !== index) || []
    }));
  };

  const addButton = () => {
    if (newButton.text?.trim()) {
      const button: SupportButton = {
        type: newButton.type as 'media' | 'link' | 'whatsapp',
        text: newButton.text,
        ...(newButton.mediaId && { mediaId: newButton.mediaId }),
        ...(newButton.mediaType && { mediaType: newButton.mediaType }),
        ...(newButton.url && { url: newButton.url })
      };
      
      setFormData(prev => ({
        ...prev,
        buttons: [...(prev.buttons || []), button]
      }));
      setNewButton({ type: 'media', text: '' });
    }
  };

  const removeButton = (index: number) => {
    setFormData(prev => ({
      ...prev,
      buttons: prev.buttons?.filter((_, i) => i !== index) || []
    }));
  };

  const handleSave = () => {
    if (formData.title && formData.description) {
      const card: SupportCard = {
        id: selectedCardId || `card-${Date.now()}`,
        title: formData.title,
        description: formData.description,
        ...(formData.type && { type: formData.type }),
        ...(formData.provider && { provider: formData.provider }),
        ...(formData.domains && { domains: formData.domains }),
        ...(formData.commands && { commands: formData.commands }),
        ...(formData.email && { email: formData.email }),
        ...(formData.password && { password: formData.password }),
        ...(formData.steps && formData.steps.length > 0 && { steps: formData.steps }),
        ...(formData.services && formData.services.length > 0 && { services: formData.services }),
        ...(formData.warning && { warning: formData.warning }),
        ...(formData.compatibility && { compatibility: formData.compatibility }),
        buttons: formData.buttons || []
      };
      
      onSaveCard(card);
      setSelectedCardId('');
      setFormData({
        title: '',
        description: '',
        type: '',
        provider: '',
        domains: '',
        commands: '',
        email: '',
        password: '',
        steps: [],
        services: [],
        warning: '',
        compatibility: '',
        buttons: []
      });
    }
  };

  const handleDelete = () => {
    if (selectedCardId) {
      onDeleteCard(selectedCardId);
      setSelectedCardId('');
    }
  };

  const applyFormatting = (field: string, format: 'bold' | 'italic' | 'underline' | 'link') => {
    const input = document.querySelector(`[data-field="${field}"]`) as HTMLInputElement | HTMLTextAreaElement;
    if (!input) return;

    const start = input.selectionStart || 0;
    const end = input.selectionEnd || 0;
    const selectedText = input.value.substring(start, end);
    
    let formattedText = '';
    switch (format) {
      case 'bold':
        formattedText = `**${selectedText}**`;
        break;
      case 'italic':
        formattedText = `*${selectedText}*`;
        break;
      case 'underline':
        formattedText = `__${selectedText}__`;
        break;
      case 'link':
        const url = prompt('Ingresa la URL:');
        if (url) {
          formattedText = `[${selectedText}](${url})`;
        } else {
          return;
        }
        break;
    }

    const newValue = input.value.substring(0, start) + formattedText + input.value.substring(end);
    handleInputChange(field, newValue);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border-2 border-primary">
        <div className="sticky top-0 bg-card border-b border-border p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-primary">Panel de Administración</h2>
          <button onClick={onClose} className="btn btn-secondary p-2">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Card Selection */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Seleccionar publicación existente (opcional)
            </label>
            <select
              value={selectedCardId}
              onChange={(e) => setSelectedCardId(e.target.value)}
              className="w-full p-3 border border-border rounded-lg bg-bg-secondary text-text-primary"
            >
              <option value="">Nueva publicación</option>
              {cards.sort((a, b) => a.title.localeCompare(b.title)).map(card => (
                <option key={card.id} value={card.id}>{card.title}</option>
              ))}
            </select>
            {selectedCardId && (
              <button
                onClick={handleDelete}
                className="mt-2 btn btn-danger flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Eliminar publicación
              </button>
            )}
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Título * <span className="text-xs text-text-secondary">(Obligatorio)</span>
            </label>
            <div className="flex gap-2 mb-2">
              <button onClick={() => applyFormatting('title', 'bold')} className="btn-format">
                <Bold className="h-4 w-4" />
              </button>
              <button onClick={() => applyFormatting('title', 'italic')} className="btn-format">
                <Italic className="h-4 w-4" />
              </button>
              <button onClick={() => applyFormatting('title', 'underline')} className="btn-format">
                <Underline className="h-4 w-4" />
              </button>
              <button onClick={() => applyFormatting('title', 'link')} className="btn-format">
                <LinkIcon className="h-4 w-4" />
              </button>
            </div>
            <input
              type="text"
              data-field="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="w-full p-3 border border-border rounded-lg bg-bg-secondary text-text-primary"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Descripción * <span className="text-xs text-text-secondary">(Obligatorio)</span>
            </label>
            <div className="flex gap-2 mb-2">
              <button onClick={() => applyFormatting('description', 'bold')} className="btn-format">
                <Bold className="h-4 w-4" />
              </button>
              <button onClick={() => applyFormatting('description', 'italic')} className="btn-format">
                <Italic className="h-4 w-4" />
              </button>
              <button onClick={() => applyFormatting('description', 'underline')} className="btn-format">
                <Underline className="h-4 w-4" />
              </button>
              <button onClick={() => applyFormatting('description', 'link')} className="btn-format">
                <LinkIcon className="h-4 w-4" />
              </button>
            </div>
            <textarea
              data-field="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={4}
              className="w-full p-3 border border-border rounded-lg bg-bg-secondary text-text-primary"
              required
            />
          </div>

          {/* Optional Fields Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Tipo</label>
              <input
                type="text"
                value={formData.type || ''}
                onChange={(e) => handleInputChange('type', e.target.value)}
                className="w-full p-3 border border-border rounded-lg bg-bg-secondary text-text-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Proveedor</label>
              <input
                type="text"
                value={formData.provider || ''}
                onChange={(e) => handleInputChange('provider', e.target.value)}
                className="w-full p-3 border border-border rounded-lg bg-bg-secondary text-text-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Dominios</label>
              <input
                type="text"
                value={formData.domains || ''}
                onChange={(e) => handleInputChange('domains', e.target.value)}
                className="w-full p-3 border border-border rounded-lg bg-bg-secondary text-text-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Comandos</label>
              <input
                type="text"
                value={formData.commands || ''}
                onChange={(e) => handleInputChange('commands', e.target.value)}
                className="w-full p-3 border border-border rounded-lg bg-bg-secondary text-text-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Correo</label>
              <input
                type="email"
                value={formData.email || ''}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full p-3 border border-border rounded-lg bg-bg-secondary text-text-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Contraseña</label>
              <input
                type="text"
                value={formData.password || ''}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className="w-full p-3 border border-border rounded-lg bg-bg-secondary text-text-primary"
              />
            </div>
          </div>

          {/* Steps */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Pasos</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newStep}
                onChange={(e) => setNewStep(e.target.value)}
                placeholder="Agregar nuevo paso"
                className="flex-1 p-3 border border-border rounded-lg bg-bg-secondary text-text-primary"
                onKeyPress={(e) => e.key === 'Enter' && addStep()}
              />
              <button onClick={addStep} className="btn btn-primary">
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-2">
              {formData.steps?.map((step, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="text-sm text-text-secondary">{index + 1}.</span>
                  <span className="flex-1 p-2 bg-bg-secondary rounded">{step}</span>
                  <button onClick={() => removeStep(index)} className="btn btn-danger p-2">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Servicios</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newService.name}
                onChange={(e) => setNewService(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Nombre del servicio"
                className="flex-1 p-3 border border-border rounded-lg bg-bg-secondary text-text-primary"
              />
              <input
                type="url"
                value={newService.url}
                onChange={(e) => setNewService(prev => ({ ...prev, url: e.target.value }))}
                placeholder="URL del servicio"
                className="flex-1 p-3 border border-border rounded-lg bg-bg-secondary text-text-primary"
              />
              <button onClick={addService} className="btn btn-primary">
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-2">
              {formData.services?.map((service, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="text-sm text-text-secondary">{index + 1}.</span>
                  <span className="flex-1 p-2 bg-bg-secondary rounded">
                    {service.name} - {service.url}
                  </span>
                  <button onClick={() => removeService(index)} className="btn btn-danger p-2">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Warning and Compatibility */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Advertencia</label>
              <div className="flex gap-2 mb-2">
                <button onClick={() => applyFormatting('warning', 'bold')} className="btn-format">
                  <Bold className="h-4 w-4" />
                </button>
                <button onClick={() => applyFormatting('warning', 'italic')} className="btn-format">
                  <Italic className="h-4 w-4" />
                </button>
                <button onClick={() => applyFormatting('warning', 'underline')} className="btn-format">
                  <Underline className="h-4 w-4" />
                </button>
                <button onClick={() => applyFormatting('warning', 'link')} className="btn-format">
                  <LinkIcon className="h-4 w-4" />
                </button>
              </div>
              <textarea
                data-field="warning"
                value={formData.warning || ''}
                onChange={(e) => handleInputChange('warning', e.target.value)}
                rows={3}
                className="w-full p-3 border border-border rounded-lg bg-bg-secondary text-text-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Compatibilidad</label>
              <div className="flex gap-2 mb-2">
                <button onClick={() => applyFormatting('compatibility', 'bold')} className="btn-format">
                  <Bold className="h-4 w-4" />
                </button>
                <button onClick={() => applyFormatting('compatibility', 'italic')} className="btn-format">
                  <Italic className="h-4 w-4" />
                </button>
                <button onClick={() => applyFormatting('compatibility', 'underline')} className="btn-format">
                  <Underline className="h-4 w-4" />
                </button>
                <button onClick={() => applyFormatting('compatibility', 'link')} className="btn-format">
                  <LinkIcon className="h-4 w-4" />
                </button>
              </div>
              <textarea
                data-field="compatibility"
                value={formData.compatibility || ''}
                onChange={(e) => handleInputChange('compatibility', e.target.value)}
                rows={3}
                className="w-full p-3 border border-border rounded-lg bg-bg-secondary text-text-primary"
              />
            </div>
          </div>

          {/* Buttons */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Botones</label>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-2">
              <select
                value={newButton.type}
                onChange={(e) => setNewButton(prev => ({ ...prev, type: e.target.value as 'media' | 'link' | 'whatsapp' }))}
                className="p-3 border border-border rounded-lg bg-bg-secondary text-text-primary"
              >
                <option value="media">Imagen/Video</option>
                <option value="link">Enlace</option>
                <option value="whatsapp">WhatsApp</option>
              </select>
              <input
                type="text"
                value={newButton.text || ''}
                onChange={(e) => setNewButton(prev => ({ ...prev, text: e.target.value }))}
                placeholder="Texto del botón"
                className="p-3 border border-border rounded-lg bg-bg-secondary text-text-primary"
              />
              {newButton.type === 'media' && (
                <>
                  <select
                    value={newButton.mediaType || 'image'}
                    onChange={(e) => setNewButton(prev => ({ ...prev, mediaType: e.target.value as 'image' | 'video' }))}
                    className="p-3 border border-border rounded-lg bg-bg-secondary text-text-primary"
                  >
                    <option value="image">Imagen</option>
                    <option value="video">Video</option>
                  </select>
                  <input
                    type="text"
                    value={newButton.mediaId || ''}
                    onChange={(e) => setNewButton(prev => ({ ...prev, mediaId: e.target.value }))}
                    placeholder="ID de Google Drive"
                    className="p-3 border border-border rounded-lg bg-bg-secondary text-text-primary"
                  />
                </>
              )}
              {newButton.type === 'link' && (
                <input
                  type="url"
                  value={newButton.url || ''}
                  onChange={(e) => setNewButton(prev => ({ ...prev, url: e.target.value }))}
                  placeholder="URL del enlace"
                  className="p-3 border border-border rounded-lg bg-bg-secondary text-text-primary"
                />
              )}
              <button onClick={addButton} className="btn btn-primary">
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-2">
              {formData.buttons?.map((button, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="text-sm text-text-secondary capitalize">{button.type}:</span>
                  <span className="flex-1 p-2 bg-bg-secondary rounded">
                    {button.text}
                    {button.mediaId && ` (ID: ${button.mediaId})`}
                    {button.url && ` (${button.url})`}
                  </span>
                  <button onClick={() => removeButton(index)} className="btn btn-danger p-2">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-6 border-t border-border">
            <button
              onClick={handleSave}
              disabled={!formData.title || !formData.description}
              className="btn btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="h-4 w-4" />
              {selectedCardId ? 'Actualizar' : 'Crear'} Publicación
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;