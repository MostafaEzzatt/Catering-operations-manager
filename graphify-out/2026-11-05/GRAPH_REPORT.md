# Graph Report - Catering-operations-manager  (2026-11-05)

## Corpus Check
- 89 files · ~22,692 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 399 nodes · 849 edges · 29 communities (19 shown, 10 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `6b395d2b`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Audit Logs and UI Primitives|Audit Logs and UI Primitives]]
- [[_COMMUNITY_Server Actions and Audit Log|Server Actions and Audit Log]]
- [[_COMMUNITY_Flight and Report Forms|Flight and Report Forms]]
- [[_COMMUNITY_Company and Flight Edit Forms|Company and Flight Edit Forms]]
- [[_COMMUNITY_Data Tables and Dialogs|Data Tables and Dialogs]]
- [[_COMMUNITY_Layout, Navbar and Menus|Layout, Navbar and Menus]]
- [[_COMMUNITY_Runtime Dependencies|Runtime Dependencies]]
- [[_COMMUNITY_Dev Dependencies and Tooling|Dev Dependencies and Tooling]]
- [[_COMMUNITY_shadcn Config|shadcn Config]]
- [[_COMMUNITY_TypeScript Config|TypeScript Config]]
- [[_COMMUNITY_Next.js Docs and Agent Notes|Next.js Docs and Agent Notes]]
- [[_COMMUNITY_Shared Form and Report Types|Shared Form and Report Types]]
- [[_COMMUNITY_Inline Note and Lead|Inline Note and Lead]]
- [[_COMMUNITY_ESLint Config|ESLint Config]]
- [[_COMMUNITY_Next Config|Next Config]]
- [[_COMMUNITY_PostCSS Config|PostCSS Config]]
- [[_COMMUNITY_Clerk Proxy|Clerk Proxy]]
- [[_COMMUNITY_File Icon|File Icon]]
- [[_COMMUNITY_Globe Icon|Globe Icon]]
- [[_COMMUNITY_Next.js Logo|Next.js Logo]]
- [[_COMMUNITY_Vercel Logo|Vercel Logo]]
- [[_COMMUNITY_Window Icon|Window Icon]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]

## God Nodes (most connected - your core abstractions)
1. `cn()` - 104 edges
2. `getSession()` - 20 edges
3. `Button()` - 17 edges
4. `compilerOptions` - 16 edges
5. `cutomersTable` - 15 edges
6. `db` - 12 edges
7. `logAction()` - 10 edges
8. `buttonVariants` - 9 edges
9. `Field()` - 9 edges
10. `customerFlightCountTable` - 9 edges

## Surprising Connections (you probably didn't know these)
- `RootLayout()` --calls--> `getSession()`  [EXTRACTED]
  app/layout.tsx → lib/roles.ts
- `CalendarDayButton()` --calls--> `cn()`  [EXTRACTED]
  components/ui/calendar.tsx → lib/utils.ts
- `DialogOverlay()` --calls--> `cn()`  [EXTRACTED]
  components/ui/dialog.tsx → lib/utils.ts
- `DialogFooter()` --calls--> `cn()`  [EXTRACTED]
  components/ui/dialog.tsx → lib/utils.ts
- `DropdownMenuCheckboxItem()` --calls--> `cn()`  [EXTRACTED]
  components/ui/dropdown-menu.tsx → lib/utils.ts

## Import Cycles
- None detected.

## Communities (29 total, 10 thin omitted)

### Community 0 - "Audit Logs and UI Primitives"
Cohesion: 0.09
Nodes (18): fontSans, metadata, RootLayout(), navList, DropdownMenu(), DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuItem() (+10 more)

### Community 1 - "Server Actions and Audit Log"
Cohesion: 0.11
Nodes (27): addCustomer(), deleteCustomer(), addCount(), deleteCount(), updateCount(), rejectDeleteRequest(), updateCustomer(), updateValue (+19 more)

### Community 2 - "Flight and Report Forms"
Cohesion: 0.08
Nodes (39): ar_field_name, COMPANY_TYPE_OPTIONS, CompanyType, FieldErrors, normalizeArabic(), PERIOD_OPTIONS, ReportField, Reportform() (+31 more)

