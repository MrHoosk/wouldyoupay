# Database Migrations

## Setup

To apply the `ideas` table migration:

1. Go to your Supabase project: https://supabase.com/dashboard
2. Navigate to **SQL Editor**
3. Copy the contents of `migrations/[timestamp]_create_ideas_table.sql`
4. Paste into the SQL editor
5. Click **Run**

Alternatively, if you have Supabase CLI installed:

```bash
supabase db push
```

## Verifying the Migration

After running, verify the table was created:

```sql
SELECT * FROM information_schema.tables WHERE table_name = 'ideas';
```

You should see:
- Table: `ideas`
- Indexes: `idx_ideas_user_id`, `idx_ideas_slug`, `idx_ideas_status`
- Row Level Security: Enabled
- Policies: Created for SELECT, INSERT, UPDATE, DELETE

## Testing

Insert a test idea:

```sql
INSERT INTO ideas (user_id, slug, title, tagline, problem, solution, audience, status)
VALUES (
  auth.uid(),
  'test-idea',
  'Test Idea',
  'This is a test tagline',
  'Testing the problem field',
  'Testing the solution field',
  'Developers',
  'draft'
);
```

Retrieve it:

```sql
SELECT * FROM ideas WHERE user_id = auth.uid();
```
