export interface SupportCard {
  id: string;
  title: string;
  description: string;
  type?: string;
  provider?: string;
  domains?: string;
  commands?: string;
  email?: string;
  password?: string;
  steps?: string[];
  services?: ServiceLink[];
  warning?: string;
  compatibility?: string;
  buttons: SupportButton[];
}

export interface ServiceLink {
  name: string;
  url: string;
}

export interface SupportButton {
  type: 'media' | 'link' | 'whatsapp';
  text: string;
  mediaId?: string;
  mediaType?: 'image' | 'video';
  url?: string;
}

export interface CountryCode {
  code: string;
  flag: string;
  name: string;
}

export type Theme = 'light' | 'dark';