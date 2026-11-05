# Graph Report - Catering-operations-manager  (2026-11-05)

## Corpus Check
- 91 files · ~24,216 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 420 nodes · 904 edges · 28 communities (18 shown, 10 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `86d8702c`
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

## God Nodes (most connected - your core abstractions)
1. `cn()` - 104 edges
2. `getSession()` - 20 edges
3. `Button()` - 18 edges
4. `compilerOptions` - 16 edges
5. `cutomersTable` - 15 edges
6. `db` - 12 edges
7. `Field()` - 10 edges
8. `getAuditUser()` - 10 edges
9. `logAction()` - 10 edges
10. `buttonVariants` - 9 edges

## Surprising Connections (you probably didn't know these)
- `RootLayout()` --calls--> `getSession()`  [EXTRACTED]
  app/layout.tsx → lib/roles.ts
- `AlertDialogOverlay()` --calls--> `cn()`  [EXTRACTED]
  components/ui/alert-dialog.tsx → lib/utils.ts
- `CalendarDayButton()` --calls--> `cn()`  [EXTRACTED]
  components/ui/calendar.tsx → lib/utils.ts
- `DropdownMenuCheckboxItem()` --calls--> `cn()`  [EXTRACTED]
  components/ui/dropdown-menu.tsx → lib/utils.ts
- `DropdownMenuRadioItem()` --calls--> `cn()`  [EXTRACTED]
  components/ui/dropdown-menu.tsx → lib/utils.ts

## Import Cycles
- None detected.

## Communities (28 total, 10 thin omitted)

### Community 0 - "Audit Logs and UI Primitives"
Cohesion: 0.18
Nodes (13): actionLabels, actionStyles, LogEntry, formateARDate(), Badge(), badgeVariants, Empty(), EmptyContent() (+5 more)

### Community 1 - "Server Actions and Audit Log"
Cohesion: 0.11
Nodes (30): addCustomer(), deleteCustomer(), addCount(), deleteCount(), updateCount(), rejectDeleteRequest(), updateCustomer(), updateValue (+22 more)

### Community 2 - "Flight and Report Forms"
Cohesion: 0.06
Nodes (40): groupByPeriod(), periodLabel(), periodStart(), reportAction(), ReportRow, AddFormValues, COUNT_FIELDS, CountField (+32 more)

### Community 3 - "Company and Flight Edit Forms"
Cohesion: 0.07
Nodes (40): ar_field_name, EditFieldName, FIELD_NAMES, formSchema, cn(), AccordionContent(), AccordionItem(), AccordionTrigger() (+32 more)

### Community 4 - "Data Tables and Dialogs"
Cohesion: 0.13
Nodes (26): navList, formatNumber(), ReportTable(), Paragraph(), AlertDialog(), AlertDialogAction(), AlertDialogCancel(), AlertDialogContent() (+18 more)

### Community 5 - "Layout, Navbar and Menus"
Cohesion: 0.32
Nodes (5): fontSans, metadata, RootLayout(), Toaster(), ThemeProvider()

### Community 6 - "Runtime Dependencies"
Cohesion: 0.05
Nodes (37): dependencies, class-variance-authority, @clerk/nextjs, clsx, date-fns, dotenv, drizzle-orm, drizzle-query-logger (+29 more)

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
Cohesion: 0.14
Nodes (12): DropdownMenu(), DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuItem(), DropdownMenuLabel(), DropdownMenuRadioItem(), DropdownMenuSeparator(), DropdownMenuShortcut() (+4 more)

### Community 27 - "Community 27"
Cohesion: 0.17
Nodes (12): Home(), flightCountNumber, formSchema, formTextSchema, mealCountNumber, updateFormSchema, updateFormTextSchema, currentMonthRange() (+4 more)

## Knowledge Gaps
- **137 isolated node(s):** `updateValue`, `ReportRow`, `fontSans`, `metadata`, `$schema` (+132 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `Company and Flight Edit Forms` to `Audit Logs and UI Primitives`, `Server Actions and Audit Log`, `Flight and Report Forms`, `Data Tables and Dialogs`, `Community 26`?**
  _High betweenness centrality (0.164) - this node is a cross-community bridge._
- **Why does `drizzle-seed` connect `Runtime Dependencies` to `Server Actions and Audit Log`?**
  _High betweenness centrality (0.154) - this node is a cross-community bridge._
- **What connects `updateValue`, `ReportRow`, `fontSans` to the rest of the system?**
  _138 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Server Actions and Audit Log` be split into smaller, more focused modules?**
  _Cohesion score 0.11137254901960784 - nodes in this community are weakly interconnected._
- **Should `Flight and Report Forms` be split into smaller, more focused modules?**
  _Cohesion score 0.060496067755595885 - nodes in this community are weakly interconnected._
- **Should `Company and Flight Edit Forms` be split into smaller, more focused modules?**
  _Cohesion score 0.07486338797814207 - nodes in this community are weakly interconnected._
- **Should `Data Tables and Dialogs` be split into smaller, more focused modules?**
  _Cohesion score 0.13090418353576247 - nodes in this community are weakly interconnected._