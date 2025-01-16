export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: number
          name: string
          age: number
          weight?: number
          height?: number
          gender: string
          improvement_areas: Json
          budget: string
          equipment: Json
          current_health: Json
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          age: number
          weight?: number
          height?: number
          gender: string
          improvement_areas: Json
          budget: string
          equipment: Json
          current_health: Json
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          age?: number
          weight?: number
          height?: number
          gender?: string
          improvement_areas?: Json
          budget?: string
          equipment?: Json
          current_health?: Json
          created_at?: string
        }
      }
      protocol_sections: {
        Row: {
          id: number
          section_id: string
          title: string
          content: string
          categories: Json
          url: string
          created_at: string
        }
        Insert: {
          id?: number
          section_id: string
          title: string
          content: string
          categories: Json
          url: string
          created_at?: string
        }
        Update: {
          id?: number
          section_id?: string
          title?: string
          content?: string
          categories?: Json
          url?: string
          created_at?: string
        }
      }
      routines: {
        Row: {
          id: number
          user_id: number | null
          supplements: Json
          diet: Json
          exercise: Json
          sleep_schedule: Json
          metrics: Json
          protocol_links: Json
          embedded_sections: Json
          created_at: string
        }
        Insert: {
          id?: number
          user_id?: number | null
          supplements: Json
          diet: Json
          exercise: Json
          sleep_schedule: Json
          metrics: Json
          protocol_links: Json
          embedded_sections?: Json
          created_at?: string
        }
        Update: {
          id?: number
          user_id?: number | null
          supplements?: Json
          diet?: Json
          exercise?: Json
          sleep_schedule?: Json
          metrics?: Json
          protocol_links?: Json
          embedded_sections?: Json
          created_at?: string
        }
      }
      metrics: {
        Row: {
          id: number
          user_id: number | null
          date: string
          weight?: number
          sleep_hours?: number
          steps?: number
          supplements?: Json
          created_at: string
        }
        Insert: {
          id?: number
          user_id?: number | null
          date: string
          weight?: number
          sleep_hours?: number
          steps?: number
          supplements?: Json
          created_at?: string
        }
        Update: {
          id?: number
          user_id?: number | null
          date?: string
          weight?: number
          sleep_hours?: number
          steps?: number
          supplements?: Json
          created_at?: string
        }
      }
    }
  }
}
