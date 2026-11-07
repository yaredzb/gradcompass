# GradQuest — Graduate Study & Scholarship Search Engine
### Electrical Engineering · Computer Engineering · Artificial Intelligence

A private, mobile-first research and record management engine built for scholars and students curating Master’s, Direct PhD from bachelor’s, and Integrated Master’s–PhD opportunities worldwide, with a specialized focus on full-ride scholarships, tuition-only awards, and salaried PhD positions open to Ethiopian applicants.

---

## Key Features

- **Shareable Program Links**: Every details page has a URL at `/programs/<id>/<institution-and-program-slug>`. Links support refresh, bookmarks, new tabs, and browser Back/Forward. Renamed programs remain accessible through the original ID. Teammates must sign in with an approved account. Use **Copy link** in the details header to share a record.
- **Decoupled Intake & Chronological Deadlines**:
  - Intake terms (e.g., `Fall 2027`, `Spring 2028`) are decoupled from ISO deadline dates (`2027-01-15`) and intake status (`FixedDeadline`, `Rolling`, `NotOffered`), ensuring accurate chronological sorting without string collision.
- **Strict Direct-PhD Entry Classification**:
  - Distinguishes programs accepting bachelor’s holders directly from those requiring a master’s degree.
  - Supports direct-to-position application workflows with official vacancy postings and deadlines.
- **Geographic Taxonomy Engine**:
  - Automatic country-to-region mapping: **GCC** (with precedence), **Europe** (with dedicated **Nordic countries** subgroup), **Asia**, **USA**, **Canada**, **Oceania**, and **Other regions**.
  - Multi-country joint programs (such as Erasmus Mundus) appear under every participating nation in the directory tree.
- **Multi-Faceted Filtering & Search**:
  - Instant text search across programs, universities, cities, and research fields.
  - Deep-filtering drawer by region, country, institution, degree route, structure, instruction language, Ethiopian eligibility, funding coverage, and intake term.
  - Quick preset filters (e.g., *Full-Ride for Ethiopian Applicants*, *Direct PhD from Bachelor’s*, *English Coursework-Only*).
- **Dual Catalog Views**:
  - **Grid View**: High-scannability opportunity cards with academic tags, top funding headline, and next deadline anchor.
  - **Spreadsheet View**: Comprehensive data table with horizontal touch-momentum scrolling for dense cross-comparison.
- **Hierarchical Directory Tree**:
  - Collapsible browse tree: Region → Country → University/Consortium → Individual Degree Programs.
- **Program & Funding Dossier**:
  - Deep inspector view displaying academic prerequisites, minimum grades, grading scale, accepted English proficiency tests with waiver details, admission competitiveness metrics with source citations, multi-city living cost estimates, and attached funding schemes.
- **Modern Dialogs & Zero Plain Popups**:
  - Accessible, responsive confirmation dialogs (`ConfirmModal`) with smooth animations and keyboard navigation (`Escape` dismissal).
  - Clean inline validation alerts in forms with no jarring browser popups.
- **Mobile-First & Anti-Fatigue Design**:
  - Strict container discipline with zero horizontal overflow on phone viewports (360px–430px).
  - Touch target ergonomics ($\ge 44\text{px}$) across navigation, inputs, and dialogs.
  - Dual themes: *Warm Paper Light* (`#FBF9F5`) and *Soft Dark Slate* (`#0F172A`).

---

## Tech Stack

