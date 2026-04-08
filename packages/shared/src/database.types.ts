// ================================================
// AUTO-GENERATED — NÃO EDITAR MANUALMENTE
// Gerado por: supabase gen types typescript --linked
// Regenerar após cada migration: npm run db:types
//
// NOTA: Este arquivo está vazio enquanto o schema
// não foi aplicado. Será preenchido na Story 1.3
// após executar: supabase db push
// ================================================

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: Record<string, never>;
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];

export type TablesInsert<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert'];

export type TablesUpdate<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update'];
