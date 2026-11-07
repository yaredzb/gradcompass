-- GradQuest: Indexes and automatic updated_at timestamps
-- SQL Editor tab: 04_indexes_and_triggers.sql
-- Run after 01 through 03.
-- Run this entire file as the database owner.

BEGIN;
SELECT pg_advisory_xact_lock(728419036);

-- -----------------------------------------------------------------------------
-- 3. Performance & Search Indexes
-- -----------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_programs_university ON public.programs(university);
CREATE INDEX IF NOT EXISTS idx_programs_degree_route ON public.programs(degree_route);
CREATE INDEX IF NOT EXISTS idx_programs_countries ON public.programs USING GIN (countries);
CREATE INDEX IF NOT EXISTS idx_programs_assigned_regions ON public.programs USING GIN (assigned_regions);
CREATE INDEX IF NOT EXISTS idx_programs_fields ON public.programs USING GIN (fields);
CREATE INDEX IF NOT EXISTS idx_programs_created_at ON public.programs(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_funding_program_id ON public.funding_opportunities(program_id);
CREATE INDEX IF NOT EXISTS idx_funding_funding_type ON public.funding_opportunities(funding_type);
CREATE INDEX IF NOT EXISTS idx_funding_coverage ON public.funding_opportunities(coverage);
CREATE INDEX IF NOT EXISTS idx_funding_ethiopian_eligibility ON public.funding_opportunities(ethiopian_eligibility);
CREATE INDEX IF NOT EXISTS idx_funding_created_at ON public.funding_opportunities(created_at DESC);

-- -----------------------------------------------------------------------------
-- 4. Automatic updated_at Trigger
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_programs_updated_at ON public.programs;
CREATE TRIGGER trg_programs_updated_at
    BEFORE UPDATE ON public.programs
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_funding_updated_at ON public.funding_opportunities;
CREATE TRIGGER trg_funding_updated_at
    BEFORE UPDATE ON public.funding_opportunities
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

COMMIT;
