export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      posts: {
        Row: {
          id: string;
          created_at: string;
          title: string;
          content: string;
          user_id: string;
          status: "draft" | "published";
        };
        Insert: {
          id?: string;
          created_at?: string;
          title: string;
          content: string;
          user_id: string;
          status?: "draft" | "published";
        };
        Update: {
          id?: string;
          created_at?: string;
          title?: string;
          content?: string;
          user_id?: string;
          status?: "draft" | "published";
        };
      };
      templates: {
        Row: {
          id: string;
          created_at: string;
          title: string;
          content: string;
          user_id: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          title: string;
          content: string;
          user_id: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          title?: string;
          content?: string;
          user_id?: string;
        };
      };
      podcasts: {
        Row: {
          id: string;
          created_at: string;
          title: string;
          description: string;
          audio_url: string;
          user_id: string;
          status: "draft" | "published";
        };
        Insert: {
          id?: string;
          created_at?: string;
          title: string;
          description: string;
          audio_url: string;
          user_id: string;
          status?: "draft" | "published";
        };
        Update: {
          id?: string;
          created_at?: string;
          title?: string;
          description?: string;
          audio_url?: string;
          user_id?: string;
          status?: "draft" | "published";
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
