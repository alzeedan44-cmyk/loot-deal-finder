export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      clicks: {
        Row: {
          affiliate_url: string
          created_at: string
          id: string
          merchant_slug: string | null
          product_id: string | null
          sub_id: string
          user_id: string | null
        }
        Insert: {
          affiliate_url: string
          created_at?: string
          id?: string
          merchant_slug?: string | null
          product_id?: string | null
          sub_id: string
          user_id?: string | null
        }
        Update: {
          affiliate_url?: string
          created_at?: string
          id?: string
          merchant_slug?: string | null
          product_id?: string | null
          sub_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clicks_merchant_slug_fkey"
            columns: ["merchant_slug"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["slug"]
          },
          {
            foreignKeyName: "clicks_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      conversions: {
        Row: {
          click_id: string | null
          commission_amount: number
          created_at: string
          external_ref: string | null
          id: string
          merchant_slug: string | null
          order_amount: number
          status: string
          sub_id: string
          updated_at: string
          user_id: string | null
          user_share_coins: number
        }
        Insert: {
          click_id?: string | null
          commission_amount: number
          created_at?: string
          external_ref?: string | null
          id?: string
          merchant_slug?: string | null
          order_amount: number
          status?: string
          sub_id: string
          updated_at?: string
          user_id?: string | null
          user_share_coins?: number
        }
        Update: {
          click_id?: string | null
          commission_amount?: number
          created_at?: string
          external_ref?: string | null
          id?: string
          merchant_slug?: string | null
          order_amount?: number
          status?: string
          sub_id?: string
          updated_at?: string
          user_id?: string | null
          user_share_coins?: number
        }
        Relationships: [
          {
            foreignKeyName: "conversions_click_id_fkey"
            columns: ["click_id"]
            isOneToOne: false
            referencedRelation: "clicks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversions_merchant_slug_fkey"
            columns: ["merchant_slug"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["slug"]
          },
        ]
      }
      coupons: {
        Row: {
          category: string | null
          code: string
          created_at: string
          description: string | null
          discount_text: string | null
          expires_at: string | null
          id: string
          merchant_slug: string
          title: string
          verified: boolean
        }
        Insert: {
          category?: string | null
          code: string
          created_at?: string
          description?: string | null
          discount_text?: string | null
          expires_at?: string | null
          id?: string
          merchant_slug: string
          title: string
          verified?: boolean
        }
        Update: {
          category?: string | null
          code?: string
          created_at?: string
          description?: string | null
          discount_text?: string | null
          expires_at?: string | null
          id?: string
          merchant_slug?: string
          title?: string
          verified?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "coupons_merchant_slug_fkey"
            columns: ["merchant_slug"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["slug"]
          },
        ]
      }
      merchants: {
        Row: {
          active: boolean
          affiliate_type: string
          commission_rate: number
          created_at: string
          domain: string
          logo_bg: string | null
          name: string
          slug: string
        }
        Insert: {
          active?: boolean
          affiliate_type?: string
          commission_rate?: number
          created_at?: string
          domain: string
          logo_bg?: string | null
          name: string
          slug: string
        }
        Update: {
          active?: boolean
          affiliate_type?: string
          commission_rate?: number
          created_at?: string
          domain?: string
          logo_bg?: string | null
          name?: string
          slug?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string
          id: string
          kind: string
          product_id: string | null
          read: boolean
          title: string
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          kind: string
          product_id?: string | null
          read?: boolean
          title: string
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          kind?: string
          product_id?: string | null
          read?: boolean
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      offers: {
        Row: {
          eta: string | null
          id: string
          in_stock: boolean
          merchant_slug: string
          price: number
          product_id: string
          rating: number | null
          ratings_count: number | null
          raw_url: string
          updated_at: string
        }
        Insert: {
          eta?: string | null
          id?: string
          in_stock?: boolean
          merchant_slug: string
          price: number
          product_id: string
          rating?: number | null
          ratings_count?: number | null
          raw_url: string
          updated_at?: string
        }
        Update: {
          eta?: string | null
          id?: string
          in_stock?: boolean
          merchant_slug?: string
          price?: number
          product_id?: string
          rating?: number | null
          ratings_count?: number | null
          raw_url?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "offers_merchant_slug_fkey"
            columns: ["merchant_slug"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["slug"]
          },
          {
            foreignKeyName: "offers_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      price_alerts: {
        Row: {
          active: boolean
          created_at: string
          id: string
          last_notified_at: string | null
          product_id: string
          target_price: number
          user_id: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          id?: string
          last_notified_at?: string | null
          product_id: string
          target_price: number
          user_id: string
        }
        Update: {
          active?: boolean
          created_at?: string
          id?: string
          last_notified_at?: string | null
          product_id?: string
          target_price?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "price_alerts_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      price_history: {
        Row: {
          id: number
          merchant_slug: string
          price: number
          product_id: string
          recorded_at: string
        }
        Insert: {
          id?: number
          merchant_slug: string
          price: number
          product_id: string
          recorded_at?: string
        }
        Update: {
          id?: number
          merchant_slug?: string
          price?: number
          product_id?: string
          recorded_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "price_history_merchant_slug_fkey"
            columns: ["merchant_slug"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["slug"]
          },
          {
            foreignKeyName: "price_history_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          active: boolean
          brand: string | null
          category: string
          created_at: string
          emoji: string | null
          id: string
          image_url: string | null
          mrp: number
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          brand?: string | null
          category: string
          created_at?: string
          emoji?: string | null
          id?: string
          image_url?: string | null
          mrp: number
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          brand?: string | null
          category?: string
          created_at?: string
          emoji?: string | null
          id?: string
          image_url?: string | null
          mrp?: number
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          id: string
          neo_coins: number
          referral_code: string
          referred_by: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id: string
          neo_coins?: number
          referral_code?: string
          referred_by?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          neo_coins?: number
          referral_code?: string
          referred_by?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      referrals: {
        Row: {
          created_at: string
          id: string
          referee_id: string
          referrer_id: string
          rewarded: boolean
        }
        Insert: {
          created_at?: string
          id?: string
          referee_id: string
          referrer_id: string
          rewarded?: boolean
        }
        Update: {
          created_at?: string
          id?: string
          referee_id?: string
          referrer_id?: string
          rewarded?: boolean
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
