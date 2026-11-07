-- Existing installations: run once in the Supabase SQL Editor before deploying.
-- Adds participating institutions without changing any existing records.
BEGIN;
ALTER TABLE public.programs ADD COLUMN IF NOT EXISTS universities TEXT[] NOT NULL DEFAULT '{}';
ALTER TABLE public.programs ADD COLUMN IF NOT EXISTS consortium_name TEXT NOT NULL DEFAULT '';
NOTIFY pgrst, 'reload schema';
COMMIT;
