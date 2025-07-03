export const countryCodes = [
  { code: '+1', flag: '🇺🇸', name: 'USA' },
  { code: '+51', flag: '🇵🇪', name: 'PE' },
  { code: '+52', flag: '🇲🇽', name: 'MX' },
  { code: '+54', flag: '🇦🇷', name: 'AR' },
  { code: '+55', flag: '🇧🇷', name: 'BR' },
  { code: '+56', flag: '🇨🇱', name: 'CL' },
  { code: '+57', flag: '🇨🇴', name: 'CO' },
  { code: '+58', flag: '🇻🇪', name: 'VE' },
  { code: '+593', flag: '🇪🇨', name: 'EC' },
  { code: '+595', flag: '🇵🇾', name: 'PY' },
  { code: '+598', flag: '🇺🇾', name: 'UY' },
  { code: '+591', flag: '🇧🇴', name: 'BO' },
  { code: '+34', flag: '🇪🇸', name: 'ES' },
  { code: '+506', flag: '🇨🇷', name: 'CR' },
  { code: '+53', flag: '🇨🇺', name: 'CU' },
  { code: '+503', flag: '🇸🇻', name: 'SV' },
  { code: '+502', flag: '🇬🇹', name: 'GT' },
  { code: '+504', flag: '🇭🇳', name: 'HN' },
  { code: '+505', flag: '🇳🇮', name: 'NI' },
  { code: '+507', flag: '🇵🇦', name: 'PA' },
  { code: '+44', flag: '🇬🇧', name: 'UK' },
  { code: '+33', flag: '🇫🇷', name: 'FR' },
  { code: '+49', flag: '🇩🇪', name: 'DE' },
  { code: '+39', flag: '🇮🇹', name: 'IT' },
  { code: '+31', flag: '🇳🇱', name: 'NL' },
  { code: '+41', flag: '🇨🇭', name: 'CH' },
  { code: '+351', flag: '🇵🇹', name: 'PT' },
  { code: '+7', flag: '🇷🇺', name: 'RU' },
  { code: '+90', flag: '🇹🇷', name: 'TR' },
  { code: '+1', flag: '🇨🇦', name: 'CA' }
];

// Function to get appropriate icon based on content type
function getContentIcon(title: string, description: string): string {
  const content = (title + ' ' + description).toLowerCase();
  
  if (content.includes('netflix')) return '🎬';
  if (content.includes('disney') || content.includes('star plus')) return '🏰';
  if (content.includes('prime video') || content.includes('amazon')) return '📺';
  if (content.includes('hbo') || content.includes('max')) return '🎭';
  if (content.includes('paramount')) return '⭐';
  if (content.includes('apple tv')) return '🍎';
  if (content.includes('youtube')) return '📹';
  if (content.includes('crunchyroll')) return '🍜';
  if (content.includes('telegram') || content.includes('bot')) return '🤖';
  if (content.includes('tutorial') || content.includes('instrucciones')) return '📚';
  if (content.includes('activación') || content.includes('links')) return '🔗';
  if (content.includes('streaming')) return '📡';
  if (content.includes('tv') || content.includes('televisión')) return '📺';
  if (content.includes('error') || content.includes('problema')) return '🔧';
  if (content.includes('código') || content.includes('pin')) return '🔑';
  
  return '✅'; // Default icon
}

// Function to get tutorial icon based on media type
function getTutorialIcon(mediaType?: 'image' | 'video'): string {
  if (mediaType === 'video') return '🎥';
  if (mediaType === 'image') return '📄';
  return '🎓';
}

// Function to get bot/link icon based on URL
function getBotLinkIcon(url?: string): string {
  if (!url) return '🔗';
  
  if (url.includes('t.me') || url.includes('telegram')) return '🤖';
  if (url.includes('drive.google.com')) return '💾';
  if (url.includes('netflix.com')) return '🎬';
  if (url.includes('disney')) return '🏰';
  if (url.includes('primevideo.com')) return '📺';
  if (url.includes('activate') || url.includes('activar')) return '🔗';
  if (url.includes('crunchyroll')) return '🍜';
  if (url.includes('hbo') || url.includes('max')) return '🎭';
  if (url.includes('paramount')) return '⭐';
  if (url.includes('apple')) return '🍎';
  if (url.includes('youtube')) return '📹';
  
  return '🌐';
}

export function formatWhatsAppMessage(
  title: string,
  description: string,
  videoLink?: string,
  botLink?: string,
  mediaType?: 'image' | 'video'
): string {
  const contentIcon = getContentIcon(title, description);
  
  let message = `${contentIcon} *${title}*\n\n`;
  message += `📄 *Descripción del contenido:*\n${description}\n\n`;
  
  if (videoLink) {
    const tutorialIcon = getTutorialIcon(mediaType);
    message += `${tutorialIcon} *Tutorial ilustrativo:*\n📌 ${videoLink}\n\n`;
  }
  
  if (botLink) {
    const botIcon = getBotLinkIcon(botLink);
    message += `${botIcon} *Bot/Enlace directo:*\n🔗 ${botLink}\n\n`;
  }
  
  message += `📍 _Enviado desde el Sistema de Soporte Técnico_`;
  
  return message;
}

export function createWhatsAppURL(phoneNumber: string, message: string): string {
  const cleanPhone = phoneNumber.replace(/\D/g, '');
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

export async function downloadAndAttachFile(url: string, filename: string): Promise<boolean> {
  try {
    // For Google Drive files, we need to use the direct download URL
    const downloadUrl = url.includes('drive.google.com') 
      ? url.replace('/view', '/uc?export=download')
      : url;
    
    // Create a temporary link to trigger download
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename;
    link.target = '_blank';
    link.style.display = 'none';
    
    // Add to DOM, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    return true;
  } catch (error) {
    console.error('Error downloading file:', error);
    return false;
  }
}

export function createWhatsAppURLWithAttachment(
  phoneNumber: string, 
  message: string, 
  hasAttachment: boolean = false
): string {
  const cleanPhone = phoneNumber.replace(/\D/g, '');
  let finalMessage = message;
  
  if (hasAttachment) {
    finalMessage += '\n\n📎 *Archivo adjunto incluido*';
  }
  
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(finalMessage)}`;
}