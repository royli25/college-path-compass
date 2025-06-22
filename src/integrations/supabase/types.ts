export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      admitted_profiles: {
        Row: {
          act_score: number | null
          activities: Json | null
          advice: string | null
          ap_ib_courses: Json | null
          background_story: string | null
          colleges_admitted: Json | null
          colleges_rejected: Json | null
          colleges_waitlisted: Json | null
          created_at: string
          demographics: Json | null
          essay_excerpts: Json | null
          gpa_unweighted: number | null
          gpa_weighted: number | null
          graduation_year: number
          high_school: string
          honors_awards: Json | null
          id: string
          intended_major: string | null
          leadership_positions: string[] | null
          name: string
          profile_photo: string | null
          sat_score: number | null
          updated_at: string
        }
        Insert: {
          act_score?: number | null
          activities?: Json | null
          advice?: string | null
          ap_ib_courses?: Json | null
          background_story?: string | null
          colleges_admitted?: Json | null
          colleges_rejected?: Json | null
          colleges_waitlisted?: Json | null
          created_at?: string
          demographics?: Json | null
          essay_excerpts?: Json | null
          gpa_unweighted?: number | null
          gpa_weighted?: number | null
          graduation_year: number
          high_school: string
          honors_awards?: Json | null
          id?: string
          intended_major?: string | null
          leadership_positions?: string[] | null
          name: string
          profile_photo?: string | null
          sat_score?: number | null
          updated_at?: string
        }
        Update: {
          act_score?: number | null
          activities?: Json | null
          advice?: string | null
          ap_ib_courses?: Json | null
          background_story?: string | null
          colleges_admitted?: Json | null
          colleges_rejected?: Json | null
          colleges_waitlisted?: Json | null
          created_at?: string
          demographics?: Json | null
          essay_excerpts?: Json | null
          gpa_unweighted?: number | null
          gpa_weighted?: number | null
          graduation_year?: number
          high_school?: string
          honors_awards?: Json | null
          id?: string
          intended_major?: string | null
          leadership_positions?: string[] | null
          name?: string
          profile_photo?: string | null
          sat_score?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      document_chunks: {
        Row: {
          chunk_index: number
          content: string
          created_at: string
          document_id: string
          embedding: string | null
          id: string
          metadata: Json | null
        }
        Insert: {
          chunk_index: number
          content: string
          created_at?: string
          document_id: string
          embedding?: string | null
          id?: string
          metadata?: Json | null
        }
        Update: {
          chunk_index?: number
          content?: string
          created_at?: string
          document_id?: string
          embedding?: string | null
          id?: string
          metadata?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "document_chunks_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          content: string
          created_at: string
          file_path: string | null
          file_type: string
          id: string
          title: string
          updated_at: string
          uploaded_by: string | null
        }
        Insert: {
          content: string
          created_at?: string
          file_path?: string | null
          file_type: string
          id?: string
          title: string
          updated_at?: string
          uploaded_by?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          file_path?: string | null
          file_type?: string
          id?: string
          title?: string
          updated_at?: string
          uploaded_by?: string | null
        }
        Relationships: []
      }
      essays: {
        Row: {
          content: string | null
          created_at: string | null
          deadline: string | null
          id: string
          prompt_name: string
          school_id: string | null
          school_name: string
          status: string | null
          updated_at: string | null
          user_id: string | null
          word_limit: number | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          deadline?: string | null
          id?: string
          prompt_name: string
          school_id?: string | null
          school_name: string
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
          word_limit?: number | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          deadline?: string | null
          id?: string
          prompt_name?: string
          school_id?: string | null
          school_name?: string
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
          word_limit?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "essays_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "user_school_lists"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          title: string
          type: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          title: string
          type?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          title?: string
          type?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          achievement_levels: string[] | null
          activities: Json | null
          ap_ib_courses: string[] | null
          citizenship: string | null
          class_rank: string | null
          created_at: string | null
          current_courses: string[] | null
          email: string | null
          first_generation: boolean | null
          full_name: string | null
          gender: string | null
          gpa_unweighted: number | null
          gpa_weighted: number | null
          high_school: string | null
          honors_awards: Json | null
          id: string
          income_bracket: string | null
          leadership_positions: string[] | null
          race_ethnicity: string | null
          sat_act_score: string | null
          updated_at: string | null
          years_involved: number | null
        }
        Insert: {
          achievement_levels?: string[] | null
          activities?: Json | null
          ap_ib_courses?: string[] | null
          citizenship?: string | null
          class_rank?: string | null
          created_at?: string | null
          current_courses?: string[] | null
          email?: string | null
          first_generation?: boolean | null
          full_name?: string | null
          gender?: string | null
          gpa_unweighted?: number | null
          gpa_weighted?: number | null
          high_school?: string | null
          honors_awards?: Json | null
          id: string
          income_bracket?: string | null
          leadership_positions?: string[] | null
          race_ethnicity?: string | null
          sat_act_score?: string | null
          updated_at?: string | null
          years_involved?: number | null
        }
        Update: {
          achievement_levels?: string[] | null
          activities?: Json | null
          ap_ib_courses?: string[] | null
          citizenship?: string | null
          class_rank?: string | null
          created_at?: string | null
          current_courses?: string[] | null
          email?: string | null
          first_generation?: boolean | null
          full_name?: string | null
          gender?: string | null
          gpa_unweighted?: number | null
          gpa_weighted?: number | null
          high_school?: string | null
          honors_awards?: Json | null
          id?: string
          income_bracket?: string | null
          leadership_positions?: string[] | null
          race_ethnicity?: string | null
          sat_act_score?: string | null
          updated_at?: string | null
          years_involved?: number | null
        }
        Relationships: []
      }
      school_research: {
        Row: {
          content: string
          created_at: string
          id: string
          school_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content?: string
          created_at?: string
          id?: string
          school_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          school_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "school_research_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "user_school_lists"
            referencedColumns: ["id"]
          },
        ]
      }
      schools_catalog: {
        Row: {
          acceptance_rate: string | null
          created_at: string | null
          id: string
          location: string | null
          name: string
          ranking: string | null
          tuition: string | null
          type: string | null
          updated_at: string | null
        }
        Insert: {
          acceptance_rate?: string | null
          created_at?: string | null
          id?: string
          location?: string | null
          name: string
          ranking?: string | null
          tuition?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          acceptance_rate?: string | null
          created_at?: string | null
          id?: string
          location?: string | null
          name?: string
          ranking?: string | null
          tuition?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_school_lists: {
        Row: {
          acceptance_rate: string | null
          application_type: string | null
          created_at: string | null
          deadline: string | null
          id: string
          location: string | null
          major: string | null
          name: string
          ranking: string | null
          school_catalog_id: string | null
          status: string | null
          tuition: string | null
          type: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          acceptance_rate?: string | null
          application_type?: string | null
          created_at?: string | null
          deadline?: string | null
          id?: string
          location?: string | null
          major?: string | null
          name: string
          ranking?: string | null
          school_catalog_id?: string | null
          status?: string | null
          tuition?: string | null
          type?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          acceptance_rate?: string | null
          application_type?: string | null
          created_at?: string | null
          deadline?: string | null
          id?: string
          location?: string | null
          major?: string | null
          name?: string
          ranking?: string | null
          school_catalog_id?: string | null
          status?: string | null
          tuition?: string | null
          type?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_school_lists_school_catalog_id_fkey"
            columns: ["school_catalog_id"]
            isOneToOne: false
            referencedRelation: "schools_catalog"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      binary_quantize: {
        Args: { "": string } | { "": unknown }
        Returns: unknown
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: Database["public"]["Enums"]["app_role"]
      }
      halfvec_avg: {
        Args: { "": number[] }
        Returns: unknown
      }
      halfvec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      halfvec_send: {
        Args: { "": unknown }
        Returns: string
      }
      halfvec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
      hnsw_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_sparsevec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnswhandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflathandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      l2_norm: {
        Args: { "": unknown } | { "": unknown }
        Returns: number
      }
      l2_normalize: {
        Args: { "": string } | { "": unknown } | { "": unknown }
        Returns: string
      }
      match_documents: {
        Args: {
          query_embedding: string
          match_threshold?: number
          match_count?: number
        }
        Returns: {
          id: string
          document_id: string
          content: string
          metadata: Json
          similarity: number
        }[]
      }
      sparsevec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      sparsevec_send: {
        Args: { "": unknown }
        Returns: string
      }
      sparsevec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      vector_avg: {
        Args: { "": number[] }
        Returns: string
      }
      vector_dims: {
        Args: { "": string } | { "": unknown }
        Returns: number
      }
      vector_norm: {
        Args: { "": string }
        Returns: number
      }
      vector_out: {
        Args: { "": string }
        Returns: unknown
      }
      vector_send: {
        Args: { "": string }
        Returns: string
      }
      vector_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
    }
    Enums: {
      app_role: "admin" | "student" | "advisor"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "student", "advisor"],
    },
  },
} as const
