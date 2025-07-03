export interface Database {
  public: {
    Tables: {
      blog_posts: {
        Row: {
          id: string;
          title: string;
          slug: string;
          excerpt: string;
          content: string;
          featured_image: string | null;
          featured_video: string | null;
          category_id: string | null;
          is_published: boolean;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          excerpt: string;
          content: string;
          featured_image?: string | null;
          featured_video?: string | null;
          category_id?: string | null;
          is_published?: boolean;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          excerpt?: string;
          content?: string;
          featured_image?: string | null;
          featured_video?: string | null;
          category_id?: string | null;
          is_published?: boolean;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          post_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          post_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          post_count?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      faqs: {
        Row: {
          id: string;
          question: string;
          answer: string;
          order_index: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          question: string;
          answer: string;
          order_index?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          question?: string;
          answer?: string;
          order_index?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      social_links: {
        Row: {
          id: string;
          platform: string;
          url: string;
          icon: string;
          is_active: boolean;
          order_index: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          platform: string;
          url: string;
          icon: string;
          is_active?: boolean;
          order_index?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          platform?: string;
          url?: string;
          icon?: string;
          is_active?: boolean;
          order_index?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      site_settings: {
        Row: {
          id: string;
          site_title: string;
          site_subtitle: string;
          hero_image: string | null;
          contact_phone: string;
          contact_email: string | null;
          whatsapp_url: string | null;
          reservation_url: string | null;
          footer_text: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          site_title?: string;
          site_subtitle?: string;
          hero_image?: string | null;
          contact_phone?: string;
          contact_email?: string | null;
          whatsapp_url?: string | null;
          reservation_url?: string | null;
          footer_text?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          site_title?: string;
          site_subtitle?: string;
          hero_image?: string | null;
          contact_phone?: string;
          contact_email?: string | null;
          whatsapp_url?: string | null;
          reservation_url?: string | null;
          footer_text?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}