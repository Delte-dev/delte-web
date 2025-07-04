import React, { useState, useEffect } from 'react';
import { X, Shield, Plus, Edit, Trash2, Save, Users, Package, Folder, HelpCircle, Settings, MessageSquare } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Product, Category, FAQ, SocialLink, SiteSettings, User, SupportTicket } from '../../types/store';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onNotification: (type: 'success' | 'error' | 'warning' | 'info', title: string, message: string) => void;
}

type TabType = 'products' | 'categories' | 'users' | 'support' | 'faqs' | 'social' | 'settings';

const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onClose, onNotification }) => {
  const [activeTab, setActiveTab] = useState<TabType>('products');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);

  // Data states
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);

  // Form states
  const [selectedItem, setSelectedItem] = useState<string>('');
  const [formData, setFormData] = useState<any>({});

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'Delte030725') {
      setIsAuthenticated(true);
      loadAllData();
      onNotification('success', '✅ Acceso Concedido', 'Bienvenido al panel de administración.');
    } else {
      onNotification('error', '❌ Acceso Denegado', 'Contraseña incorrecta.');
      setPassword('');
    }
  };

  const loadAllData = async () => {
    setLoading(true);
    try {
      // Load all data in parallel
      const [
        productsRes,
        categoriesRes,
        usersRes,
        supportRes,
        faqsRes,
        socialRes,
        settingsRes
      ] = await Promise.all([
        supabase.from('products').select('*, category:categories(*)').order('created_at', { ascending: false }),
        supabase.from('categories').select('*').order('name'),
        supabase.from('users').select('*').order('created_at', { ascending: false }),
        supabase.from('support_tickets').select('*').order('created_at', { ascending: false }),
        supabase.from('faqs').select('*').order('order_index'),
        supabase.from('social_links').select('*').order('order_index'),
        supabase.from('site_settings').select('*').limit(1).single()
      ]);

      setProducts(productsRes.data || []);
      setCategories(categoriesRes.data || []);
      setUsers(usersRes.data || []);
      setSupportTickets(supportRes.data || []);
      setFaqs(faqsRes.data || []);
      setSocialLinks(socialRes.data || []);
      setSiteSettings(settingsRes.data);
    } catch (error) {
      console.error('Error loading admin data:', error);
      onNotification('error', '❌ Error', 'No se pudieron cargar los datos.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData || Object.keys(formData).length === 0) {
      onNotification('warning', '⚠️ Sin Cambios', 'No hay datos para guardar.');
      return;
    }

    setLoading(true);
    try {
      let table = '';
      let data = { ...formData };

      switch (activeTab) {
        case 'products':
          table = 'products';
          if (!selectedItem) data.id = `prod-${Date.now()}`;
          break;
        case 'categories':
          table = 'categories';
          if (!selectedItem) {
            data.id = `cat-${Date.now()}`;
            data.slug = data.name?.toLowerCase().replace(/\s+/g, '-') || '';
          }
          break;
        case 'users':
          table = 'users';
          if (!selectedItem) data.id = `user-${Date.now()}`;
          break;
        case 'faqs':
          table = 'faqs';
          if (!selectedItem) data.id = `faq-${Date.now()}`;
          break;
        case 'social':
          table = 'social_links';
          if (!selectedItem) data.id = `social-${Date.now()}`;
          break;
        case 'settings':
          table = 'site_settings';
          break;
      }

      if (selectedItem && activeTab !== 'settings') {
        // Update existing
        const { error } = await supabase
          .from(table)
          .update({ ...data, updated_at: new Date().toISOString() })
          .eq('id', selectedItem);
        if (error) throw error;
      } else if (activeTab === 'settings') {
        // Update settings
        const { error } = await supabase
          .from(table)
          .update({ ...data, updated_at: new Date().toISOString() })
          .eq('id', siteSettings?.id);
        if (error) throw error;
      } else {
        // Insert new
        const { error } = await supabase
          .from(table)
          .insert({ ...data, created_at: new Date().toISOString(), updated_at: new Date().toISOString() });
        if (error) throw error;
      }

      await loadAllData();
      setSelectedItem('');
      setFormData({});
      onNotification('success', '✅ ¡Éxito!', 'Datos guardados correctamente.');
      
      // Force page reload to show changes
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error('Save error:', error);
      onNotification('error', '❌ Error', 'No se pudieron guardar los datos.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!selectedItem || !formData || Object.keys(formData).length === 0) {
      onNotification('warning', '⚠️ Sin Cambios', 'Selecciona un elemento y modifica los datos para actualizar.');
      return;
    }

    setLoading(true);
    try {
      let table = '';
      let data = { ...formData };

      switch (activeTab) {
        case 'products':
          table = 'products';
          break;
        case 'categories':
          table = 'categories';
          if (data.name) {
            data.slug = data.name.toLowerCase().replace(/\s+/g, '-');
          }
          break;
        case 'users':
          table = 'users';
          break;
        case 'faqs':
          table = 'faqs';
          break;
        case 'social':
          table = 'social_links';
          break;
        case 'settings':
          table = 'site_settings';
          break;
      }

      if (activeTab === 'settings') {
        const { error } = await supabase
          .from(table)
          .update({ ...data, updated_at: new Date().toISOString() })
          .eq('id', siteSettings?.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from(table)
          .update({ ...data, updated_at: new Date().toISOString() })
          .eq('id', selectedItem);
        if (error) throw error;
      }

      await loadAllData();
      setSelectedItem('');
      setFormData({});
      onNotification('success', '✅ ¡Actualizado!', 'Datos actualizados correctamente.');
      
      // Force page reload to show changes
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error('Update error:', error);
      onNotification('error', '❌ Error', 'No se pudieron actualizar los datos.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este elemento?')) return;

    setLoading(true);
    try {
      let table = '';
      switch (activeTab) {
        case 'products': table = 'products'; break;
        case 'categories': table = 'categories'; break;
        case 'users': table = 'users'; break;
        case 'faqs': table = 'faqs'; break;
        case 'social': table = 'social_links'; break;
      }

      const { error } = await supabase.from(table).delete().eq('id', id);
      if (error) throw error;

      await loadAllData();
      onNotification('success', '🗑️ Eliminado', 'Elemento eliminado correctamente.');
      
      // Force page reload to show changes
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error('Delete error:', error);
      onNotification('error', '❌ Error', 'No se pudo eliminar el elemento.');
    } finally {
      setLoading(false);
    }
  };

  const handleResolveSupport = async (ticketId: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('support_tickets')
        .update({ 
          status: 'resolved', 
          resolved_at: new Date().toISOString() 
        })
        .eq('id', ticketId);

      if (error) throw error;

      await loadAllData();
      onNotification('success', '✅ Soporte Resuelto', 'El ticket de soporte ha sido marcado como resuelto.');
    } catch (error) {
      console.error('Resolve support error:', error);
      onNotification('error', '❌ Error', 'No se pudo resolver el ticket de soporte.');
    } finally {
      setLoading(false);
    }
  };

  const loadItemData = (item: any) => {
    setSelectedItem(item.id);
    setFormData(item);
  };

  if (!isOpen) return null;

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
        <div className="bg-card rounded-2xl max-w-md w-full border-2 border-primary shadow-2xl">
          <div className="flex justify-between items-center p-6 border-b border-border">
            <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
              <Shield className="h-6 w-6" />
              Panel de Administración
            </h2>
            <button onClick={onClose} className="btn btn-secondary p-2">
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <form onSubmit={handlePasswordSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Contraseña de administrador:
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full py-3 px-4 border border-border rounded-lg bg-bg-secondary text-text-primary"
                placeholder="Ingresa la contraseña"
                autoFocus
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full btn btn-primary flex items-center justify-center gap-2"
            >
              <Shield className="h-4 w-4" />
              Acceder
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-2xl max-w-7xl w-full max-h-[95vh] overflow-hidden border-2 border-primary">
        <div className="flex justify-between items-center p-4 md:p-6 border-b border-border">
          <h2 className="text-xl md:text-2xl font-bold text-primary">Panel de Administración - Delte Streaming</h2>
          <button onClick={onClose} className="btn btn-secondary p-2">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-col md:flex-row h-[calc(95vh-100px)]">
          {/* Sidebar */}
          <div className="w-full md:w-64 bg-bg-secondary border-b md:border-r md:border-b-0 border-border p-4 overflow-x-auto md:overflow-x-visible">
            <nav className="flex md:flex-col space-x-2 md:space-x-0 md:space-y-2">
              {[
                { id: 'products', label: 'Productos', icon: Package },
                { id: 'categories', label: 'Categorías', icon: Folder },
                { id: 'users', label: 'Usuarios', icon: Users },
                { id: 'support', label: 'Soporte', icon: MessageSquare },
                { id: 'faqs', label: 'FAQs', icon: HelpCircle },
                { id: 'social', label: 'Redes', icon: Settings },
                { id: 'settings', label: 'Config', icon: Settings }
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => {
                    setActiveTab(id as TabType);
                    setSelectedItem('');
                    setFormData({});
                  }}
                  className={`flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-3 rounded-lg transition-colors whitespace-nowrap ${
                    activeTab === id
                      ? 'bg-primary text-white'
                      : 'text-text-primary hover:bg-primary/10'
                  }`}
                >
                  <Icon className="h-4 w-4 md:h-5 md:w-5" />
                  <span className="text-sm md:text-base">{label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col md:flex-row">
            {/* List */}
            <div className="w-full md:w-1/2 border-b md:border-r md:border-b-0 border-border p-4 overflow-y-auto">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
                <h3 className="text-base md:text-lg font-semibold text-text-primary">
                  {activeTab === 'products' && 'Productos'}
                  {activeTab === 'categories' && 'Categorías'}
                  {activeTab === 'users' && 'Usuarios'}
                  {activeTab === 'support' && 'Tickets de Soporte'}
                  {activeTab === 'faqs' && 'Preguntas Frecuentes'}
                  {activeTab === 'social' && 'Enlaces Sociales'}
                  {activeTab === 'settings' && 'Configuración del Sitio'}
                </h3>
                {activeTab !== 'support' && activeTab !== 'settings' && (
                  <button
                    onClick={() => {
                      setSelectedItem('');
                      setFormData({});
                    }}
                    className="btn btn-primary flex items-center gap-2 text-sm"
                  >
                    <Plus className="h-4 w-4" />
                    Nuevo
                  </button>
                )}
              </div>

              <div className="space-y-2">
                {/* Products List */}
                {activeTab === 'products' && products.map((product) => (
                  <div
                    key={product.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedItem === product.id
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:bg-bg-secondary'
                    }`}
                    onClick={() => loadItemData(product)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-text-primary truncate">{product.name}</h4>
                        <p className="text-sm text-text-secondary">S/ {product.price} - Stock: {product.stock}</p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(product.id);
                        }}
                        className="text-red-500 hover:text-red-700 ml-2"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}

                {/* Categories List */}
                {activeTab === 'categories' && categories.map((category) => (
                  <div
                    key={category.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedItem === category.id
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:bg-bg-secondary'
                    }`}
                    onClick={() => loadItemData(category)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-text-primary truncate">{category.name}</h4>
                        <p className="text-sm text-text-secondary truncate">{category.description}</p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(category.id);
                        }}
                        className="text-red-500 hover:text-red-700 ml-2"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}

                {/* Users List */}
                {activeTab === 'users' && users.map((user) => (
                  <div
                    key={user.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedItem === user.id
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:bg-bg-secondary'
                    }`}
                    onClick={() => loadItemData(user)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-text-primary truncate">{user.name}</h4>
                        <p className="text-sm text-text-secondary truncate">@{user.username} - {user.email}</p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(user.id);
                        }}
                        className="text-red-500 hover:text-red-700 ml-2"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}

                {/* Support Tickets List */}
                {activeTab === 'support' && supportTickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="p-3 rounded-lg border border-border"
                  >
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-text-primary truncate">{ticket.product_name}</h4>
                        <p className="text-sm text-text-secondary">
                          Tipo: {ticket.support_type} - Estado: {ticket.status}
                        </p>
                        <p className="text-xs text-text-secondary">
                          ID Compra: {ticket.purchase_id}
                        </p>
                        <p className="text-xs text-text-secondary">
                          {new Date(ticket.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      {ticket.status === 'pending' && (
                        <button
                          onClick={() => handleResolveSupport(ticket.id)}
                          className="btn btn-primary text-sm whitespace-nowrap"
                        >
                          Resuelto
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {/* FAQs List */}
                {activeTab === 'faqs' && faqs.map((faq) => (
                  <div
                    key={faq.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedItem === faq.id
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:bg-bg-secondary'
                    }`}
                    onClick={() => loadItemData(faq)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-text-primary truncate">{faq.question}</h4>
                        <p className="text-sm text-text-secondary line-clamp-2">{faq.answer}</p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(faq.id);
                        }}
                        className="text-red-500 hover:text-red-700 ml-2"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}

                {/* Social Links List */}
                {activeTab === 'social' && socialLinks.map((link) => (
                  <div
                    key={link.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedItem === link.id
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:bg-bg-secondary'
                    }`}
                    onClick={() => loadItemData(link)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-text-primary truncate">{link.platform}</h4>
                        <p className="text-sm text-text-secondary truncate">{link.url}</p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(link.id);
                        }}
                        className="text-red-500 hover:text-red-700 ml-2"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}

                {/* Site Settings */}
                {activeTab === 'settings' && siteSettings && (
                  <div
                    className="p-3 rounded-lg border border-primary bg-primary/10 cursor-pointer"
                    onClick={() => loadItemData(siteSettings)}
                  >
                    <h4 className="font-medium text-text-primary">Configuración del Sitio</h4>
                    <p className="text-sm text-text-secondary">{siteSettings.site_title}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Form */}
            <div className="w-full md:w-1/2 p-4 overflow-y-auto">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
                <h3 className="text-base md:text-lg font-semibold text-text-primary">
                  {selectedItem || activeTab === 'settings' ? 'Editar' : 'Nuevo'}
                </h3>
                <div className="flex gap-2">
                  {(selectedItem || activeTab === 'settings') && (
                    <button
                      onClick={handleUpdate}
                      disabled={loading}
                      className="btn btn-secondary flex items-center gap-2 text-sm"
                    >
                      <Edit className="h-4 w-4" />
                      Actualizar
                    </button>
                  )}
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="btn btn-primary flex items-center gap-2 text-sm"
                  >
                    <Save className="h-4 w-4" />
                    {selectedItem || activeTab === 'settings' ? 'Guardar' : 'Crear'}
                  </button>
                </div>
              </div>

              {/* Dynamic Forms based on activeTab */}
              {(selectedItem || activeTab === 'settings' || (!selectedItem && activeTab !== 'support')) && (
                <div className="space-y-4">
                  {/* Product Form */}
                  {activeTab === 'products' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">Nombre</label>
                        <input
                          type="text"
                          value={formData.name || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full p-3 border border-border rounded-lg bg-bg-secondary text-text-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">Descripción</label>
                        <textarea
                          value={formData.description || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                          rows={3}
                          className="w-full p-3 border border-border rounded-lg bg-bg-secondary text-text-primary"
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-text-primary mb-2">Precio</label>
                          <input
                            type="number"
                            step="0.01"
                            value={formData.price || ''}
                            onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
                            className="w-full p-3 border border-border rounded-lg bg-bg-secondary text-text-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-text-primary mb-2">Stock</label>
                          <input
                            type="number"
                            value={formData.stock || ''}
                            onChange={(e) => setFormData(prev => ({ ...prev, stock: parseInt(e.target.value) }))}
                            className="w-full p-3 border border-border rounded-lg bg-bg-secondary text-text-primary"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">ID de Imagen (Google Drive)</label>
                        <input
                          type="text"
                          value={formData.image_id || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, image_id: e.target.value }))}
                          className="w-full p-3 border border-border rounded-lg bg-bg-secondary text-text-primary"
                          placeholder="1k6WVSz_jG2ENa9svG0MaD4yLAkkjNoDN"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">Categoría</label>
                        <select
                          value={formData.category_id || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, category_id: e.target.value }))}
                          className="w-full p-3 border border-border rounded-lg bg-bg-secondary text-text-primary"
                        >
                          <option value="">Sin categoría</option>
                          {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">Términos y Condiciones</label>
                        <textarea
                          value={formData.terms_conditions || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, terms_conditions: e.target.value }))}
                          rows={8}
                          className="w-full p-3 border border-border rounded-lg bg-bg-secondary text-text-primary"
                        />
                      </div>
                    </>
                  )}

                  {/* Category Form */}
                  {activeTab === 'categories' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">Nombre</label>
                        <input
                          type="text"
                          value={formData.name || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full p-3 border border-border rounded-lg bg-bg-secondary text-text-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">Descripción</label>
                        <textarea
                          value={formData.description || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                          rows={3}
                          className="w-full p-3 border border-border rounded-lg bg-bg-secondary text-text-primary"
                        />
                      </div>
                    </>
                  )}

                  {/* User Form */}
                  {activeTab === 'users' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">Nombre</label>
                        <input
                          type="text"
                          value={formData.name || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full p-3 border border-border rounded-lg bg-bg-secondary text-text-primary"
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-text-primary mb-2">Teléfono</label>
                          <input
                            type="text"
                            value={formData.phone || ''}
                            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                            className="w-full p-3 border border-border rounded-lg bg-bg-secondary text-text-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-text-primary mb-2">Código País</label>
                          <input
                            type="text"
                            value={formData.country_code || '+51'}
                            onChange={(e) => setFormData(prev => ({ ...prev, country_code: e.target.value }))}
                            className="w-full p-3 border border-border rounded-lg bg-bg-secondary text-text-primary"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">Email</label>
                        <input
                          type="email"
                          value={formData.email || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                          className="w-full p-3 border border-border rounded-lg bg-bg-secondary text-text-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">Usuario</label>
                        <input
                          type="text"
                          value={formData.username || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                          className="w-full p-3 border border-border rounded-lg bg-bg-secondary text-text-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">Contraseña</label>
                        <input
                          type="password"
                          value={formData.password_hash || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, password_hash: e.target.value }))}
                          className="w-full p-3 border border-border rounded-lg bg-bg-secondary text-text-primary"
                        />
                      </div>
                    </>
                  )}

                  {/* FAQ Form */}
                  {activeTab === 'faqs' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">Pregunta</label>
                        <input
                          type="text"
                          value={formData.question || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, question: e.target.value }))}
                          className="w-full p-3 border border-border rounded-lg bg-bg-secondary text-text-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">Respuesta</label>
                        <textarea
                          value={formData.answer || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, answer: e.target.value }))}
                          rows={5}
                          className="w-full p-3 border border-border rounded-lg bg-bg-secondary text-text-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">Orden</label>
                        <input
                          type="number"
                          value={formData.order_index || 0}
                          onChange={(e) => setFormData(prev => ({ ...prev, order_index: parseInt(e.target.value) }))}
                          className="w-full p-3 border border-border rounded-lg bg-bg-secondary text-text-primary"
                        />
                      </div>
                    </>
                  )}

                  {/* Social Link Form */}
                  {activeTab === 'social' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">Plataforma</label>
                        <input
                          type="text"
                          value={formData.platform || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, platform: e.target.value }))}
                          className="w-full p-3 border border-border rounded-lg bg-bg-secondary text-text-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">URL</label>
                        <input
                          type="url"
                          value={formData.url || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                          className="w-full p-3 border border-border rounded-lg bg-bg-secondary text-text-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">Icono (Font Awesome)</label>
                        <input
                          type="text"
                          value={formData.icon || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                          className="w-full p-3 border border-border rounded-lg bg-bg-secondary text-text-primary"
                          placeholder="fab fa-facebook"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">Orden</label>
                        <input
                          type="number"
                          value={formData.order_index || 0}
                          onChange={(e) => setFormData(prev => ({ ...prev, order_index: parseInt(e.target.value) }))}
                          className="w-full p-3 border border-border rounded-lg bg-bg-secondary text-text-primary"
                        />
                      </div>
                    </>
                  )}

                  {/* Settings Form */}
                  {activeTab === 'settings' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">Título del Sitio</label>
                        <input
                          type="text"
                          value={formData.site_title || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, site_title: e.target.value }))}
                          className="w-full p-3 border border-border rounded-lg bg-bg-secondary text-text-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">Subtítulo</label>
                        <input
                          type="text"
                          value={formData.site_subtitle || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, site_subtitle: e.target.value }))}
                          className="w-full p-3 border border-border rounded-lg bg-bg-secondary text-text-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">Teléfono de Contacto</label>
                        <input
                          type="text"
                          value={formData.contact_phone || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, contact_phone: e.target.value }))}
                          className="w-full p-3 border border-border rounded-lg bg-bg-secondary text-text-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">URL de WhatsApp</label>
                        <input
                          type="url"
                          value={formData.whatsapp_url || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, whatsapp_url: e.target.value }))}
                          className="w-full p-3 border border-border rounded-lg bg-bg-secondary text-text-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">Texto del Footer</label>
                        <input
                          type="text"
                          value={formData.footer_text || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, footer_text: e.target.value }))}
                          className="w-full p-3 border border-border rounded-lg bg-bg-secondary text-text-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-secondary mb-2">
                          Texto del Desarrollador (No editable)
                        </label>
                        <input
                          type="text"
                          value="Desarrollado por: CyberLink Express 360 Sure"
                          disabled
                          className="w-full p-3 border border-border rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                        />
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;