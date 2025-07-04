import React, { useState, useEffect } from 'react';
import { X, Headphones, MessageCircle, CheckCircle, Clock } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { User, Purchase, SupportTicket, SupportType } from '../../types/store';

interface SupportPanelProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onNotification: (type: 'success' | 'error' | 'warning' | 'info', title: string, message: string) => void;
}

const SupportPanel: React.FC<SupportPanelProps> = ({
  isOpen,
  onClose,
  currentUser,
  onNotification
}) => {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null);
  const [supportType, setSupportType] = useState<SupportType>('Codigo');

  const supportTypes: SupportType[] = ['Codigo', 'Hogar', 'Email', 'Pago', 'Geo', 'Otros'];

  const loadUserData = async () => {
    if (!currentUser) return;

    setLoading(true);
    try {
      // Load user purchases
      const { data: purchasesData, error: purchasesError } = await supabase
        .from('purchases')
        .select('*')
        .eq('user_id', currentUser.id)
        .order('purchase_date', { ascending: false });

      if (purchasesError) throw purchasesError;

      // Load user support tickets
      const { data: ticketsData, error: ticketsError } = await supabase
        .from('support_tickets')
        .select('*')
        .eq('user_id', currentUser.id)
        .order('created_at', { ascending: false });

      if (ticketsError) throw ticketsError;

      setPurchases(purchasesData || []);
      setSupportTickets(ticketsData || []);
    } catch (error) {
      console.error('Error loading user data:', error);
      onNotification('error', '❌ Error', 'No se pudieron cargar tus datos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && currentUser) {
      loadUserData();
    }
  }, [isOpen, currentUser]);

  const handleSendSupport = async () => {
    if (!selectedPurchase) return;

    setLoading(true);
    try {
      // Create support ticket
      const { error } = await supabase
        .from('support_tickets')
        .insert({
          id: `ticket-${Date.now()}`,
          user_id: currentUser.id,
          purchase_id: selectedPurchase.id,
          product_name: selectedPurchase.product_name,
          support_type: supportType
        });

      if (error) throw error;

      // Format WhatsApp message with purchase ID
      const message = `🛠️ *SOPORTE TÉCNICO - DELTE STREAMING*

👤 *Cliente:* ${currentUser.name}
📱 *Usuario:* @${currentUser.username}
🎬 *Producto:* ${selectedPurchase.product_name}
🆔 *ID de Compra:* ${selectedPurchase.id}
🔧 *Tipo de Soporte:* ${supportType}

📧 *El correo es:* 
🔐 *La contraseña es:* 

📞 *Teléfono:* ${currentUser.country_code} ${currentUser.phone}
✉️ *Email:* ${currentUser.email}

⚠️ _Por favor, proporciona las credenciales para resolver el problema_`;

      const whatsappUrl = `https://wa.me/51936992107?text=${encodeURIComponent(message)}`;
      
      // Open WhatsApp
      window.open(whatsappUrl, '_blank');
      
      // Reload data
      await loadUserData();
      
      setShowSupportModal(false);
      setSelectedPurchase(null);
      onNotification('success', '✅ Soporte Enviado', 'Tu solicitud de soporte ha sido enviada correctamente. Te contactaremos pronto.');
    } catch (error) {
      console.error('Error sending support:', error);
      onNotification('error', '❌ Error', 'No se pudo enviar la solicitud de soporte.');
    } finally {
      setLoading(false);
    }
  };

  const getTicketStatus = (purchaseId: string) => {
    const ticket = supportTickets.find(t => t.purchase_id === purchaseId);
    return ticket?.status || null;
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
        <div className="bg-card rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border-2 border-primary shadow-2xl">
          <div className="flex justify-between items-center p-4 md:p-6 border-b border-border">
            <h2 className="text-lg md:text-2xl font-bold text-primary flex items-center gap-2">
              <Headphones className="h-5 w-5 md:h-6 md:w-6" />
              <span className="hidden sm:inline">Panel de Soporte - </span>{currentUser.name}
            </h2>
            <button onClick={onClose} className="btn btn-secondary p-2">
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="p-4 md:p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            <h3 className="text-lg md:text-xl font-semibold text-text-primary mb-4 md:mb-6">Mis Compras</h3>
            
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-text-secondary">Cargando tus compras...</p>
              </div>
            ) : purchases.length === 0 ? (
              <div className="text-center py-8">
                <Headphones className="h-12 w-12 md:h-16 md:w-16 mx-auto mb-4 text-gray-400" />
                <h4 className="text-base md:text-lg font-semibold text-text-primary mb-2">
                  No tienes compras registradas
                </h4>
                <p className="text-text-secondary text-sm md:text-base">
                  Cuando realices una compra, aparecerá aquí y podrás solicitar soporte.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {purchases.map((purchase) => {
                  const ticketStatus = getTicketStatus(purchase.id);
                  
                  return (
                    <div
                      key={purchase.id}
                      className="bg-bg-secondary rounded-lg p-3 md:p-4 border border-border"
                    >
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                        <div className="flex-1">
                          <h4 className="text-base md:text-lg font-semibold text-text-primary">
                            {purchase.product_name}
                          </h4>
                          <p className="text-text-secondary text-sm md:text-base">
                            Precio: S/ {purchase.price.toFixed(2)}
                          </p>
                          <p className="text-text-secondary text-xs md:text-sm">
                            ID: {purchase.id}
                          </p>
                          <p className="text-text-secondary text-xs md:text-sm">
                            Fecha: {new Date(purchase.purchase_date).toLocaleDateString('es-ES')}
                          </p>
                          
                          {/* Support Status */}
                          {ticketStatus && (
                            <div className="mt-2">
                              {ticketStatus === 'resolved' ? (
                                <div className="flex items-center gap-2 text-green-600">
                                  <CheckCircle className="h-4 w-4" />
                                  <span className="text-xs md:text-sm font-medium">Soporte solucionado con éxito</span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2 text-yellow-600">
                                  <Clock className="h-4 w-4" />
                                  <span className="text-xs md:text-sm font-medium">Soporte en proceso</span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        
                        <button
                          onClick={() => {
                            setSelectedPurchase(purchase);
                            setShowSupportModal(true);
                          }}
                          disabled={ticketStatus === 'pending'}
                          className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg transition-colors duration-200 text-xs md:text-sm whitespace-nowrap ${
                            ticketStatus === 'pending'
                              ? 'bg-gray-400 text-white cursor-not-allowed'
                              : 'bg-blue-500 hover:bg-blue-600 text-white'
                          }`}
                        >
                          <MessageCircle className="h-3 w-3 md:h-4 md:w-4" />
                          {ticketStatus === 'pending' ? 'Soporte enviado' : 'Enviar a soporte'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Support Modal */}
      {showSupportModal && selectedPurchase && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[60] p-4 backdrop-blur-sm">
          <div className="bg-card rounded-2xl max-w-md w-full border-2 border-primary shadow-2xl">
            <div className="flex justify-between items-center p-4 md:p-6 border-b border-border">
              <h3 className="text-lg md:text-xl font-bold text-primary">Solicitar Soporte</h3>
              <button
                onClick={() => setShowSupportModal(false)}
                className="btn btn-secondary p-2"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            
            <div className="p-4 md:p-6 space-y-4">
              <div>
                <h4 className="font-semibold text-text-primary mb-2">Producto:</h4>
                <p className="text-text-secondary text-sm md:text-base">{selectedPurchase.product_name}</p>
                <p className="text-text-secondary text-xs">ID: {selectedPurchase.id}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Tipo de soporte:
                </label>
                <select
                  value={supportType}
                  onChange={(e) => setSupportType(e.target.value as SupportType)}
                  className="w-full p-3 border border-border rounded-lg bg-bg-secondary text-text-primary"
                >
                  {supportTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  Al enviar el soporte, serás redirigido a WhatsApp con un mensaje predeterminado 
                  para contactar con el equipo de soporte técnico.
                </p>
              </div>
              
              <button
                onClick={handleSendSupport}
                disabled={loading}
                className="w-full btn btn-primary flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Enviando...
                  </>
                ) : (
                  <>
                    <MessageCircle className="h-4 w-4" />
                    Enviar Soporte
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SupportPanel;