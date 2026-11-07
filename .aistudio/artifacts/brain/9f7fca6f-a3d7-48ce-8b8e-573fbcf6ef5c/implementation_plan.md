# Graduate Study & Scholarship Search Engine (EE · CE · AI)

A private, mobile-first research and record management engine built for a study group of fourth-year undergraduates in Electrical Engineering, Computer Engineering, and AI. Enables browsing, filtering, and curating Master’s, Direct PhD from bachelor’s, and Integrated Master’s–PhD opportunities with a focus on full-ride scholarships, tuition-only awards, and salaried PhD positions open to Ethiopian applicants.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> **Finalized Architectural & Functional Decisions:**
> 1. **Mobile-First Experience**: Designed primarily for phone viewports (360px–430px) without horizontal scrolling, touch targets $\ge 44\text{px}$, ergonomic drawer filters, and dense scannability, seamlessly adapting to desktop widescreen.
> 2. **Shared Supabase Cloud Database**: Single shared login (team email & password). All members see and edit the exact same shared records on their phones and PCs in real time. Signed-out visitors cannot view or edit data.
> 3. **Decoupled Intake Term vs. Deadline Date**:
>    - Intake is recorded as a dedicated term and year (e.g. **`Spring 2028`**, **`Fall 2027`**).
>    - Application deadline is recorded as an ISO date string (e.g. **`2027-09-15`**) rendered cleanly as **`September 15, 2027`**.
>    - Intake status (**`Fixed Deadline`**, **`Rolling`**, **`Unpublished`**, **`Unknown`**, **`Not offered`**) is decoupled into its own field so deadline sorting works reliably without string collision.
> 4. **Strict Direct-PhD Entry Scope**:
>    - Explicitly filters for PhDs open directly to bachelor’s degree holders. Excludes programs requiring a master's. Supports **`Unclear`** for unverified entry routes.
>    - Includes **“Apply directly to the funded position”** application process with its own official job/fellowship posting link and deadline.
> 5. **Scholarship Competitiveness Sources**:
>    - Records published award rate or awards-per-applicant ratio, accompanied by **`Source Link`** and **`Source Year`**.
>    - Stores **`Information Last Checked`** date on both program and award records.
> 6. **Institution Reuse & Automatic Region Derivation**:
>    - Universities and consortiums are selectable from an autocomplete list of existing entries or created on the fly.
>    - Country selection automatically determines and displays the browsing region (**GCC** with precedence, **Europe** with **Nordic countries** subgroup, **Asia**, **USA**, **Canada**, **Oceania**, **Other regions**).
>    - Joint programs (e.g. Erasmus Mundus) support multiple countries and are discoverable under each member country.
> 7. **Manual Blank Multi-City Living Costs**:
>    - Campus city, min monthly cost, typical monthly cost, currency, and source link entered manually per city and left blank until added.
> 8. **Exclusions**:
>    - No comparison matrix, no living-cost gap calculator, no currency conversion, and no Excel import.

---

### 1. Overview & Mobile-First User Experience

The application is engineered for long research sessions across mobile phones and desktop computers:

#### A. Mobile-First Layout Patterns
- **Zero Horizontal Scrolling**: Strict `max-w-full overflow-x-hidden` container discipline on mobile.
- **Header**: Single-row compact bar with brand title, quick theme toggle, and team account indicator.
- **Filter Bar**: Touch-friendly filter chips, search input, and a slide-over mobile drawer for deep faceting (Region, Country, University, Degree Route, Program Structure, Teaching Language, Ethiopian Eligibility, Funding Coverage).
- **Opportunity Cards**: High-scannability cards featuring:
  - University, Country, and assigned Region.
  - Degree route and Program structure.
  - Attached scholarships/salaries and Ethiopian eligibility.
  - Next upcoming intake term and sorted deadline date.
- **Inspector Modal**: Full-screen mobile bottom sheet / desktop dialog with academic prerequisites, English requirements, and connected funding schemes with official source links.
- **Add / Edit Modal**: Clean, step-by-step or accordion form designed for easy thumb entry on phones.