### Community 3 - "Company and Flight Edit Forms"
Cohesion: 0.14
Nodes (13): ar_field_name, EditFieldName, FIELD_NAMES, formSchema, updateFormSchema, Dialog(), DialogContent(), DialogDescription() (+5 more)

### Community 4 - "Data Tables and Dialogs"
Cohesion: 0.08
Nodes (44): formatNumber(), ReportTable(), Paragraph(), cn(), AccordionContent(), AccordionItem(), AccordionTrigger(), AlertDialog() (+36 more)

### Community 5 - "Layout, Navbar and Menus"
Cohesion: 0.18
Nodes (12): actionLabels, actionStyles, LogEntry, formateARDate(), Empty(), EmptyContent(), EmptyDescription(), EmptyHeader() (+4 more)

### Community 6 - "Runtime Dependencies"
Cohesion: 0.07
Nodes (27): dependencies, class-variance-authority, @clerk/nextjs, clsx, date-fns, dotenv, drizzle-orm, drizzle-query-logger (+19 more)

### Community 7 - "Dev Dependencies and Tooling"
Cohesion: 0.15
Nodes (13): devDependencies, drizzle-kit, eslint, eslint-config-next, shadcn, tailwindcss, @tailwindcss/postcss, tsx (+5 more)

### Community 8 - "shadcn Config"
Cohesion: 0.10
Nodes (19): aliases, components, hooks, lib, ui, utils, iconLibrary, registries (+11 more)

### Community 9 - "TypeScript Config"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 10 - "Next.js Docs and Agent Notes"
Cohesion: 0.11
Nodes (18): App Router docs (01-app), Cache Components and use cache directives, Search Next.js docs before any task (training knowledge is wrong for this version), Next.js docs index (.next-docs), Pages Router docs (02-pages), proxy file convention (Next.js 16), "pgh" means push everything to GitHub, Project notes (+10 more)

### Community 11 - "Shared Form and Report Types"
Cohesion: 0.15
Nodes (14): CompanyFormValues, CustomerFlightCountFormValues, formValueType, logCompanyDetails, logFlightDetails, logStoredMetadata, logTableMetaDataType, reportForm (+6 more)

### Community 26 - "Community 26"
Cohesion: 0.19
Nodes (9): groupByPeriod(), periodLabel(), periodStart(), reportAction(), ReportRow, actionSchema, formSchema, REPORT_PERIODS (+1 more)

### Community 27 - "Community 27"
Cohesion: 0.33
Nodes (6): scripts, build, db:seed, dev, lint, start

### Community 28 - "Community 28"
Cohesion: 0.50
Nodes (3): name, private, version

## Knowledge Gaps
- **130 isolated node(s):** `updateValue`, `ReportRow`, `fontSans`, `metadata`, `$schema` (+125 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `Data Tables and Dialogs` to `Audit Logs and UI Primitives`, `Server Actions and Audit Log`, `Flight and Report Forms`, `Company and Flight Edit Forms`, `Layout, Navbar and Menus`?**
  _High betweenness centrality (0.169) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Runtime Dependencies` to `Server Actions and Audit Log`, `Community 28`?**
  _High betweenness centrality (0.166) - this node is a cross-community bridge._
- **Why does `drizzle-seed` connect `Server Actions and Audit Log` to `Runtime Dependencies`?**
  _High betweenness centrality (0.157) - this node is a cross-community bridge._
- **What connects `updateValue`, `ReportRow`, `fontSans` to the rest of the system?**
  _131 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Audit Logs and UI Primitives` be split into smaller, more focused modules?**
  _Cohesion score 0.08620689655172414 - nodes in this community are weakly interconnected._
- **Should `Server Actions and Audit Log` be split into smaller, more focused modules?**
  _Cohesion score 0.11139455782312925 - nodes in this community are weakly interconnected._
- **Should `Flight and Report Forms` be split into smaller, more focused modules?**
  _Cohesion score 0.08196721311475409 - nodes in this community are weakly interconnected._