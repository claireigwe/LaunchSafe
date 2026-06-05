/**
 * Supabase database type definitions.
 *
 * This file is a placeholder. Generate the real types by running:
 *   npx supabase gen types typescript --project-id <your-project-id> > types/database.types.ts
 *
 * Or via the Supabase CLI:
 *   supabase gen types typescript --local > types/database.types.ts
 */
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
      // Tables will be populated after running schema migrations.
      // Run: npx supabase gen types typescript --project-id <id>
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