#### B. Anti-Fatigue Visual System
- **No Decorative Accent Lines**: Prohibits colored left-border stripes (`border-l-4`), decorative horizontal rules beneath headings, and pulsing status dots.
- **Zero-Pill Metadata**: Tags, dates, and categories are rendered as clean unboxed typography with typographic middot (`·`) separators.
- **Dual Themes**:
  - *Warm Paper Light*: Background `#FBF9F5`, structural surfaces `#F4EFE6` and `#FFFFFF`, borders `#E6DFD5`, text `#1F2937` (charcoal), muted text `#6B7280`, selective functional indigo `#2563EB`.
  - *Soft Dark Slate*: Background `#0F172A`, structural surfaces `#1E293B`, borders `#334155`, text `#F8FAFC`, muted text `#94A3B8`.
- **Typography**: `Plus Jakarta Sans` for clean structural UI, `Public Sans` for reading comfort, and tabular monospace (`IBM Plex Mono` / `tabular-nums`) for dates, costs, and scores.

---

### 2. Geographic Taxonomy & Automatic Mapping

When adding or editing a program, selecting one or more countries from a searchable picker automatically assigns and shows the browsing group:

| Browsing Group | Member Countries / Rules |
| :--- | :--- |
| **GCC** | United Arab Emirates (UAE), Saudi Arabia, Qatar, Bahrain, Kuwait, Oman. *(Takes precedence over Asia for its member countries).* |
| **Europe** | European countries (Germany, France, Switzerland, UK, Netherlands, Italy, Spain, etc.). |
| ↳ *Nordic subgroup* | Displays **Denmark, Norway, Finland, and Sweden** within the Europe category. |
| **Asia** | Japan, China, South Korea, Singapore, Malaysia, India, Taiwan, etc. *(Excludes GCC nations).* |
| **USA** | United States (top-level group). |
| **Canada** | Canada (top-level group). |
| **Oceania** | Australia, New Zealand, etc. |
| **Other regions** | All additional countries to support expanding research. |

- **Joint Programs & Erasmus Mundus**: Supports selecting multiple countries and campus cities. Tagged as Joint Programs, these records appear under every participating country's browse tree.
- **Institution Autocomplete**: Users can select from an existing university or consortium previously entered, or type a new one.

---

### 3. Application Workflow & Deadline Rules

#### A. Decoupled Program Intake & Deadline Schema
For **Fall** and **Spring** (and custom terms):
- **Intake Term**: Formatted with year (e.g. `Fall 2027`, `Spring 2028`).
- **Intake Status**: `FixedDeadline`, `Rolling`, `Unpublished`, `Unknown`, `NotOffered`.
- **Application Deadline**: Sortable date (e.g. `2027-09-15`) or null when status is not `FixedDeadline`.
- **Rolling / Status Notes**: Optional text (e.g. *“Rolling review until seats are filled; early review by Feb 1”*).

#### B. Funding Application Workflows
For each offered intake, users select: **“How do you apply for this scholarship?”**

1. **Automatic with program application**:
   - Shows program deadline with note: **“Automatically considered for funding.”**
   - Hides separate scholarship deadline.
2. **Separate scholarship application**:
   - Shows both program application deadline and scholarship application deadline.
   - Optional note: e.g. *“Admission offer required before applying.”*
3. **Earlier program deadline for scholarship consideration**:
   - Prompts for priority date.
   - Displays general program deadline alongside earlier date labeled: **“Apply by this date to be considered for funding.”**
4. **Apply directly to the funded position** (specifically for funded PhD positions):
   - Displays position-specific application link and direct vacancy deadline.
5. **Unclear**:
   - Displays: **“Check official scholarship page”** with prominent official award link.

#### C. Intakes Without Funding
- If a program admits students in Spring, but an award is only funded in Fall, the Spring section displays:
  - Spring program deadline alongside: **“Funding not offered for this intake.”**

---

