/**
 * Utilidades para manejar multimedia de Google Drive
 */

export type MediaType = 'image' | 'video';

/**
 * Genera la URL correcta para mostrar multimedia de Google Drive
 * @param mediaId - ID del archivo en Google Drive
 * @param mediaType - Tipo de multimedia (image o video)
 * @returns URL formateada para mostrar el contenido
 */
export function getGoogleDriveMediaUrl(mediaId: string, mediaType: MediaType): string {
  if (!mediaId || !mediaId.trim()) {
    return '';
  }

  const cleanId = mediaId.trim();

  switch (mediaType) {
    case 'image':
      // Para imágenes, usar el formato thumbnail que permite embedding directo
      return `https://drive.google.com/thumbnail?id=${cleanId}&sz=w1000`;
    
    case 'video':
      // Para videos, usar el formato preview que permite embedding en iframe
      return `https://drive.google.com/file/d/${cleanId}/preview`;
    
    default:
      throw new Error(`Tipo de multimedia no soportado: ${mediaType}`);
  }
}

/**
 * Genera la URL para descargar directamente el archivo
 * @param mediaId - ID del archivo en Google Drive
 * @returns URL de descarga directa
 */
export function getGoogleDriveDownloadUrl(mediaId: string): string {
  if (!mediaId || !mediaId.trim()) {
    return '';
  }

  const cleanId = mediaId.trim();
  return `https://drive.google.com/uc?export=download&id=${cleanId}`;
}

/**
 * Genera la URL para ver el archivo en Google Drive
 * @param mediaId - ID del archivo en Google Drive
 * @returns URL para ver en Google Drive
 */
export function getGoogleDriveViewUrl(mediaId: string): string {
  if (!mediaId || !mediaId.trim()) {
    return '';
  }

  const cleanId = mediaId.trim();
  return `https://drive.google.com/file/d/${cleanId}/view`;
}

/**
 * Extrae el ID de Google Drive de una URL completa
 * @param url - URL completa de Google Drive
 * @returns ID extraído o cadena vacía si no se encuentra
 */
export function extractGoogleDriveId(url: string): string {
  if (!url || !url.trim()) {
    return '';
  }

  // Patrones comunes de URLs de Google Drive
  const patterns = [
    /\/file\/d\/([a-zA-Z0-9-_]+)/,
    /id=([a-zA-Z0-9-_]+)/,
    /\/d\/([a-zA-Z0-9-_]+)/
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  // Si no coincide con ningún patrón, asumir que ya es un ID
  return url.trim();
}

/**
 * Valida si un ID de Google Drive tiene el formato correcto
 * @param mediaId - ID a validar
 * @returns true si el formato es válido
 */
export function isValidGoogleDriveId(mediaId: string): boolean {
  if (!mediaId || !mediaId.trim()) {
    return false;
  }

  // Los IDs de Google Drive suelen tener entre 25-50 caracteres alfanuméricos, guiones y guiones bajos
  const idPattern = /^[a-zA-Z0-9-_]{25,50}$/;
  return idPattern.test(mediaId.trim());
}

/**
 * Obtiene información del tipo de archivo basándose en el ID
 * Nota: Esta función es limitada ya que no podemos determinar el tipo real sin hacer una petición
 * @param mediaId - ID del archivo
 * @returns Objeto con información básica
 */
export function getMediaInfo(mediaId: string) {
  return {
    id: mediaId,
    downloadUrl: getGoogleDriveDownloadUrl(mediaId),
    viewUrl: getGoogleDriveViewUrl(mediaId),
    isValid: isValidGoogleDriveId(mediaId)
  };
}