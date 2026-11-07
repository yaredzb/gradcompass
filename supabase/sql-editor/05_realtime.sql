-- GradQuest: Realtime publication registration
-- SQL Editor tab: 05_realtime.sql
-- Run after 01 through 04. Skips registration if the publication is unavailable.
-- Run this entire file as the database owner.

BEGIN;
SELECT pg_advisory_xact_lock(728419036);

-- -----------------------------------------------------------------------------
-- 6. Enable Realtime Replication (Supabase Realtime)
-- -----------------------------------------------------------------------------
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'programs'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.programs;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'funding_opportunities'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.funding_opportunities;
    END IF;
EXCEPTION
    WHEN undefined_object THEN NULL;
END $$;

COMMIT;