### 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                        SHARED SUPABASE SIGN-IN                         │
│             (One shared team email & password authentication)          │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ (Real-Time Cloud Sync)
┌───────────────────────────────────▼────────────────────────────────────┐
│                    MOBILE-FIRST APPLICATION ROOT                       │
│             (Theme Context: Warm Paper Light / Soft Dark)              │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
    ┌───────────────────────────────┴───────────────────────────────┐
    │                                                               │
┌───▼────────────────────────┐                             ┌────────▼─────────────────────┐
│    Responsive Top Bar      │                             │    Geographic Engine         │
│ (Brand, Catalog, Add, Auth)│                             │   (Country -> Region/Nordic) │
└───┬────────────────────────┘                             └────────┬─────────────────────┘
    │                                                               │
    ├───────────────────────────────┬───────────────────────────────┤
    │                               │                               │
┌───▼──────────────────┐  ┌─────────▼──────────────┐  ┌─────────────▼──────────────┐
│  Mobile Catalog View │  │  Hierarchical Directory│  │   Program & Funding Form   │
│  - Drawer Filters    │  │  - Region -> Country   │  │   - Institution Combobox   │
│  - Field Tags & Route│  │    -> University       │  │   - Country Multi-Select   │
│  - Card / Table View │  │  - Erasmus Mundus Joint│  │   - Decoupled Terms/Dates  │
│  - Deadline Sorting  │  │    program discovery   │  │   - Direct PhD Entry Check │
└───┬──────────────────┘  └────────────────────────┘  └────────────────────────────┘
    │
