import { SupportCard } from '../types';

export const initialSupportCards: SupportCard[] = [
  {
    id: 'card-1',
    title: 'Instrucciones básicas - Luna Streaming',
    description: 'Accede al tutorial completo en formato PDF desde Google Drive para obtener instrucciones detalladas sobre el uso de Luna Streaming.',
    type: 'Documento PDF',
    provider: 'Luna Streaming',
    buttons: [
      {
        type: 'media',
        text: 'Ver Tutorial PDF',
        mediaId: '1GtV9j_775JUC260XtVIOQNwM-hMF5G1a',
        mediaType: 'image'
      },
      {
        type: 'whatsapp',
        text: 'Compartir por WhatsApp'
      }
    ]
  },
  {
    id: 'card-2',
    title: 'Grupo de tutoriales de Luna Streaming - Telegram',
    description: 'En este grupo usted podrá encontrar todos los tutoriales a más de no haber en esta plataforma.',
    provider: 'Luna Streaming',
    buttons: [
      {
        type: 'link',
        text: 'Ir al Bot',
        url: 'https://t.me/+MTJauBePDvNiZjAx'
      },
      {
        type: 'whatsapp',
        text: 'Compartir por WhatsApp'
      }
    ]
  },
  {
    id: 'card-3',
    title: 'Netflix - Bot Telegram para Netflix',
    description: 'Soporte de Netflix, proveedor DoubleR. en Telegram. Para asistencia inmediata del proveedor DoubleR., consulta el bot de soporte en Telegram. Puedes obtener códigos de acceso, solicitar actualizaciones de código y resolver problemas comunes de forma automatizada.',
    provider: 'DoubleR',
    commands: '/hogar [correo], /code [correo], /help',
    buttons: [
      {
        type: 'link',
        text: 'Ir al Bot',
        url: 'https://t.me/Suport_memberbot'
      },
      {
        type: 'whatsapp',
        text: 'Compartir por WhatsApp'
      }
    ]
  },
  {
    id: 'card-4',
    title: 'Netflix - Error de Contraseña TV',
    description: 'Si te muestra "contraseña incorrecta" este BOT no es apto para el restablecimiento de la misma. La solución es contactar al proveedor para que realice la activación de la TV de su cliente. Para ello es importante que, envie foto de la pantalla donde figura el código de inicio de sesión, correo y contraseña de la cuenta para que el proveedor pueda activarlo de manera satisfactoria.',
    provider: 'ZonaTOP Delte Streaming',
    domains: 'FerrasFet VIP',
    email: 'hogar@vip5.biz',
    password: 'net2021',
    buttons: [
      {
        type: 'media',
        text: 'Ver Video Tutorial',
        mediaId: '161H4adWP3he8_F39djXPTXDZe0Azs2tT',
        mediaType: 'video'
      },
      {
        type: 'link',
        text: 'Ir al Bot',
        url: 'https://privateemail.com/appsuite/#!!&app=io.ox/mail&folder=default0/INBOX&storeLocale=true'
      },
      {
        type: 'whatsapp',
        text: 'Compartir por WhatsApp'
      }
    ]
  },
  {
    id: 'card-5',
    title: 'Streaming - Links de Activación',
    description: 'En la siguiente lista encontrarás los Link de activación de cada Servicio de Streaming',
    provider: 'Varios',
    steps: [
      'Ingresar al Link del Servicio',
      'Ingresar el código que se muestra en su dispositivo',
      '¡Listo!'
    ],
    services: [
      { name: 'AppleTV', url: 'https://activate.apple.com' },
      { name: 'Crunchyroll', url: 'https://www.crunchyroll.com/activate' },
      { name: 'DirecTV GO', url: 'https://www.directvgo.com/activar-tv' },
      { name: 'Disney+', url: 'http://disneyplus.com/begin' },
      { name: 'HBO Max', url: 'https://max.com/signin' },
      { name: 'Netflix', url: 'https://netflix.com/tv8' },
      { name: 'Paramount+', url: 'http://www.paramountplus.com/global/activate' },
      { name: 'Plex', url: 'https://www.plex.tv/link' },
      { name: 'Prime Vídeo', url: 'http://PrimeVideo.com/mytv' },
      { name: 'Star Plus', url: 'http://starplus.com/begin' },
      { name: 'Universal+', url: 'https://play.universalplus.com/activar' },
      { name: 'Youtube Premium', url: 'https://youtube.com/tv/activate' }
    ],
    buttons: [
      {
        type: 'media',
        text: 'Ver Imagen',
        mediaId: '1hjZoUBbqCWdtCYuLyTO5rOLTBzxYysRx',
        mediaType: 'image'
      },
      {
        type: 'whatsapp',
        text: 'Compartir por WhatsApp'
      }
    ]
  }
];