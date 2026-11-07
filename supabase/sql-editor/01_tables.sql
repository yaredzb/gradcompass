-- GradQuest: Tables and initialization history
-- SQL Editor tab: 01_tables.sql
-- Run first. Creates tables; row-level security is enabled immediately.
-- Run this entire file as the database owner.

BEGIN;
SELECT pg_advisory_xact_lock(728419036);

-- Enable required extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- -----------------------------------------------------------------------------
-- 1. Table: programs
-- Stores graduate degree programs (Master's, Direct PhD, Integrated Master's-PhD)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.programs (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    official_name TEXT NOT NULL,
    university TEXT NOT NULL,
    is_joint_program BOOLEAN NOT NULL DEFAULT FALSE,
    countries TEXT[] NOT NULL DEFAULT '{}',
    assigned_regions TEXT[] NOT NULL DEFAULT '{}',
    campus_cities JSONB NOT NULL DEFAULT '[]'::jsonb,
    official_link TEXT NOT NULL DEFAULT '',
    fields TEXT[] NOT NULL DEFAULT '{}',
    degree_route TEXT NOT NULL DEFAULT 'Unclear',
    direct_phd_entry TEXT DEFAULT 'Unclear',
    program_structure TEXT NOT NULL DEFAULT 'Unclear',
    apply_before_graduation TEXT NOT NULL DEFAULT 'Unclear',
    apply_before_graduation_notes TEXT DEFAULT '',
    minimum_grades TEXT DEFAULT '',
    grading_scale TEXT DEFAULT '',
    academic_prerequisites TEXT DEFAULT '',
    key_requirements TEXT DEFAULT '',
    medium_of_instruction TEXT NOT NULL DEFAULT 'Unclear',
    instruction_language_details TEXT DEFAULT '',
    english_proficiency JSONB NOT NULL DEFAULT '{"acceptedTests": []}'::jsonb,
    selection_steps TEXT[] NOT NULL DEFAULT '{}',
    admission_competitiveness JSONB NOT NULL DEFAULT '{}'::jsonb,
    proof_of_funds JSONB NOT NULL DEFAULT '{"required": "Unclear"}'::jsonb,
    fall_intake JSONB NOT NULL DEFAULT '{"term": "Fall intake", "status": "Unknown"}'::jsonb,
    spring_intake JSONB NOT NULL DEFAULT '{"term": "Spring intake", "status": "Unknown"}'::jsonb,
    information_last_checked TEXT DEFAULT CURRENT_DATE::text,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    -- Constraints on controlled enumerations
    CONSTRAINT chk_programs_degree_route CHECK (
        degree_route IN ('Masters', 'DirectPhD', 'IntegratedMastersPhD', 'MastersRequiredPhD', 'Unclear')
    ),
    CONSTRAINT chk_programs_direct_phd_entry CHECK (
        direct_phd_entry IS NULL OR direct_phd_entry IN ('DirectFromBachelors', 'MasterRequired', 'Unclear')
    ),
    CONSTRAINT chk_programs_program_structure CHECK (
        program_structure IN (
            'TaughtCourseworkOnly',
            'CourseworkPlusCapstone',
            'CourseworkPlusThesis',
            'ResearchMastersByThesis',
            'PhDByDissertation',
            'PhDCourseworkDissertation',
            'Other',
            'Unclear'
        )
    ),
    CONSTRAINT chk_programs_apply_before_grad CHECK (
        apply_before_graduation IN ('Yes', 'Conditional', 'No', 'Unclear')
    ),
    CONSTRAINT chk_programs_medium_of_instruction CHECK (
        medium_of_instruction IN ('English', 'LocalLanguage', 'Mixed', 'Other', 'Unclear')
    )
);

-- Additive upgrade: preserve existing institution labels and demo records.
ALTER TABLE public.programs ADD COLUMN IF NOT EXISTS universities TEXT[] NOT NULL DEFAULT '{}';
ALTER TABLE public.programs ADD COLUMN IF NOT EXISTS consortium_name TEXT NOT NULL DEFAULT '';

-- -----------------------------------------------------------------------------
-- 2. Table: funding_opportunities
-- Stores scholarships, salaried PhDs, assistantships, and waivers attached to programs
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.funding_opportunities (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    program_id TEXT NOT NULL REFERENCES public.programs(id) ON DELETE CASCADE,
    official_name TEXT NOT NULL,
    official_link TEXT NOT NULL DEFAULT '',
    funding_type TEXT NOT NULL DEFAULT 'Unclear',
    coverage TEXT NOT NULL DEFAULT 'Unclear',
    ethiopian_eligibility TEXT NOT NULL DEFAULT 'Unclear',
    monthly_stipend JSONB NOT NULL DEFAULT '{"isZeroConfirmed": false, "currency": "USD", "grossOrNet": "Gross", "isUnpublished": false}'::jsonb,
    fall_funding JSONB NOT NULL DEFAULT '{"term": "Fall intake", "status": "Unknown", "workflow": "Unclear"}'::jsonb,
    spring_funding JSONB NOT NULL DEFAULT '{"term": "Spring intake", "status": "Unknown", "workflow": "Unclear"}'::jsonb,
    intake_notes TEXT DEFAULT '',
    competitiveness JSONB NOT NULL DEFAULT '{}'::jsonb,
    visa_and_work_notes TEXT DEFAULT '',
    information_last_checked TEXT DEFAULT CURRENT_DATE::text,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    -- Constraints on controlled enumerations
    CONSTRAINT chk_funding_type CHECK (
        funding_type IN (
            'Scholarship',
            'SalariedPhD',
            'ResearchAssistantship',
            'TeachingAssistantship',
            'TuitionWaiver',
            'Other',
            'Unclear'
        )
    ),
    CONSTRAINT chk_funding_coverage CHECK (
        coverage IN (
            'FullRide',
            'FullTuitionPartialLiving',
            'FullTuitionOnly',
            'PartialTuition',
            'StipendOnly',
            'Other',
            'Unclear'
        )
    ),
    CONSTRAINT chk_funding_ethiopian_eligibility CHECK (
        ethiopian_eligibility IN ('EthiopiaSpecific', 'OpenToEthiopian', 'Ineligible', 'Unclear')
    )
);


-- Private initialization history is retained even when all demo rows are deleted.
CREATE SCHEMA IF NOT EXISTS gradsearch_private;
REVOKE ALL ON SCHEMA gradsearch_private FROM PUBLIC, anon, authenticated;
CREATE TABLE IF NOT EXISTS gradsearch_private.initializations (
    name TEXT PRIMARY KEY,
    applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE gradsearch_private.initializations ENABLE ROW LEVEL SECURITY;

-- Protect new tables before the access-policy script runs.
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.funding_opportunities ENABLE ROW LEVEL SECURITY;

COMMIT;
