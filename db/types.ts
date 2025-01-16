import { Database as DatabaseGenerated } from "@/lib/types";

export interface Database extends DatabaseGenerated {
  public: {
    Tables: {
      users: {
        Row: {
          id: number;
          name: string;
          age: number;
          weight?: number;
          height?: number;
          gender: string;
          improvement_areas: string[];
          budget: string;
          equipment: string[];
          current_health: string[];
          created_at: string;
        };
        Insert: {
          id?: number;
          name: string;
          age: number;
          weight?: number;
          height?: number;
          gender: string;
          improvement_areas: string[];
          budget: string;
          equipment: string[];
          current_health: string[];
          created_at?: string;
        };
        Update: {
          id?: number;
          name?: string;
          age?: number;
          weight?: number;
          height?: number;
          gender?: string;
          improvement_areas?: string[];
          budget?: string;
          equipment?: string[];
          current_health?: string[];
          created_at?: string;
        };
      };
      protocol_sections: {
        Row: {
          id: number;
          section_id: string;
          title: string;
          content: string;
          categories: Json;
          url: string;
          created_at: string;
        }
        Insert: {
          id?: number;
          section_id: string;
          title: string;
          content: string;
          categories: Json;
          url: string;
          created_at?: string;
        }
        Update: {
          id?: number;
          section_id?: string;
          title?: string;
          content?: string;
          categories?: Json;
          url?: string;
          created_at?: string;
        }
      }
      routines: {
        Row: {
          id: number;
          user_id: number | null;
          supplements: any;
          diet: any;
          exercise: any;
          sleep_schedule: any;
          metrics: any;
          protocol_links: any;
          embedded_sections: any;
          created_at: string;
        };
        Insert: {
          id?: number;
          user_id?: number | null;
          supplements: any;
          diet: any;
          exercise: any;
          sleep_schedule: any;
          metrics: any;
          protocol_links: any;
          embedded_sections?: any;
          created_at?: string;
        };
        Update: {
          id?: number;
          user_id?: number | null;
          supplements?: any;
          diet?: any;
          exercise?: any;
          sleep_schedule?: any;
          metrics?: any;
          protocol_links?: any;
          embedded_sections?: any;
          created_at?: string;
        };
      }
      metrics: {
        Row: {
          id: number;
          user_id: number | null;
          date: string;
          weight?: number;
          sleep_hours?: number;
          steps?: number;
          supplements?: Json;
          created_at: string;
        }
        Insert: {
          id?: number;
          user_id?: number | null;
          date: string;
          weight?: number;
          sleep_hours?: number;
          steps?: number;
          supplements?: Json;
          created_at?: string;
        }
        Update: {
          id?: number;
          user_id?: number | null;
          date?: string;
          weight?: number;
          sleep_hours?: number;
          steps?: number;
          supplements?: Json;
          created_at?: string;
        }
      }
    }
  }
}

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]