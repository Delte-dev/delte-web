import React, { useState } from 'react';
import { getGoogleDriveMediaUrl, MediaType, getGoogleDriveViewUrl } from '../utils/googleDrive';
import { ExternalLink, AlertCircle, Image as ImageIcon, Video } from 'lucide-react';

interface MediaDisplayProps {
  mediaId: string;
  mediaType: MediaType;
  alt?: string;
  className?: string;
  showControls?: boolean;
}

const MediaDisplay: React.FC<MediaDisplayProps> = ({
  mediaId,
  mediaType,
  alt = '',
  className = '',
  showControls = true
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  if (!mediaId || !mediaId.trim()) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 rounded-lg p-8 ${className}`}>
        <div className="text-center text-gray-500">
          <AlertCircle className="h-12 w-12 mx-auto mb-2" />
          <p>No se proporcionó ID de multimedia</p>
        </div>
      </div>
    );
  }

  const mediaUrl = getGoogleDriveMediaUrl(mediaId, mediaType);
  const viewUrl = getGoogleDriveViewUrl(mediaId);

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
  };

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  if (hasError) {
    return (
      <div className={`flex items-center justify-center bg-red-50 border border-red-200 rounded-lg p-8 ${className}`}>
        <div className="text-center text-red-600">
          <AlertCircle className="h-12 w-12 mx-auto mb-2" />
          <p className="font-medium mb-2">Error al cargar {mediaType === 'video' ? 'video' : 'imagen'}</p>
          <p className="text-sm mb-4">ID: {mediaId}</p>
          {showControls && (
            <a
              href={viewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 underline"
            >
              <ExternalLink className="h-4 w-4" />
              Ver en Google Drive
            </a>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg z-10">
          <div className="text-center text-gray-500">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p>Cargando {mediaType === 'video' ? 'video' : 'imagen'}...</p>
          </div>
        </div>
      )}

      {mediaType === 'image' ? (
        <div className="relative">
          <img
            src={mediaUrl}
            alt={alt}
            className={`w-full h-auto rounded-lg object-cover ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
            onLoad={handleLoad}
            onError={handleError}
            loading="lazy"
            style={{ minHeight: '200px' }}
          />
          {showControls && !isLoading && !hasError && (
            <div className="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg flex items-center gap-1">
              <ImageIcon className="h-3 w-3" />
              Imagen
            </div>
          )}
        </div>
      ) : (
        <div className="relative">
          <iframe
            src={mediaUrl}
            className={`w-full h-64 md:h-80 rounded-lg border-none ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
            allow="autoplay"
            title={alt || 'Video de Google Drive'}
            onLoad={handleLoad}
            onError={handleError}
            style={{ minHeight: '200px' }}
          />
          {showControls && !isLoading && !hasError && (
            <div className="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg flex items-center gap-1">
              <Video className="h-3 w-3" />
              Video
            </div>
          )}
        </div>
      )}

      {showControls && !isLoading && !hasError && (
        <div className="mt-4 text-center">
          <a
            href={viewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-primary hover:text-accent-blue2 transition-colors duration-200"
          >
            <ExternalLink className="h-4 w-4" />
            Abrir en Google Drive
          </a>
        </div>
      )}
    </div>
  );
};

export default MediaDisplay;