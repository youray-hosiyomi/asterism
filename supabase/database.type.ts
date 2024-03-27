export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          operationName?: string;
          query?: string;
          variables?: Json;
          extensions?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      profiles: {
        Row: {
          avatar_url: string | null;
          full_name: string | null;
          id: string;
          updated_at: string | null;
          username: string | null;
          website: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          full_name?: string | null;
          id: string;
          updated_at?: string | null;
          username?: string | null;
          website?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          full_name?: string | null;
          id?: string;
          updated_at?: string | null;
          username?: string | null;
          website?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey";
            columns: ["id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      repositories: {
        Row: {
          created_at: string | null;
          created_by: string | null;
          detail: string | null;
          id: string;
          image_path: string | null;
          name: string;
          owner_id: string | null;
          updated_at: string | null;
          updated_by: string | null;
        };
        Insert: {
          created_at?: string | null;
          created_by?: string | null;
          detail?: string | null;
          id?: string;
          image_path?: string | null;
          name: string;
          owner_id?: string | null;
          updated_at?: string | null;
          updated_by?: string | null;
        };
        Update: {
          created_at?: string | null;
          created_by?: string | null;
          detail?: string | null;
          id?: string;
          image_path?: string | null;
          name?: string;
          owner_id?: string | null;
          updated_at?: string | null;
          updated_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "repositories_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "repositories_owner_id_fkey";
            columns: ["owner_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "repositories_updated_by_fkey";
            columns: ["updated_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      repository_table_cells: {
        Row: {
          created_at: string | null;
          created_by: string | null;
          repository_id: string;
          repository_table_column_name: string;
          repository_table_name: string;
          repository_table_row_id: string;
          updated_at: string | null;
          updated_by: string | null;
          value: string | null;
        };
        Insert: {
          created_at?: string | null;
          created_by?: string | null;
          repository_id: string;
          repository_table_column_name: string;
          repository_table_name: string;
          repository_table_row_id: string;
          updated_at?: string | null;
          updated_by?: string | null;
          value?: string | null;
        };
        Update: {
          created_at?: string | null;
          created_by?: string | null;
          repository_id?: string;
          repository_table_column_name?: string;
          repository_table_name?: string;
          repository_table_row_id?: string;
          updated_at?: string | null;
          updated_by?: string | null;
          value?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "repository_table_cells_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "repository_table_cells_repository_id_fkey";
            columns: ["repository_id"];
            isOneToOne: false;
            referencedRelation: "repositories";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "repository_table_cells_repository_table_column_name_reposi_fkey";
            columns: ["repository_table_column_name", "repository_table_name", "repository_id"];
            isOneToOne: false;
            referencedRelation: "repository_table_columns";
            referencedColumns: ["name", "repository_table_name", "repository_id"];
          },
          {
            foreignKeyName: "repository_table_cells_repository_table_name_repository_id_fkey";
            columns: ["repository_table_name", "repository_id"];
            isOneToOne: false;
            referencedRelation: "repository_tables";
            referencedColumns: ["name", "repository_id"];
          },
          {
            foreignKeyName: "repository_table_cells_repository_table_row_id_repository__fkey";
            columns: ["repository_table_row_id", "repository_table_name", "repository_id"];
            isOneToOne: false;
            referencedRelation: "repository_table_rows";
            referencedColumns: ["id", "repository_table_name", "repository_id"];
          },
          {
            foreignKeyName: "repository_table_cells_updated_by_fkey";
            columns: ["updated_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      repository_table_columns: {
        Row: {
          created_at: string | null;
          created_by: string | null;
          detail: string | null;
          name: string;
          repository_id: string;
          repository_table_name: string;
          updated_at: string | null;
          updated_by: string | null;
        };
        Insert: {
          created_at?: string | null;
          created_by?: string | null;
          detail?: string | null;
          name: string;
          repository_id: string;
          repository_table_name: string;
          updated_at?: string | null;
          updated_by?: string | null;
        };
        Update: {
          created_at?: string | null;
          created_by?: string | null;
          detail?: string | null;
          name?: string;
          repository_id?: string;
          repository_table_name?: string;
          updated_at?: string | null;
          updated_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "repository_table_columns_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "repository_table_columns_repository_id_fkey";
            columns: ["repository_id"];
            isOneToOne: false;
            referencedRelation: "repositories";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "repository_table_columns_repository_table_name_repository__fkey";
            columns: ["repository_table_name", "repository_id"];
            isOneToOne: false;
            referencedRelation: "repository_tables";
            referencedColumns: ["name", "repository_id"];
          },
          {
            foreignKeyName: "repository_table_columns_updated_by_fkey";
            columns: ["updated_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      repository_table_fk_cells: {
        Row: {
          created_at: string | null;
          created_by: string | null;
          repository_id: string;
          repository_table_fk_column_name: string;
          repository_table_name: string;
          repository_table_row_id: string;
          target_repository_table_fk_column_name: string;
          target_repository_table_name: string;
          updated_at: string | null;
          updated_by: string | null;
        };
        Insert: {
          created_at?: string | null;
          created_by?: string | null;
          repository_id: string;
          repository_table_fk_column_name: string;
          repository_table_name: string;
          repository_table_row_id: string;
          target_repository_table_fk_column_name: string;
          target_repository_table_name: string;
          updated_at?: string | null;
          updated_by?: string | null;
        };
        Update: {
          created_at?: string | null;
          created_by?: string | null;
          repository_id?: string;
          repository_table_fk_column_name?: string;
          repository_table_name?: string;
          repository_table_row_id?: string;
          target_repository_table_fk_column_name?: string;
          target_repository_table_name?: string;
          updated_at?: string | null;
          updated_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "repository_table_fk_cells_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "repository_table_fk_cells_repository_id_fkey";
            columns: ["repository_id"];
            isOneToOne: false;
            referencedRelation: "repositories";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "repository_table_fk_cells_repository_table_fk_column_name__fkey";
            columns: ["repository_table_fk_column_name", "repository_table_name", "repository_id"];
            isOneToOne: false;
            referencedRelation: "repository_table_fk_columns";
            referencedColumns: ["name", "repository_table_name", "repository_id"];
          },
          {
            foreignKeyName: "repository_table_fk_cells_repository_table_name_repository_fkey";
            columns: ["repository_table_name", "repository_id"];
            isOneToOne: false;
            referencedRelation: "repository_tables";
            referencedColumns: ["name", "repository_id"];
          },
          {
            foreignKeyName: "repository_table_fk_cells_repository_table_row_id_reposito_fkey";
            columns: ["repository_table_row_id", "repository_table_name", "repository_id"];
            isOneToOne: false;
            referencedRelation: "repository_table_rows";
            referencedColumns: ["id", "repository_table_name", "repository_id"];
          },
          {
            foreignKeyName: "repository_table_fk_cells_target_repository_table_fk_colum_fkey";
            columns: ["target_repository_table_fk_column_name", "target_repository_table_name", "repository_id"];
            isOneToOne: false;
            referencedRelation: "repository_table_fk_columns";
            referencedColumns: ["name", "repository_table_name", "repository_id"];
          },
          {
            foreignKeyName: "repository_table_fk_cells_target_repository_table_name_rep_fkey";
            columns: ["target_repository_table_name", "repository_id"];
            isOneToOne: false;
            referencedRelation: "repository_tables";
            referencedColumns: ["name", "repository_id"];
          },
          {
            foreignKeyName: "repository_table_fk_cells_updated_by_fkey";
            columns: ["updated_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      repository_table_fk_columns: {
        Row: {
          created_at: string | null;
          created_by: string | null;
          detail: string | null;
          name: string;
          repository_id: string;
          repository_table_name: string;
          target_repository_table_name: string;
          updated_at: string | null;
          updated_by: string | null;
        };
        Insert: {
          created_at?: string | null;
          created_by?: string | null;
          detail?: string | null;
          name: string;
          repository_id: string;
          repository_table_name: string;
          target_repository_table_name: string;
          updated_at?: string | null;
          updated_by?: string | null;
        };
        Update: {
          created_at?: string | null;
          created_by?: string | null;
          detail?: string | null;
          name?: string;
          repository_id?: string;
          repository_table_name?: string;
          target_repository_table_name?: string;
          updated_at?: string | null;
          updated_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "repository_table_fk_columns_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "repository_table_fk_columns_repository_id_fkey";
            columns: ["repository_id"];
            isOneToOne: false;
            referencedRelation: "repositories";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "repository_table_fk_columns_repository_table_name_reposito_fkey";
            columns: ["repository_table_name", "repository_id"];
            isOneToOne: false;
            referencedRelation: "repository_tables";
            referencedColumns: ["name", "repository_id"];
          },
          {
            foreignKeyName: "repository_table_fk_columns_target_repository_table_name_r_fkey";
            columns: ["target_repository_table_name", "repository_id"];
            isOneToOne: false;
            referencedRelation: "repository_tables";
            referencedColumns: ["name", "repository_id"];
          },
          {
            foreignKeyName: "repository_table_fk_columns_updated_by_fkey";
            columns: ["updated_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      repository_table_render_columns: {
        Row: {
          created_at: string | null;
          created_by: string | null;
          detail: string | null;
          name: string;
          repository_id: string;
          repository_table_name: string;
          updated_at: string | null;
          updated_by: string | null;
        };
        Insert: {
          created_at?: string | null;
          created_by?: string | null;
          detail?: string | null;
          name: string;
          repository_id: string;
          repository_table_name: string;
          updated_at?: string | null;
          updated_by?: string | null;
        };
        Update: {
          created_at?: string | null;
          created_by?: string | null;
          detail?: string | null;
          name?: string;
          repository_id?: string;
          repository_table_name?: string;
          updated_at?: string | null;
          updated_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "repository_table_render_colum_repository_table_name_reposi_fkey";
            columns: ["repository_table_name", "repository_id"];
            isOneToOne: false;
            referencedRelation: "repository_tables";
            referencedColumns: ["name", "repository_id"];
          },
          {
            foreignKeyName: "repository_table_render_columns_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "repository_table_render_columns_repository_id_fkey";
            columns: ["repository_id"];
            isOneToOne: false;
            referencedRelation: "repositories";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "repository_table_render_columns_updated_by_fkey";
            columns: ["updated_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      repository_table_rows: {
        Row: {
          created_at: string | null;
          created_by: string | null;
          detail: string | null;
          id: string;
          repository_id: string;
          repository_table_name: string;
          updated_at: string | null;
          updated_by: string | null;
        };
        Insert: {
          created_at?: string | null;
          created_by?: string | null;
          detail?: string | null;
          id?: string;
          repository_id: string;
          repository_table_name: string;
          updated_at?: string | null;
          updated_by?: string | null;
        };
        Update: {
          created_at?: string | null;
          created_by?: string | null;
          detail?: string | null;
          id?: string;
          repository_id?: string;
          repository_table_name?: string;
          updated_at?: string | null;
          updated_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "repository_table_rows_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "repository_table_rows_repository_id_fkey";
            columns: ["repository_id"];
            isOneToOne: false;
            referencedRelation: "repositories";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "repository_table_rows_repository_table_name_repository_id_fkey";
            columns: ["repository_table_name", "repository_id"];
            isOneToOne: false;
            referencedRelation: "repository_tables";
            referencedColumns: ["name", "repository_id"];
          },
          {
            foreignKeyName: "repository_table_rows_updated_by_fkey";
            columns: ["updated_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      repository_tables: {
        Row: {
          created_at: string | null;
          created_by: string | null;
          detail: string | null;
          name: string;
          render_rule: Json | null;
          repository_id: string;
          updated_at: string | null;
          updated_by: string | null;
        };
        Insert: {
          created_at?: string | null;
          created_by?: string | null;
          detail?: string | null;
          name: string;
          render_rule?: Json | null;
          repository_id: string;
          updated_at?: string | null;
          updated_by?: string | null;
        };
        Update: {
          created_at?: string | null;
          created_by?: string | null;
          detail?: string | null;
          name?: string;
          render_rule?: Json | null;
          repository_id?: string;
          updated_at?: string | null;
          updated_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "repository_tables_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "repository_tables_repository_id_fkey";
            columns: ["repository_id"];
            isOneToOne: false;
            referencedRelation: "repositories";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "repository_tables_updated_by_fkey";
            columns: ["updated_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      schedules: {
        Row: {
          completed_at: string | null;
          created_at: string | null;
          created_by: string | null;
          detail: string | null;
          id: string;
          is_all_day: boolean;
          is_emergency: boolean;
          is_important: boolean;
          plan_from_at: string;
          plan_to_at: string;
          title: string;
          updated_at: string | null;
          updated_by: string | null;
          user_id: string;
        };
        Insert: {
          completed_at?: string | null;
          created_at?: string | null;
          created_by?: string | null;
          detail?: string | null;
          id?: string;
          is_all_day?: boolean;
          is_emergency?: boolean;
          is_important?: boolean;
          plan_from_at: string;
          plan_to_at: string;
          title: string;
          updated_at?: string | null;
          updated_by?: string | null;
          user_id: string;
        };
        Update: {
          completed_at?: string | null;
          created_at?: string | null;
          created_by?: string | null;
          detail?: string | null;
          id?: string;
          is_all_day?: boolean;
          is_emergency?: boolean;
          is_important?: boolean;
          plan_from_at?: string;
          plan_to_at?: string;
          title?: string;
          updated_at?: string | null;
          updated_by?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "schedules_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "schedules_updated_by_fkey";
            columns: ["updated_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "schedules_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      auth_check_repository: {
        Args: {
          repository_id: string;
        };
        Returns: boolean;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null;
          avif_autodetection: boolean | null;
          created_at: string | null;
          file_size_limit: number | null;
          id: string;
          name: string;
          owner: string | null;
          owner_id: string | null;
          public: boolean | null;
          updated_at: string | null;
        };
        Insert: {
          allowed_mime_types?: string[] | null;
          avif_autodetection?: boolean | null;
          created_at?: string | null;
          file_size_limit?: number | null;
          id: string;
          name: string;
          owner?: string | null;
          owner_id?: string | null;
          public?: boolean | null;
          updated_at?: string | null;
        };
        Update: {
          allowed_mime_types?: string[] | null;
          avif_autodetection?: boolean | null;
          created_at?: string | null;
          file_size_limit?: number | null;
          id?: string;
          name?: string;
          owner?: string | null;
          owner_id?: string | null;
          public?: boolean | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      migrations: {
        Row: {
          executed_at: string | null;
          hash: string;
          id: number;
          name: string;
        };
        Insert: {
          executed_at?: string | null;
          hash: string;
          id: number;
          name: string;
        };
        Update: {
          executed_at?: string | null;
          hash?: string;
          id?: number;
          name?: string;
        };
        Relationships: [];
      };
      objects: {
        Row: {
          bucket_id: string | null;
          created_at: string | null;
          id: string;
          last_accessed_at: string | null;
          metadata: Json | null;
          name: string | null;
          owner: string | null;
          owner_id: string | null;
          path_tokens: string[] | null;
          updated_at: string | null;
          version: string | null;
        };
        Insert: {
          bucket_id?: string | null;
          created_at?: string | null;
          id?: string;
          last_accessed_at?: string | null;
          metadata?: Json | null;
          name?: string | null;
          owner?: string | null;
          owner_id?: string | null;
          path_tokens?: string[] | null;
          updated_at?: string | null;
          version?: string | null;
        };
        Update: {
          bucket_id?: string | null;
          created_at?: string | null;
          id?: string;
          last_accessed_at?: string | null;
          metadata?: Json | null;
          name?: string | null;
          owner?: string | null;
          owner_id?: string | null;
          path_tokens?: string[] | null;
          updated_at?: string | null;
          version?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "objects_bucketId_fkey";
            columns: ["bucket_id"];
            isOneToOne: false;
            referencedRelation: "buckets";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      can_insert_object: {
        Args: {
          bucketid: string;
          name: string;
          owner: string;
          metadata: Json;
        };
        Returns: undefined;
      };
      extension: {
        Args: {
          name: string;
        };
        Returns: string;
      };
      filename: {
        Args: {
          name: string;
        };
        Returns: string;
      };
      foldername: {
        Args: {
          name: string;
        };
        Returns: unknown;
      };
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>;
        Returns: {
          size: number;
          bucket_id: string;
        }[];
      };
      search: {
        Args: {
          prefix: string;
          bucketname: string;
          limits?: number;
          levels?: number;
          offsets?: number;
          search?: string;
          sortcolumn?: string;
          sortorder?: string;
        };
        Returns: {
          name: string;
          id: string;
          updated_at: string;
          created_at: string;
          last_accessed_at: string;
          metadata: Json;
        }[];
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    ? (Database["public"]["Tables"] & Database["public"]["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends keyof Database["public"]["Tables"] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends keyof Database["public"]["Tables"] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends keyof Database["public"]["Enums"] | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
    ? Database["public"]["Enums"][PublicEnumNameOrOptions]
    : never;
