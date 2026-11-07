-- GradQuest: One-time demo programs and funding
-- SQL Editor tab: 06_demo_records.sql
-- Run last. Reruns preserve edits and never recreate deleted demos.
-- Run this entire file as the database owner.

BEGIN;
SELECT pg_advisory_xact_lock(728419036);

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
