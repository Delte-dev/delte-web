export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          price: number;
          stock: number;
          image_id: string | null;
          terms_conditions: string | null;
          category_id: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          price: number;
          stock?: number;
          image_id?: string | null;
          terms_conditions?: string | null;
          category_id?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          price?: number;
          stock?: number;
          image_id?: string | null;
          terms_conditions?: string | null;
          category_id?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      users: {
        Row: {
          id: string;
          name: string;
          phone: string;
          country_code: string;
          email: string;
          username: string;
          password_hash: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          phone: string;
          country_code?: string;
          email: string;
          username: string;
          password_hash: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          phone?: string;
          country_code?: string;
          email?: string;
          username?: string;
          password_hash?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      purchases: {
        Row: {
          id: string;
          user_id: string;
          product_id: string;
          product_name: string;
          price: number;
          purchase_date: string;
          status: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          product_id: string;
          product_name: string;
          price: number;
          purchase_date?: string;
          status?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          product_id?: string;
          product_name?: string;
          price?: number;
          purchase_date?: string;
          status?: string;
        };
      };
      support_tickets: {
        Row: {
          id: string;
          user_id: string;
          purchase_id: string;
          product_name: string;
          support_type: string;
          status: string;
          created_at: string;
          resolved_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          purchase_id: string;
          product_name: string;
          support_type: string;
          status?: string;
          created_at?: string;
          resolved_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          purchase_id?: string;
          product_name?: string;
          support_type?: string;
          status?: string;
          created_at?: string;
          resolved_at?: string | null;
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
          whatsapp_url: string;
          footer_text: string;
          developer_text: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          site_title?: string;
          site_subtitle?: string;
          hero_image?: string | null;
          contact_phone?: string;
          whatsapp_url?: string;
          footer_text?: string;
          developer_text?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          site_title?: string;
          site_subtitle?: string;
          hero_image?: string | null;
          contact_phone?: string;
          whatsapp_url?: string;
          footer_text?: string;
          developer_text?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}