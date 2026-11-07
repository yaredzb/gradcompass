-- GradQuest: Team membership, API grants and row-level security
-- SQL Editor tab: 03_team_access.sql
-- Run after 01 and 02. Create initial Auth accounts before this script.
-- Run this entire file as the database owner.

BEGIN;
SELECT pg_advisory_xact_lock(728419036);

-- Only approved team members can access the shared catalog.
CREATE TABLE IF NOT EXISTS public.team_members (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    added_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.team_members FROM anon, authenticated;
GRANT SELECT ON public.team_members TO authenticated;
DROP POLICY IF EXISTS "Members can read their membership" ON public.team_members;
CREATE POLICY "Members can read their membership" ON public.team_members
    FOR SELECT TO authenticated USING (user_id = (SELECT auth.uid()));

-- Existing accounts already had access in the old schema: retain it once.
-- Future accounts must be approved explicitly using the SQL shown in README.md.
DO $members$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM gradsearch_private.initializations WHERE name = 'team-members-v1') THEN
        INSERT INTO public.team_members (user_id)
        SELECT id FROM auth.users ON CONFLICT (user_id) DO NOTHING;
        INSERT INTO gradsearch_private.initializations (name) VALUES ('team-members-v1');
    END IF;
END $members$;

GRANT USAGE ON SCHEMA public TO authenticated;
REVOKE ALL ON public.programs, public.funding_opportunities FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.programs, public.funding_opportunities TO authenticated;

-- -----------------------------------------------------------------------------
-- 5. Row-Level Security (RLS) Policies
-- Enforces authenticated team access: signed-out visitors cannot view or edit
-- -----------------------------------------------------------------------------
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.funding_opportunities ENABLE ROW LEVEL SECURITY;

-- Programs policies
DROP POLICY IF EXISTS "Allow authenticated users to read programs" ON public.programs;
CREATE POLICY "Allow authenticated users to read programs"
    ON public.programs FOR SELECT
    TO authenticated
    USING (EXISTS (SELECT 1 FROM public.team_members WHERE user_id = (SELECT auth.uid())));

DROP POLICY IF EXISTS "Allow authenticated users to insert programs" ON public.programs;
CREATE POLICY "Allow authenticated users to insert programs"
    ON public.programs FOR INSERT
    TO authenticated
    WITH CHECK (EXISTS (SELECT 1 FROM public.team_members WHERE user_id = (SELECT auth.uid())));

DROP POLICY IF EXISTS "Allow authenticated users to update programs" ON public.programs;
CREATE POLICY "Allow authenticated users to update programs"
    ON public.programs FOR UPDATE
    TO authenticated
    USING (EXISTS (SELECT 1 FROM public.team_members WHERE user_id = (SELECT auth.uid())))
    WITH CHECK (EXISTS (SELECT 1 FROM public.team_members WHERE user_id = (SELECT auth.uid())));

DROP POLICY IF EXISTS "Allow authenticated users to delete programs" ON public.programs;
CREATE POLICY "Allow authenticated users to delete programs"
    ON public.programs FOR DELETE
    TO authenticated
    USING (EXISTS (SELECT 1 FROM public.team_members WHERE user_id = (SELECT auth.uid())));

-- Funding Opportunities policies
DROP POLICY IF EXISTS "Allow authenticated users to read funding" ON public.funding_opportunities;
CREATE POLICY "Allow authenticated users to read funding"
    ON public.funding_opportunities FOR SELECT
    TO authenticated
    USING (EXISTS (SELECT 1 FROM public.team_members WHERE user_id = (SELECT auth.uid())));

DROP POLICY IF EXISTS "Allow authenticated users to insert funding" ON public.funding_opportunities;
CREATE POLICY "Allow authenticated users to insert funding"
    ON public.funding_opportunities FOR INSERT
    TO authenticated
    WITH CHECK (EXISTS (SELECT 1 FROM public.team_members WHERE user_id = (SELECT auth.uid())));

DROP POLICY IF EXISTS "Allow authenticated users to update funding" ON public.funding_opportunities;
CREATE POLICY "Allow authenticated users to update funding"
    ON public.funding_opportunities FOR UPDATE
    TO authenticated
    USING (EXISTS (SELECT 1 FROM public.team_members WHERE user_id = (SELECT auth.uid())))
    WITH CHECK (EXISTS (SELECT 1 FROM public.team_members WHERE user_id = (SELECT auth.uid())));

DROP POLICY IF EXISTS "Allow authenticated users to delete funding" ON public.funding_opportunities;
CREATE POLICY "Allow authenticated users to delete funding"
    ON public.funding_opportunities FOR DELETE
    TO authenticated
    USING (EXISTS (SELECT 1 FROM public.team_members WHERE user_id = (SELECT auth.uid())));

COMMIT;