┌───▼──────────────────────────────────────────────┐
│      Full Record Inspector (Drawer / Modal)      │
│  - Academic Requirements & Selection Steps       │
│  - Connected Awards with Workflow Badges         │
│  - Award Competitiveness (Rate, Source, Year)    │
│  - Multi-City Living Costs & Official Links      │
│  - Date Information Last Checked                 │
└──────────────────────────────────────────────────┘
```

#### A. Data Schema Definition

1. **`Program` Record**:
   - `id`: string (UUID)
   - `officialName`: string
   - `university`: string (autocomplete from existing, or new)
   - `isJointProgram`: boolean
   - `countries`: string[]
   - `assignedRegions`: string[]
   - `campusCities`: Array<{ city: string; minMonthlyCost?: number; typicalMonthlyCost?: number; currency?: string; sourceLink?: string }>
   - `officialLink`: string
   - `fields`: string[] (EE, CE, AI, custom)
   - `degreeRoute`: `'Masters' | 'DirectPhD' | 'IntegratedMastersPhD' | 'Unclear'`
   - `programStructure`: `'TaughtCourseworkOnly' | 'CourseworkPlusCapstone' | 'CourseworkPlusThesis' | 'ResearchMastersByThesis' | 'PhDByDissertation' | 'PhDCourseworkDissertation' | 'Other' | 'Unclear'`
   - `directPhDEntry`: `'DirectFromBachelors' | 'MasterRequired' | 'Unclear'` (MasterRequired excluded)
   - `applyBeforeGraduation`: `'Yes' | 'Conditional' | 'No' | 'Unclear'`
   - `applyBeforeGraduationNotes`: string
   - `minimumGrades`: string
   - `gradingScale`: string
   - `academicPrerequisites`: string
   - `keyRequirements`: string
   - `mediumOfInstruction`: `'English' | 'LocalLanguage' | 'Mixed' | 'Other' | 'Unclear'`
   - `instructionLanguageDetails`: string
   - `englishProficiency`: { acceptedTests: string[]; minimumScores: string; waivers: string }
   - `selectionSteps`: string[]
   - `admissionCompetitiveness`: { metricDetails: string; sourceYear: string; sourceLink?: string }
   - `fallIntake`: { term: string; status: 'FixedDeadline' | 'Rolling' | 'Unpublished' | 'Unknown' | 'NotOffered'; deadlineDate?: string; notes?: string }
   - `springIntake`: { term: string; status: 'FixedDeadline' | 'Rolling' | 'Unpublished' | 'Unknown' | 'NotOffered'; deadlineDate?: string; notes?: string }
   - `informationLastChecked`: string (date)
   - `createdAt`, `updatedAt`: string

2. **`FundingOpportunity` Record**:
   - `id`: string (UUID)
   - `programId`: string (FK)
   - `officialName`: string
   - `officialLink`: string
   - `fundingType`: `'Scholarship' | 'SalariedPhD' | 'ResearchAssistantship' | 'TeachingAssistantship' | 'TuitionWaiver' | 'Other' | 'Unclear'`
   - `coverage`: `'FullRide' | 'FullTuitionPartialLiving' | 'FullTuitionOnly' | 'PartialTuition' | 'StipendOnly' | 'Other' | 'Unclear'`
   - `ethiopianEligibility`: `'EthiopiaSpecific' | 'OpenToEthiopian' | 'Ineligible' | 'Unclear'`
   - `monthlyStipend`: { amount?: number; isZeroConfirmed: boolean; currency: string; grossOrNet: 'Gross' | 'Net' | 'Unspecified'; isUnpublished: boolean }
   - `fallFunding`: {
       term: string;
       status: 'Offered' | 'Rolling' | 'NotOffered' | 'Unknown';
       workflow: 'Automatic' | 'Separate' | 'EarlierDeadline' | 'DirectPosition' | 'Unclear';
       scholarshipDeadlineDate?: string;
       earlierDeadlineDate?: string;
       directPositionLink?: string;
       directPositionDeadlineDate?: string;
       workflowNotes?: string;
     }
   - `springFunding`: {
       term: string;
       status: 'Offered' | 'Rolling' | 'NotOffered' | 'Unknown';
       workflow: 'Automatic' | 'Separate' | 'EarlierDeadline' | 'DirectPosition' | 'Unclear';
       scholarshipDeadlineDate?: string;
       earlierDeadlineDate?: string;
       directPositionLink?: string;
       directPositionDeadlineDate?: string;
       workflowNotes?: string;
     }
   - `intakeNotes`: string
   - `competitiveness`: { awardRateOrRatio?: string; sourceYear?: string; sourceLink?: string }
   - `visaAndWorkNotes`: string
   - `informationLastChecked`: string (date)
   - `createdAt`, `updatedAt`: string

#### B. Exactly Two Clearly Labeled Demo Records

1. **Demo Record 1 (Master's Full-Ride Fellowship - Automatic Workflow)**:
   - Name: `[DEMO EXAMPLE] Nordic Master in Embedded AI & Autonomous Systems`
   - University: *Stockholm Consortium of Technology*
   - Country: *Sweden* (Auto-assigned: **Europe → Nordic countries**)
   - Joint Program: *No*
   - Degree Route: *Master's* | Structure: *Taught coursework plus thesis*
   - Medium of Instruction: *English*
   - Fall Intake: Term: `Fall 2027` | Status: `FixedDeadline` | Deadline: `2027-01-15` (Jan 15, 2027)
   - Spring Intake: Term: `Spring 2028` | Status: `NotOffered`
   - Living costs: left blank initially
   - Funding Award: *Nordic Future AI Full-Ride Fellowship*
     - Type: *Scholarship* | Coverage: *Full ride* | Eligibility: *Open to Ethiopian applicants*
     - Monthly stipend: €1,350 net
     - Fall Funding: Term: `Fall 2027` | Status: `Offered` | Workflow: *Automatic with program application* (shows Jan 15, 2027 program deadline with *“Automatically considered for funding”*)
     - Spring Funding: Term: `Spring 2028` | Status: `NotOffered`
     - Competitiveness: *8% published award rate (20 awards from 250 applicants)*, Source Year: `2026`, Source Link: `https://example.org/nordic-ai-stats`
     - Date last checked: `2026-11-01`

