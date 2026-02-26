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
      profiles: {
        Row: {
          id: string;
          user_id: string;
          full_name: string | null;
          email: string | null;
          avatar_url: string | null;
          stripe_customer_id: string | null;
          subscription_status: string;
          subscription_plan: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          full_name?: string | null;
          email?: string | null;
          avatar_url?: string | null;
          stripe_customer_id?: string | null;
          subscription_status?: string;
          subscription_plan?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          full_name?: string | null;
          email?: string | null;
          avatar_url?: string | null;
          stripe_customer_id?: string | null;
          subscription_status?: string;
          subscription_plan?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      purchases: {
        Row: {
          id: string;
          user_id: string;
          product_id: string;
          product_name: string;
          amount: number;
          stripe_payment_id: string | null;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          product_id: string;
          product_name: string;
          amount: number;
          stripe_payment_id?: string | null;
          status?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          product_id?: string;
          product_name?: string;
          amount?: number;
          status?: string;
          stripe_payment_id?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      analyse_results: {
        Row: {
          id: string;
          user_id: string;
          answers: Json;
          result: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          answers: Json;
          result: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          answers?: Json;
          result?: Json;
          created_at?: string;
        };
        Relationships: [];
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          stripe_subscription_id: string | null;
          stripe_customer_id: string | null;
          status: string;
          plan: string;
          current_period_start: string | null;
          current_period_end: string | null;
          cancel_at_period_end: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          stripe_subscription_id?: string | null;
          stripe_customer_id?: string | null;
          status: string;
          plan?: string;
          current_period_start?: string | null;
          current_period_end?: string | null;
          cancel_at_period_end?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          stripe_subscription_id?: string | null;
          stripe_customer_id?: string | null;
          status?: string;
          plan?: string;
          current_period_start?: string | null;
          current_period_end?: string | null;
          cancel_at_period_end?: boolean;
          updated_at?: string;
        };
        Relationships: [];
      };
      waitlist: {
        Row: {
          id: string;
          email: string;
          source: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          source?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          source?: string;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Purchase = Database["public"]["Tables"]["purchases"]["Row"];
export type AnalyseResult = Database["public"]["Tables"]["analyse_results"]["Row"];
export type Subscription = Database["public"]["Tables"]["subscriptions"]["Row"];
