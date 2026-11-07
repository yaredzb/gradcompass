-- GradQuest: complete database setup (alternative to the six SQL Editor tabs).
-- Generated from sql-editor/*.sql by: node supabase/assemble-schema.mjs
-- Edit the numbered files, then regenerate this combined version.

BEGIN;
SELECT pg_advisory_xact_lock(728419036);

-- Source: sql-editor/01_tables.sql
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

-- Source: sql-editor/02_validation.sql
-- Upgrade defaults on tables created by earlier versions, too.
ALTER TABLE public.programs
    ALTER COLUMN created_at SET DEFAULT now(),
    ALTER COLUMN updated_at SET DEFAULT now(),
    ALTER COLUMN fall_intake SET DEFAULT '{"term":"Fall intake","status":"Unknown"}'::jsonb,
    ALTER COLUMN spring_intake SET DEFAULT '{"term":"Spring intake","status":"Unknown"}'::jsonb;
ALTER TABLE public.funding_opportunities
    ALTER COLUMN created_at SET DEFAULT now(),
    ALTER COLUMN updated_at SET DEFAULT now(),
    ALTER COLUMN fall_funding SET DEFAULT '{"term":"Fall intake","status":"Unknown","workflow":"Unclear"}'::jsonb,
    ALTER COLUMN spring_funding SET DEFAULT '{"term":"Spring intake","status":"Unknown","workflow":"Unclear"}'::jsonb;

-- Repair legacy empty objects without replacing populated records.
UPDATE public.programs SET
    fall_intake = '{"term":"Fall intake","status":"Unknown"}'::jsonb || fall_intake,
    spring_intake = '{"term":"Spring intake","status":"Unknown"}'::jsonb || spring_intake
WHERE NOT (fall_intake ? 'status' AND fall_intake ? 'term'
       AND spring_intake ? 'status' AND spring_intake ? 'term');
UPDATE public.funding_opportunities SET
    fall_funding = '{"term":"Fall intake","status":"Unknown","workflow":"Unclear"}'::jsonb || fall_funding,
    spring_funding = '{"term":"Spring intake","status":"Unknown","workflow":"Unclear"}'::jsonb || spring_funding
WHERE NOT (fall_funding ? 'status' AND fall_funding ? 'term' AND fall_funding ? 'workflow'
       AND spring_funding ? 'status' AND spring_funding ? 'term' AND spring_funding ? 'workflow');
UPDATE public.funding_opportunities
SET fall_funding = jsonb_set(fall_funding, '{workflow}', '"Unclear"')
WHERE fall_funding->>'status' = 'NotOffered' AND fall_funding->>'workflow' = 'NotOffered';
UPDATE public.funding_opportunities
SET spring_funding = jsonb_set(spring_funding, '{workflow}', '"Unclear"')
WHERE spring_funding->>'status' = 'NotOffered' AND spring_funding->>'workflow' = 'NotOffered';

-- Validate the nested status/workflow values used by the app.
CREATE OR REPLACE FUNCTION public.gradsearch_valid_cycle(value JSONB, funding BOOLEAN)
RETURNS BOOLEAN LANGUAGE sql IMMUTABLE SET search_path = '' AS $fn$
    SELECT COALESCE(
        jsonb_typeof(value) = 'object'
        AND jsonb_typeof(value->'term') = 'string'
        AND CASE WHEN funding THEN
            value->>'status' IN ('Offered','Rolling','NotOffered','Unknown')
            AND value->>'workflow' IN ('Automatic','Separate','EarlierDeadline','DirectPosition','Unclear')
        ELSE value->>'status' IN ('FixedDeadline','Rolling','Unpublished','Unknown','NotOffered')
        END,
        FALSE
    );
$fn$;

ALTER TABLE public.programs DROP CONSTRAINT IF EXISTS chk_programs_json;
ALTER TABLE public.programs ADD CONSTRAINT chk_programs_json CHECK (
    jsonb_typeof(campus_cities) = 'array'
    AND jsonb_typeof(english_proficiency) = 'object'
    AND COALESCE(jsonb_typeof(english_proficiency->'acceptedTests') = 'array', FALSE)
    AND jsonb_typeof(admission_competitiveness) = 'object'
    AND public.gradsearch_valid_cycle(fall_intake, FALSE)
    AND public.gradsearch_valid_cycle(spring_intake, FALSE)
);
ALTER TABLE public.funding_opportunities DROP CONSTRAINT IF EXISTS chk_funding_json;
ALTER TABLE public.funding_opportunities ADD CONSTRAINT chk_funding_json CHECK (
    jsonb_typeof(monthly_stipend) = 'object'
    AND COALESCE(jsonb_typeof(monthly_stipend->'isZeroConfirmed') = 'boolean', FALSE)
    AND COALESCE(jsonb_typeof(monthly_stipend->'isUnpublished') = 'boolean', FALSE)
    AND COALESCE(jsonb_typeof(monthly_stipend->'currency') = 'string', FALSE)
    AND COALESCE(monthly_stipend->>'grossOrNet' IN ('Gross','Net','Unspecified'), FALSE)
    AND jsonb_typeof(competitiveness) = 'object'
    AND public.gradsearch_valid_cycle(fall_funding, TRUE)
    AND public.gradsearch_valid_cycle(spring_funding, TRUE)
);

-- Source: sql-editor/03_team_access.sql
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

-- Source: sql-editor/04_indexes_and_triggers.sql
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

-- Source: sql-editor/05_realtime.sql
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

-- Source: sql-editor/06_demo_records.sql
-- -----------------------------------------------------------------------------
-- 7. Seed Data: Initial Demo Records
-- Seed once. Reruns preserve edited records and never recreate deleted demos.
-- The explicit Restore Demo Records action is the only app path that restores them.
-- -----------------------------------------------------------------------------
DO $seed$
BEGIN
IF NOT EXISTS (SELECT 1 FROM gradsearch_private.initializations WHERE name = 'initial-demo-v1') THEN
INSERT INTO public.programs (
    id,
    official_name,
    university,
    is_joint_program,
    countries,
    assigned_regions,
    campus_cities,
    official_link,
    fields,
    degree_route,
    direct_phd_entry,
    program_structure,
    apply_before_graduation,
    apply_before_graduation_notes,
    minimum_grades,
    grading_scale,
    academic_prerequisites,
    key_requirements,
    medium_of_instruction,
    instruction_language_details,
    english_proficiency,
    selection_steps,
    admission_competitiveness,
    fall_intake,
    spring_intake,
    information_last_checked,
    created_at,
    updated_at
) VALUES 
(
    'demo-program-1',
    '[DEMO EXAMPLE] Nordic Master in Embedded AI & Autonomous Systems',
    'Stockholm Consortium of Technology',
    false,
    ARRAY['Sweden'],
    ARRAY['Europe', 'Nordic countries'],
    '[{"city": "Stockholm", "currency": "SEK", "sourceLink": "", "minMonthlyCost": "", "typicalMonthlyCost": ""}]'::jsonb,
    'https://example.org/nordic-master-embedded-ai',
    ARRAY['Artificial Intelligence', 'Computer Engineering', 'Embedded Systems'],
    'Masters',
    'Unclear',
    'CourseworkPlusThesis',
    'Yes',
    'Provisional degree certificate and official 7-semester transcripts accepted before final July graduation.',
    '3.5 / 4.0 CGPA or equivalent First Class Honours',
    '4.0 Scale / ECTS Scale',
    'B.Sc. in Electrical Engineering, Computer Engineering, or Computer Science with at least 30 ECTS in mathematics, algorithms, and signal processing.',
    'Official transcripts, 1-page Statement of Purpose, Academic CV, and 2 faculty reference letters.',
    'English',
    '100% instructed in English for all coursework, labs, and master thesis research.',
    '{"waivers": "Full waiver granted if undergraduate degree was formally taught and examined in English with an official university confirmation letter.", "acceptedTests": ["TOEFL iBT", "IELTS Academic", "PTE Academic", "Medium of Instruction Certificate"], "minimumScores": "TOEFL iBT 90 (min 20 writing) or IELTS 6.5 (no subscore below 6.0)"}'::jsonb,
    ARRAY['Academic document review', 'Technical background assessment', 'Virtual faculty interview'],
    '{"sourceLink": "https://example.org/nordic-ai-stats", "sourceYear": "2026", "metricDetails": "Typical admitted applicants rank within the top 10% of their graduating undergraduate class."}'::jsonb,
    '{"term": "Fall 2027", "notes": "Application window: Oct 15, 2026 – Jan 15, 2027.", "status": "FixedDeadline", "endDate": "2027-01-15", "startDate": "2026-10-15", "deadlineDate": "2027-01-15"}'::jsonb,
    '{"term": "Spring 2028", "notes": "This master program only admits one cohort per academic year in the Fall.", "status": "NotOffered"}'::jsonb,
    '2026-11-01',
    '2026-11-01T08:00:00.000Z',
    '2026-11-01T08:00:00.000Z'
),
(
    'demo-program-2',
    '[DEMO EXAMPLE] Direct PhD in Electrical & Computer Systems',
    'Gulf Advanced Institute of Science & Technology',
    false,
    ARRAY['United Arab Emirates'],
    ARRAY['GCC'],
    '[{"city": "Abu Dhabi", "currency": "AED", "sourceLink": "", "minMonthlyCost": "", "typicalMonthlyCost": ""}]'::jsonb,
    'https://example.org/gaist-direct-phd-ecs',
    ARRAY['Electrical Engineering', 'Computer Engineering', 'Machine Learning'],
    'DirectPhD',
    'DirectFromBachelors',
    'PhDCourseworkDissertation',
    'Yes',
    'Graduating seniors can apply with preliminary transcripts; final degree verification must be submitted at registration.',
    '3.6 / 4.0 CGPA',
    '4.0 Scale',
    '4-year B.Sc. in Electrical Engineering, Computer Engineering, or AI directly from an accredited university. No master degree required.',
    'Transcripts, research statement outlining intended research sub-field, 3 letters of recommendation, and CV.',
    'English',
    'English is the sole official language of all graduate instruction and doctoral research.',
    '{"waivers": "Waiver considered for native English speakers or applicants holding a degree from an English-medium university with verification.", "acceptedTests": ["TOEFL iBT", "IELTS Academic", "EmSAT English"], "minimumScores": "TOEFL iBT 91 or IELTS Academic 6.5"}'::jsonb,
    ARRAY['Departmental credential screening', 'Faculty advisor matching & interview', 'Research aptitude panel evaluation'],
    '{"sourceLink": "https://example.org/gaist-phd-stats", "sourceYear": "2026", "metricDetails": "Cohort size capped at ~25 doctoral fellows per year; competitive GPA averages 3.75+."}'::jsonb,
    '{"term": "Fall 2027", "notes": "Priority Fall application window: Sep 1, 2026 – Dec 1, 2026.", "status": "FixedDeadline", "endDate": "2026-12-01", "startDate": "2026-09-01", "deadlineDate": "2026-12-01"}'::jsonb,
    '{"term": "Spring 2028", "notes": "Spring application window: May 1, 2027 – Sep 15, 2027.", "status": "FixedDeadline", "endDate": "2027-09-15", "startDate": "2027-05-01", "deadlineDate": "2027-09-15"}'::jsonb,
    '2026-11-01',
    '2026-11-01T08:00:00.000Z',
    '2026-11-01T08:00:00.000Z'
)
ON CONFLICT (id) DO NOTHING;

-- Seed Demo Funding Records
INSERT INTO public.funding_opportunities (
    id,
    program_id,
    official_name,
    official_link,
    funding_type,
    coverage,
    ethiopian_eligibility,
    monthly_stipend,
    fall_funding,
    spring_funding,
    intake_notes,
    competitiveness,
    visa_and_work_notes,
    information_last_checked,
    created_at,
    updated_at
) VALUES 
(
    'demo-funding-1',
    'demo-program-1',
    'Nordic Future AI Full-Ride Fellowship',
    'https://example.org/nordic-ai-fellowship',
    'Scholarship',
    'FullRide',
    'OpenToEthiopian',
    '{"grossOrNet": "Net", "amount": 1350, "currency": "EUR", "isUnpublished": false, "isZeroConfirmed": false}'::jsonb,
    '{"term": "Fall 2027", "status": "Offered", "workflow": "Automatic", "workflowNotes": "Every accepted international master student is automatically evaluated for the tuition waiver and monthly living fellowship."}'::jsonb,
    '{"term": "Spring 2028", "status": "NotOffered", "workflow": "Unclear", "workflowNotes": "Spring intake is not offered for this degree or fellowship."}'::jsonb,
    'Full-ride fellowship awarded for 24 months subject to satisfactory academic progress (minimum 3.0/4.0 semester GPA).',
    '{"sourceLink": "https://example.org/nordic-ai-stats", "sourceYear": "2026", "awardRateOrRatio": "8% published award rate (20 awards allocated from 250 international applicants)"}'::jsonb,
    'Swedish residence permit allows part-time work without hour restrictions, though full-time studies are expected.',
    '2026-11-01',
    '2026-11-01T08:00:00.000Z',
    '2026-11-01T08:00:00.000Z'
),
(
    'demo-funding-2',
    'demo-program-2',
    'Presidential Doctoral Fellowship',
    'https://example.org/gaist-presidential-fellowship',
    'SalariedPhD',
    'FullRide',
    'OpenToEthiopian',
    '{"grossOrNet": "Gross", "amount": 12000, "currency": "AED", "isUnpublished": false, "isZeroConfirmed": false}'::jsonb,
    '{"term": "Fall 2027", "status": "Offered", "workflow": "Automatic", "workflowNotes": "All admitted direct PhD candidates are automatically nominated for the Presidential fellowship."}'::jsonb,
    '{"term": "Spring 2028", "status": "NotOffered", "workflow": "Unclear", "workflowNotes": "Funding not offered for this intake. Spring program degree applicants must be self-funded or sponsored externally."}'::jsonb,
    'Spring degree admission is offered, but Presidential Fellowship funding is strictly restricted to Fall intake.',
    '{"sourceLink": "https://example.org/gaist-phd-stats", "sourceYear": "2026", "awardRateOrRatio": "15 funded seats allocated per cohort (approx. 180 applicants)"}'::jsonb,
    'Sponsored research visa provided by the institute; tax-free salary, single housing allowance, and full medical coverage included.',
    '2026-11-01',
    '2026-11-01T08:00:00.000Z',
    '2026-11-01T08:00:00.000Z'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO gradsearch_private.initializations (name) VALUES ('initial-demo-v1');
END IF;
END $seed$;

COMMIT;
