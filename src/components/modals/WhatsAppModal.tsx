import React, { useState, useEffect } from 'react';
import { X, MessageCircle, Download, CheckCircle, AlertCircle } from 'lucide-react';
import { SupportCard } from '../../types';
import { countryCodes, formatWhatsAppMessage, createWhatsAppURL } from '../../utils/whatsapp';

interface WhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  card: SupportCard | null;
}

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileName: string;
  status: 'downloading' | 'success' | 'error';
  onContinue: () => void;
}

const DownloadModal: React.FC<DownloadModalProps> = ({ 
  isOpen, 
  onClose, 
  fileName, 
  status, 
  onContinue 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[60] p-4 backdrop-blur-sm">
      <div className="bg-card rounded-2xl max-w-md w-full border-2 border-primary shadow-2xl">
        <div className="flex justify-between items-center p-6 border-b border-border">
          <h2 className="text-xl font-bold text-primary flex items-center gap-2">
            <Download className="h-5 w-5" />
            Descarga de Archivo
          </h2>
          {status !== 'downloading' && (
            <button onClick={onClose} className="btn btn-secondary p-2">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        
        <div className="p-6 text-center">
          {status === 'downloading' && (
            <>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                Descargando archivo...
              </h3>
              <p className="text-text-secondary">
                Por favor espera mientras se descarga el archivo multimedia.
              </p>
            </>
          )}
          
          {status === 'success' && (
            <>
              <CheckCircle className="h-12 w-12 text-accent-green mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                ¡Descarga completada!
              </h3>
              <p className="text-text-secondary mb-4">
                El archivo <strong>{fileName}</strong> se ha descargado correctamente.
              </p>
              <div className="bg-accent-green/10 border border-accent-green/20 rounded-lg p-4 mb-4">
                <p className="text-sm text-text-secondary">
                  Ahora se abrirá WhatsApp. El archivo se adjuntará automáticamente al mensaje.
                </p>
              </div>
              <button
                onClick={onContinue}
                className="w-full btn btn-whatsapp flex items-center justify-center gap-2"
              >
                <MessageCircle className="h-4 w-4" />
                Continuar a WhatsApp
              </button>
            </>
          )}
          
          {status === 'error' && (
            <>
              <AlertCircle className="h-12 w-12 text-accent-red mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                Error en la descarga
              </h3>
              <p className="text-text-secondary mb-4">
                No se pudo descargar el archivo automáticamente. Puedes acceder al enlace desde el mensaje de WhatsApp.
              </p>
              <button
                onClick={onContinue}
                className="w-full btn btn-whatsapp flex items-center justify-center gap-2"
              >
                <MessageCircle className="h-4 w-4" />
                Continuar a WhatsApp
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const WhatsAppModal: React.FC<WhatsAppModalProps> = ({ isOpen, onClose, card }) => {
  const [countryCode, setCountryCode] = useState('+51');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState<'downloading' | 'success' | 'error'>('downloading');
  const [fileName, setFileName] = useState('');
  const [pendingWhatsAppData, setPendingWhatsAppData] = useState<{
    fullNumber: string;
    message: string;
  } | null>(null);

  useEffect(() => {
    if (card) {
      const mediaButton = card.buttons.find(b => b.type === 'media');
      const linkButton = card.buttons.find(b => b.type === 'link');
      
      const videoLink = mediaButton ? `https://drive.google.com/file/d/${mediaButton.mediaId}/view` : '';
      const botLink = linkButton?.url || '';
      
      const formattedMessage = formatWhatsAppMessage(
        card.title, 
        card.description, 
        videoLink, 
        botLink, 
        mediaButton?.mediaType
      );
      setMessage(formattedMessage);
    }
  }, [card]);

  const downloadFile = async (url: string, filename: string): Promise<boolean> => {
    try {
      const response = await fetch(url, { mode: 'no-cors' });
      
      // Create a download link
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.target = '_blank';
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      return true;
    } catch (error) {
      console.error('Error downloading file:', error);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phoneNumber.trim()) {
      alert('Por favor, ingresa un número de teléfono válido.');
      return;
    }
    
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    const fullNumber = countryCode + cleanPhone;
    
    // Check if there's a media file to download
    const mediaButton = card?.buttons.find(b => b.type === 'media');
    
    if (mediaButton) {
      const downloadUrl = `https://drive.google.com/uc?export=download&id=${mediaButton.mediaId}`;
      const filename = `${card?.title.replace(/[^a-zA-Z0-9]/g, '_')}.${mediaButton.mediaType === 'video' ? 'mp4' : 'pdf'}`;
      
      setFileName(filename);
      setShowDownloadModal(true);
      setDownloadStatus('downloading');
      setPendingWhatsAppData({ fullNumber, message });
      
      // Simulate download process
      setTimeout(async () => {
        const success = await downloadFile(downloadUrl, filename);
        setDownloadStatus(success ? 'success' : 'error');
      }, 2000);
    } else {
      // No media file, open WhatsApp directly
      const whatsappURL = createWhatsAppURL(fullNumber, message);
      window.open(whatsappURL, '_blank');
      onClose();
    }
  };

  const handleContinueToWhatsApp = () => {
    if (pendingWhatsAppData) {
      const whatsappURL = createWhatsAppURL(pendingWhatsAppData.fullNumber, pendingWhatsAppData.message);
      window.open(whatsappURL, '_blank');
    }
    
    setShowDownloadModal(false);
    setPendingWhatsAppData(null);
    onClose();
  };

  const handleCloseDownloadModal = () => {
    setShowDownloadModal(false);
    setPendingWhatsAppData(null);
  };

  const selectedCountry = countryCodes.find(c => c.code === countryCode);

  if (!isOpen || !card) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
        <div className="bg-card rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border-2 border-primary shadow-2xl">
          <div className="flex justify-between items-center p-6 border-b border-border">
            <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
              <MessageCircle className="h-6 w-6" />
              Compartir por WhatsApp
            </h2>
            <button onClick={onClose} className="btn btn-secondary p-2">
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Número de teléfono:
              </label>
              <div className="flex gap-3">
                <div className="relative min-w-[150px]">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-lg">
                    {selectedCountry?.flag}
                  </span>
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-border rounded-lg bg-bg-secondary text-text-primary appearance-none cursor-pointer"
                  >
                    {countryCodes.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.flag} {country.code} ({country.name})
                      </option>
                    ))}
                  </select>
                </div>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Número de teléfono"
                  className="flex-1 py-3 px-4 border border-border rounded-lg bg-bg-secondary text-text-primary"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Vista previa del mensaje:
              </label>
              <textarea
                value={message}
                readOnly
                rows={12}
                className="w-full py-3 px-4 border border-border rounded-lg bg-bg-secondary text-text-secondary resize-vertical font-mono text-sm"
              />
            </div>
            
            {card.buttons.some(b => b.type === 'media') && (
              <div className="bg-accent-green/10 border border-accent-green/20 rounded-lg p-4">
                <div className="flex items-center gap-2 text-accent-green mb-2">
                  <Download className="h-4 w-4" />
                  <span className="font-medium">Archivo multimedia</span>
                </div>
                <p className="text-sm text-text-secondary">
                  Al enviar el mensaje, se descargará automáticamente el archivo multimedia y se adjuntará al mensaje de WhatsApp.
                </p>
              </div>
            )}
            
            <button
              type="submit"
              className="w-full btn btn-whatsapp flex items-center justify-center gap-2"
            >
              <MessageCircle className="h-5 w-5" />
              Enviar por WhatsApp
            </button>
          </form>
        </div>
      </div>

      <DownloadModal
        isOpen={showDownloadModal}
        onClose={handleCloseDownloadModal}
        fileName={fileName}
        status={downloadStatus}
        onContinue={handleContinueToWhatsApp}
      />
    </>
  );
};

export default WhatsAppModal;