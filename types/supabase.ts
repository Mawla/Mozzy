export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type PostStatus = "draft" | "published";
export type PodcastStatus = "draft" | "published";
export type TeamRole = "owner" | "admin" | "member";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          full_name: string | null;
          avatar_url: string | null;
          website: string | null;
          bio: string | null;
          email: string;
          metadata: Json;
        };
        Insert: {
          id: string;
          created_at?: string;
          updated_at?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          website?: string | null;
          bio?: string | null;
          email: string;
          metadata?: Json;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          website?: string | null;
          bio?: string | null;
          email?: string;
          metadata?: Json;
        };
      };
      teams: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          name: string;
          slug: string;
          description: string | null;
          logo_url: string | null;
          metadata: Json;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          name: string;
          slug: string;
          description?: string | null;
          logo_url?: string | null;
          metadata?: Json;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          logo_url?: string | null;
          metadata?: Json;
        };
      };
      team_members: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          team_id: string;
          user_id: string;
          role: TeamRole;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          team_id: string;
          user_id: string;
          role?: TeamRole;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          team_id?: string;
          user_id?: string;
          role?: TeamRole;
        };
      };
      team_invites: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          team_id: string;
          email: string;
          role: TeamRole;
          token: string;
          expires_at: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          team_id: string;
          email: string;
          role?: TeamRole;
          token?: string;
          expires_at?: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          team_id?: string;
          email?: string;
          role?: TeamRole;
          token?: string;
          expires_at?: string;
        };
      };
      posts: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          title: string;
          content: string;
          user_id: string;
          team_id: string | null;
          status: PostStatus;
          metadata: Json;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          title: string;
          content: string;
          user_id: string;
          team_id?: string | null;
          status?: PostStatus;
          metadata?: Json;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          title?: string;
          content?: string;
          user_id?: string;
          team_id?: string | null;
          status?: PostStatus;
          metadata?: Json;
        };
      };
      templates: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          title: string;
          content: string;
          user_id: string;
          team_id: string | null;
          metadata: Json;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          title: string;
          content: string;
          user_id: string;
          team_id?: string | null;
          metadata?: Json;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          title?: string;
          content?: string;
          user_id?: string;
          team_id?: string | null;
          metadata?: Json;
        };
      };
      podcasts: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          title: string;
          description: string;
          audio_url: string;
          user_id: string;
          team_id: string | null;
          status: PodcastStatus;
          metadata: Json;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          title: string;
          description: string;
          audio_url: string;
          user_id: string;
          team_id?: string | null;
          status?: PodcastStatus;
          metadata?: Json;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          title?: string;
          description?: string;
          audio_url?: string;
          user_id?: string;
          team_id?: string | null;
          status?: PodcastStatus;
          metadata?: Json;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      get_user_content: {
        Args: { user_uuid: string };
        Returns: {
          content_type: string;
          id: string;
          title: string;
          created_at: string;
          status: string;
        }[];
      };
      get_team_members: {
        Args: { team_uuid: string };
        Returns: {
          user_id: string;
          full_name: string;
          email: string;
          role: TeamRole;
          joined_at: string;
        }[];
      };
      is_team_admin: {
        Args: { team_uuid: string; user_uuid: string };
        Returns: boolean;
      };
    };
    Enums: {
      post_status: PostStatus;
      podcast_status: PodcastStatus;
      team_role: TeamRole;
    };
  };
}
