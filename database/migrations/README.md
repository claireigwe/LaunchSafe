# Database Migrations

This directory stores numbered Supabase migration files.

## Running Migrations

### Option A — Supabase CLI (Recommended)

```bash
# Apply to local Supabase instance
supabase db push

# Apply to remote project
supabase db push --linked
```

### Option B — Manual (SQL Editor in Supabase Dashboard)

Run the files in `../schema/` in order:

1. `00_extensions.sql`
2. `01_users.sql`
3. `02_businesses.sql`
4. `03_assessments.sql`
5. `04_compliance.sql`
6. `05_billing.sql`
7. `06_regulatory.sql`
8. `07_documents.sql`
9. `08_notifications.sql`
10. `09_ai_knowledge.sql`
11. `10_rls_policies.sql`

## Generating TypeScript Types

After running migrations, regenerate the Supabase types:

```bash
npx supabase gen types typescript --project-id <your-project-id> > types/database.types.ts
```

## Migration Rules

- Every migration must be reversible
- Never modify existing migrations — create new ones for changes
- Destructive changes require a rollback migration
