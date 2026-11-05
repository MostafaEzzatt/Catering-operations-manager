# Graph Report - Catering-operations-manager  (2026-11-05)

## Corpus Check
- 89 files · ~21,495 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 386 nodes · 816 edges · 26 communities (16 shown, 10 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `fffb8e72`
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

## God Nodes (most connected - your core abstractions)
1. `cn()` - 104 edges
2. `getSession()` - 20 edges
3. `Button()` - 17 edges
4. `compilerOptions` - 16 edges
5. `cutomersTable` - 14 edges
6. `db` - 12 edges
7. `logAction()` - 10 edges
8. `buttonVariants` - 9 edges
9. `Field()` - 9 edges
10. `customerFlightCountTable` - 8 edges

## Surprising Connections (you probably didn't know these)
- `RootLayout()` --calls--> `getSession()`  [EXTRACTED]
  app/layout.tsx → lib/roles.ts
- `CalendarDayButton()` --calls--> `cn()`  [EXTRACTED]
  components/ui/calendar.tsx → lib/utils.ts
- `DropdownMenuCheckboxItem()` --calls--> `cn()`  [EXTRACTED]
  components/ui/dropdown-menu.tsx → lib/utils.ts
- `DropdownMenuRadioItem()` --calls--> `cn()`  [EXTRACTED]
  components/ui/dropdown-menu.tsx → lib/utils.ts
- `DropdownMenuLabel()` --calls--> `cn()`  [EXTRACTED]
  components/ui/dropdown-menu.tsx → lib/utils.ts

## Import Cycles
- None detected.

## Communities (26 total, 10 thin omitted)

### Community 0 - "Audit Logs and UI Primitives"
Cohesion: 0.07
Nodes (41): actionLabels, actionStyles, LogEntry, cn(), formateARDate(), AccordionContent(), AccordionItem(), AccordionTrigger() (+33 more)

### Community 1 - "Server Actions and Audit Log"
Cohesion: 0.12
Nodes (24): addCustomer(), deleteCustomer(), addCount(), deleteCount(), updateCount(), rejectDeleteRequest(), updateCustomer(), updateValue (+16 more)

### Community 2 - "Flight and Report Forms"
Cohesion: 0.07
Nodes (44): ar_field_name, COMPANY_TYPE_OPTIONS, CompanyType, FieldErrors, PERIOD_OPTIONS, ReportField, ar_field_name, EditFieldName (+36 more)

### Community 3 - "Company and Flight Edit Forms"
Cohesion: 0.21
Nodes (8): groupByPeriod(), periodLabel(), reportAction(), ReportRow, actionSchema, formSchema, REPORT_PERIODS, ReportPeriod

### Community 4 - "Data Tables and Dialogs"
Cohesion: 0.19
Nodes (18): Paragraph(), AlertDialog(), AlertDialogAction(), AlertDialogCancel(), AlertDialogContent(), AlertDialogDescription(), AlertDialogFooter(), AlertDialogHeader() (+10 more)

### Community 5 - "Layout, Navbar and Menus"
Cohesion: 0.09
Nodes (18): fontSans, metadata, RootLayout(), navList, DropdownMenu(), DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuItem() (+10 more)

### Community 6 - "Runtime Dependencies"
Cohesion: 0.08
Nodes (26): dependencies, class-variance-authority, @clerk/nextjs, clsx, date-fns, dotenv, drizzle-orm, drizzle-query-logger (+18 more)

### Community 7 - "Dev Dependencies and Tooling"
Cohesion: 0.09
Nodes (22): devDependencies, drizzle-kit, eslint, eslint-config-next, shadcn, tailwindcss, @tailwindcss/postcss, tsx (+14 more)

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
Cohesion: 0.17
Nodes (11): CompanyFormValues, CustomerFlightCountFormValues, formValueType, logCompanyDetails, logFlightDetails, logTableMetaDataType, reportForm, reportResponseType (+3 more)

## Knowledge Gaps
- **127 isolated node(s):** `updateValue`, `ReportRow`, `fontSans`, `metadata`, `$schema` (+122 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `Audit Logs and UI Primitives` to `Server Actions and Audit Log`, `Flight and Report Forms`, `Data Tables and Dialogs`, `Layout, Navbar and Menus`?**
  _High betweenness centrality (0.182) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Runtime Dependencies` to `Server Actions and Audit Log`, `Dev Dependencies and Tooling`?**
  _High betweenness centrality (0.168) - this node is a cross-community bridge._
- **Why does `drizzle-seed` connect `Server Actions and Audit Log` to `Runtime Dependencies`?**
  _High betweenness centrality (0.158) - this node is a cross-community bridge._
- **What connects `updateValue`, `ReportRow`, `fontSans` to the rest of the system?**
  _128 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Audit Logs and UI Primitives` be split into smaller, more focused modules?**
  _Cohesion score 0.06848357791754019 - nodes in this community are weakly interconnected._
- **Should `Server Actions and Audit Log` be split into smaller, more focused modules?**
  _Cohesion score 0.12173913043478261 - nodes in this community are weakly interconnected._
- **Should `Flight and Report Forms` be split into smaller, more focused modules?**
  _Cohesion score 0.06720321931589537 - nodes in this community are weakly interconnected._