- **UI & Framework**: [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Vite](https://vite.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Database & Sync**: [Supabase](https://supabase.com/) (`@supabase/supabase-js` v2)
  - PostgreSQL schema with automated `updated_at` triggers
  - GIN indexes on array columns (`countries`, `assigned_regions`, `fields`)
  - Row-Level Security (RLS) enforcing authenticated team access
  - Browser storage for unconfigured local development; Supabase is authoritative when configured
- **Testing**: [Vitest](https://vitest.dev/), [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/), [JSDOM](https://github.com/jsdom/jsdom)

---

## Project Structure

```
gradsearch-ee·ce·ai/
├── src/
│   ├── components/
│   │   ├── detail/                  # Program detail dossier sections
│   │   │   ├── AcademicStructureSection.tsx
│   │   │   ├── AdmissionCriteriaSection.tsx
│   │   │   ├── DeadlinesSidebar.tsx
│   │   │   ├── DetailHeader.tsx
│   │   │   ├── DetailPrimitives.tsx
│   │   │   ├── FundingAwardCard.tsx
│   │   │   ├── FundingSection.tsx
│   │   │   ├── LivingCostsSidebar.tsx
│   │   │   └── RecordMetaSidebar.tsx
│   │   ├── filters/                 # Search header, presets, and drawer
│   │   │   ├── FilterDrawer.tsx
│   │   │   ├── FilterPresets.tsx
│   │   │   └── FilterSearchHeader.tsx
│   │   ├── program-form/            # Modular program create/edit form sections
│   │   ├── funding-form/            # Modular funding opportunity form sections
│   │   ├── AuthGate.tsx             # Team login gate
│   │   ├── ConfirmModal.tsx         # Modern accessible confirmation dialog
│   │   ├── DirectoryTreeView.tsx    # Hierarchical Region->Country->Uni tree
│   │   ├── FilterBar.tsx            # Filter container and state definition
│   │   ├── FundingFormModal.tsx     # Add/edit scholarship modal
│   │   ├── ProgramCard.tsx          # Opportunity catalog card
│   │   ├── ProgramDetailPage.tsx    # Dossier container with tabs
│   │   ├── ProgramFormModal.tsx     # Add/edit program modal
│   │   ├── SpreadsheetView.tsx      # Table spreadsheet view
│   │   └── TopNav.tsx               # Responsive header navigation
│   ├── data/
│   │   └── initialDemoRecords.ts    # Seed demo records (Nordic AI & Direct PhD)
│   ├── hooks/
│   │   └── useFilteredPrograms.ts   # Memoized search & filter hook
│   ├── lib/
│   │   ├── storage.ts               # Relational store (Supabase + localStorage fallback)
│   │   └── supabase.ts              # Supabase client singleton & session manager
│   ├── types/
│   │   └── index.ts                 # TypeScript interfaces & domain enums
│   ├── utils/
│   │   └── regions.ts               # Geographic classification & country taxonomy
│   ├── App.tsx                      # Root application component
│   └── index.css                    # Design system tokens & Tailwind v4 setup
├── supabase/
│   └── schema.sql                   # Complete PostgreSQL DDL, RLS, & seed data
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## Getting Started

### 1. Prerequisites
- **Node.js** (v18.0 or newer)
- **npm** (v9.0 or newer)

### 2. Installation
Clone the repository and install dependencies:
```bash
git clone <repo-url>
cd gradsearch-ee·ce·ai
npm install
```

### 3. Environment Configuration
Create a `.env.local` or `.env` file in the root directory:
```env
# Supabase Configuration
VITE_SUPABASE_URL="https://<your-project-id>.supabase.co"
VITE_SUPABASE_ANON_KEY="<your-anon-key>"
```

*(Local development without Supabase uses persistent browser storage with the demo records. Production requires Supabase credentials.)*

### 4. Running the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Supabase Database Setup

To connect a Supabase project:

1. Create your initial account in **Authentication → Users** and disable public sign-ups for this private team app.
2. Open **SQL Editor** and create six saved queries using the numbered files in [`supabase/sql-editor/`](supabase/sql-editor/).
3. Copy each file into its own query and run them in order, **01 through 06**, waiting for each query to succeed. See the [SQL Editor guide](supabase/README.md) for the exact files and account-approval instructions.
4. Set the Supabase environment variables before building/deploying the app.

The examples are inserted once. Deployments and schema reruns preserve edits, and deleted demos stay deleted. **Restore Demo Records** explicitly restores missing examples without replacing existing records.

[`supabase/schema.sql`](supabase/schema.sql) remains a combined alternative; running both versions is unnecessary.

---

## Available Scripts

Program URLs use browser history. The included `vercel.json` and `public/_redirects` provide the `/programs/*` and `/directory` fallbacks for Vercel and Netlify. On another host, serve `index.html` for those paths so opening or refreshing a shared link works. Keep Supabase environment variables configured at build time; deep links use the same sign-in and team access checks as the catalog.

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the local Vite development server on port 3000 |
| `npm test` | Executes the Vitest test suite |
| `npm run test:watch` | Runs tests in interactive watch mode |
| `npm run lint` | Performs strict TypeScript type-checking (`tsc --noEmit`) |
| `npm run build` | Compiles a production-optimized build into `dist/` |
| `npm run preview` | Previews the compiled production build locally |

---

## License

Private repository — all rights reserved.