2. **Demo Record 2 (Direct PhD - Fall+Spring Program, Fall-Only Funding)**:
   - Name: `[DEMO EXAMPLE] Direct PhD in Electrical & Computer Systems`
   - University: *Gulf Advanced Institute of Science & Technology*
   - Country: *United Arab Emirates* (Auto-assigned: **GCC**)
   - Joint Program: *No*
   - Degree Route: *Direct PhD from bachelor’s* | Direct PhD Entry: *DirectFromBachelors*
   - Structure: *PhD with coursework plus dissertation*
   - Medium of Instruction: *English*
   - Fall Intake: Term: `Fall 2027` | Status: `FixedDeadline` | Deadline: `2026-12-01` (Dec 1, 2026)
   - Spring Intake: Term: `Spring 2028` | Status: `FixedDeadline` | Deadline: `2027-09-15` (Sep 15, 2027)
   - Living costs: left blank initially
   - Funding Award: *Presidential Doctoral Fellowship*
     - Type: *Salaried PhD* | Coverage: *Full ride* | Eligibility: *Open to Ethiopian applicants*
     - Monthly salary: 12,000 AED gross
     - Fall Funding: Term: `Fall 2027` | Status: `Offered` | Workflow: *Automatic with program application* (shows Dec 01, 2026 with *“Automatically considered for funding”*)
     - Spring Funding: Term: `Spring 2028` | Status: `NotOffered` (shows Spring program deadline Sep 15, 2027 alongside: *“Funding not offered for this intake”*)
     - Competitiveness: *15 funded seats allocated per cohort (approx. 180 applicants)*, Source Year: `2026`, Source Link: `https://example.org/gaist-phd-stats`
     - Intake notes: *Spring degree admission offered, but Presidential Fellowship funding is strictly restricted to Fall intake.*
     - Date last checked: `2026-11-01`

---

### Step-by-Step Execution Plan

1. **Global Styles & Mobile-First Setup**:
   - Add `@custom-variant dark` in `src/index.css`.
   - Setup warm paper light and soft dark palette tokens without decorative accent lines.
   - Configure viewport and anti-fatigue typography.
2. **Geopolitical Region Mapping Engine**:
   - Implement `getCountryRegion(countryName)` returning primary group (`GCC`, `Europe`, `Asia`, `USA`, `Canada`, `Oceania`, `Other regions`) and subgroup (`Nordic countries` for Denmark, Norway, Finland, Sweden; GCC precedence over Asia).
3. **Shared Supabase Client & Access Gate**:
   - Implement shared team email/password sign-in gate.
   - Provide seamless offline-safe shared local storage sync fallback with live Supabase client connector.
4. **Relational Program & Funding Store**:
   - Implement storage manager initialized with the two clearly labeled demo records.
   - Support creating, updating, and deleting programs and attached funding records.
5. **Mobile-First Catalog & Filter Engine**:
   - Search bar + quick filter chips + mobile slide-over filter drawer.
   - Facets: Region, Country, University, Fields, Route, Structure, Language, Program Intake Status, Funding Status, Ethiopian Eligibility, Funding Coverage.
   - Reliable date sorting based on separated `deadlineDate`.
6. **Hierarchical Directory Tree**:
   - Mobile-friendly collapsible tree: Region → Country → University/Consortium.
   - Support for joint programs (Erasmus Mundus) appearing under each participating country.
7. **Detailed Inspector & Form**:
   - Full Record view (academic background, English proficiency, selection steps, connected awards with workflow labels, competitiveness source/year, multi-city living costs, last checked date).
   - Add/Edit form with university autocomplete, searchable country multi-select with auto-region assignment, decoupled intake terms and dates, conditional scholarship workflows (including "Apply directly to funded position"), and blank living costs.
8. **Automated Verification & Edge-Case Testing**:
   - Test selecting Sweden, Japan, UAE, USA, Canada, Australia assigns expected groups.
   - Test joint program with multiple countries.
   - Test program with two awards.
   - Test spring admission with fall-only scholarship.
   - Test "Apply directly to funded position" workflow.
   - Test blank living costs.
   - Run `compile_applet` and `lint_applet` together to verify type safety and error-free compilation.
