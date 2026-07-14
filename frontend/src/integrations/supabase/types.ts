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
      appointments: {
        Row: {
          appointment_date: string | null
          created_at: string
          department: string | null
          doctor_name: string | null
          hospital_name: string | null
          id: string
          notes: string | null
          patient_id: string
          status: string
          updated_at: string
        }
        Insert: {
          appointment_date?: string | null
          created_at?: string
          department?: string | null
          doctor_name?: string | null
          hospital_name?: string | null
          id?: string
          notes?: string | null
          patient_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          appointment_date?: string | null
          created_at?: string
          department?: string | null
          doctor_name?: string | null
          hospital_name?: string | null
          id?: string
          notes?: string | null
          patient_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      family_members: {
        Row: {
          blood_group: string | null
          created_at: string
          dob: string | null
          id: string
          name: string
          notes: string | null
          owner_id: string
          relationship: string
        }
        Insert: {
          blood_group?: string | null
          created_at?: string
          dob?: string | null
          id?: string
          name: string
          notes?: string | null
          owner_id: string
          relationship: string
        }
        Update: {
          blood_group?: string | null
          created_at?: string
          dob?: string | null
          id?: string
          name?: string
          notes?: string | null
          owner_id?: string
          relationship?: string
        }
        Relationships: []
      }
      health_records: {
        Row: {
          category: string
          created_at: string
          file_name: string | null
          file_url: string | null
          id: string
          notes: string | null
          patient_id: string
          provider: string | null
          record_date: string | null
          title: string
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          file_name?: string | null
          file_url?: string | null
          id?: string
          notes?: string | null
          patient_id: string
          provider?: string | null
          record_date?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          file_name?: string | null
          file_url?: string | null
          id?: string
          notes?: string | null
          patient_id?: string
          provider?: string | null
          record_date?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      hospital_staff: {
        Row: {
          created_at: string
          department: string | null
          hospital_id: string
          id: string
          is_active: boolean
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string
          department?: string | null
          hospital_id: string
          id?: string
          is_active?: boolean
          role?: string
          user_id: string
        }
        Update: {
          created_at?: string
          department?: string | null
          hospital_id?: string
          id?: string
          is_active?: boolean
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "hospital_staff_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hospitals"
            referencedColumns: ["id"]
          },
        ]
      }
      hospitals: {
        Row: {
          address: string | null
          created_at: string
          email: string | null
          id: string
          license_number: string | null
          name: string
          phone: string | null
          website: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string
          email?: string | null
          id?: string
          license_number?: string | null
          name: string
          phone?: string | null
          website?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string
          email?: string | null
          id?: string
          license_number?: string | null
          name?: string
          phone?: string | null
          website?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          blood_group: string | null
          created_at: string
          dob: string | null
          emergency_contact: string | null
          full_name: string | null
          gender: string | null
          id: string
          email: string | null
          phone: string | null
          status: string | null
          is_verified: boolean | null
          location: string | null
          documents: Json | null
          role: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          blood_group?: string | null
          created_at?: string
          dob?: string | null
          emergency_contact?: string | null
          full_name?: string | null
          gender?: string | null
          id: string
          email?: string | null
          phone?: string | null
          status?: string | null
          is_verified?: boolean | null
          location?: string | null
          documents?: Json | null
          role?: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          blood_group?: string | null
          created_at?: string
          dob?: string | null
          emergency_contact?: string | null
          full_name?: string | null
          gender?: string | null
          id?: string
          email?: string | null
          phone?: string | null
          status?: string | null
          is_verified?: boolean | null
          location?: string | null
          documents?: Json | null
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      subscription_plans: {
        Row: {
          id: string
          name: string
          price: number
          target: string | null
          features: Json
          popular: boolean | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          price: number
          target?: string | null
          features?: Json
          popular?: boolean | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          price?: number
          target?: string | null
          features?: Json
          popular?: boolean | null
          created_at?: string
        }
        Relationships: []
      }
      super_admin_notifications: {
        Row: {
          id: string
          title: string
          message: string
          type: string | null
          is_read: boolean | null
          action_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          message: string
          type?: string | null
          is_read?: boolean | null
          action_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          message?: string
          type?: string | null
          is_read?: boolean | null
          action_url?: string | null
          created_at?: string
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          id: string
          action_type: string
          entity_type: string
          user_email: string
          details: string
          ip_address: string | null
          created_at: string
        }
        Insert: {
          id?: string
          action_type: string
          entity_type: string
          user_email: string
          details: string
          ip_address?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          action_type?: string
          entity_type?: string
          user_email?: string
          details?: string
          ip_address?: string | null
          created_at?: string
        }
        Relationships: []
      }
      platform_settings: {
        Row: {
          id: string
          website_name: string
          logo_url: string
          support_email: string
          maintenance_mode: boolean
          require_complex_password: boolean
          password_expiry_days: number
          require_2fa: boolean
          session_timeout_minutes: number
          updated_at: string
        }
        Insert: {
          id?: string
          website_name?: string
          logo_url?: string
          support_email?: string
          maintenance_mode?: boolean
          require_complex_password?: boolean
          password_expiry_days?: number
          require_2fa?: boolean
          session_timeout_minutes?: number
          updated_at?: string
        }
        Update: {
          id?: string
          website_name?: string
          logo_url?: string
          support_email?: string
          maintenance_mode?: boolean
          require_complex_password?: boolean
          password_expiry_days?: number
          require_2fa?: boolean
          session_timeout_minutes?: number
          updated_at?: string
        }
        Relationships: []
      }
      hospital_subscriptions: {
        Row: {
          id: string
          hospital_id: string
          plan_id: string | null
          status: string | null
          start_date: string | null
          end_date: string | null
          created_at: string
        }
        Insert: {
          id?: string
          hospital_id: string
          plan_id?: string | null
          status?: string | null
          start_date?: string | null
          end_date?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          hospital_id?: string
          plan_id?: string | null
          status?: string | null
          start_date?: string | null
          end_date?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "hospital_subscriptions_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hospitals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hospital_subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          }
        ]
      }
      shared_records: {
        Row: {
          access_token: string | null
          expires_at: string | null
          hospital_id: string
          id: string
          record_id: string
          shared_at: string
          shared_by: string
        }
        Insert: {
          access_token?: string | null
          expires_at?: string | null
          hospital_id: string
          id?: string
          record_id: string
          shared_at?: string
          shared_by: string
        }
        Update: {
          access_token?: string | null
          expires_at?: string | null
          hospital_id?: string
          id?: string
          record_id?: string
          shared_at?: string
          shared_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "shared_records_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hospitals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shared_records_record_id_fkey"
            columns: ["record_id"]
            isOneToOne: false
            referencedRelation: "health_records"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
