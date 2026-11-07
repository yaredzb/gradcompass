-- GradQuest: Defaults, legacy upgrades and JSON validation
-- SQL Editor tab: 02_validation.sql
-- Run after 01_tables.sql.
-- Run this entire file as the database owner.

BEGIN;
SELECT pg_advisory_xact_lock(728419036);

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

COMMIT;
