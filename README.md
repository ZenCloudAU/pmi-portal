# PMI Portal

> **AI-powered Project & Program Management Portal**  
> PMBoK 7th Edition · Standard for Program Management 4th Ed. · PMP · PgMP  
> Built by ZenCloud Consulting

---

## What It Is

Walk in on Day 1 of any engagement — project, program, or portfolio component, any scale from $10K to $500M+ — describe the mandate, and receive an immediately actionable, PMI-certified playbook: what to do, in what order, grounded in which PMI standard.

The portal does not guess. It applies PMBoK 7th Edition performance domains, process groups, and the Standard for Program Management 4th Ed. directly to the mandate as given.

---

## Screens

```
Intake → Analyzing → Briefing Room → Workspace
```

| Screen | Purpose |
|--------|---------|
| **Intake** | Capture the mandate: client, type, budget scale, duration, sector, free-text mandate |
| **Analyzing** | Claude API processes the mandate against the full PMI framework |
| **Briefing Room** | PMI-certified analysis: classification, complexity, lifecycle, Day 1 action plan, all 8 performance domains, required documents, governance, stakeholder map, risk categories, tailoring guidance |
| **Workspace** | 8 working views — Briefing, Charter, Schedule, Stakeholders, Risk Register, Cost & Budget, Meetings, Deliverables — all seeded from the analysis |

---

## PMI Framework Coverage

| Standard | Coverage |
|---|---|
| PMBoK 7th Ed. | All 12 Principles · All 8 Performance Domains |
| Standard for Program Management 4th Ed. | Benefits Realisation · Governance · Component Oversight |
| PMI Practice Guides | Risk · Agile · Scheduling · Benefits Realisation referenced in tailoring |
| PMI Code of Ethics | Professional conduct applied throughout |

---

## Workspace Views

| View | PMI Alignment |
|---|---|
| Briefing | Classification · Lifecycle · Tailoring guidance |
| Charter | Initiating Process Group · Project/Program Charter |
| Schedule | Planning Performance Domain · Gantt scaffold · Milestone tracker |
| Stakeholders | Stakeholder Performance Domain · Power/Interest matrix · Register |
| Risk Register | Uncertainty Performance Domain · Risk register with P×I scoring |
| Cost & Budget | Planning Knowledge Area · Budget framework · EVM guidance · Invoice schedule |
| Meetings | Communications Performance Domain · Cadence · Comms matrix |
| Deliverables | Delivery Performance Domain · Document register with priority and status |

---

## Project Files

Each engagement persists as a typed JSON file in `/projects/`:

```
projects/
  VOL-2026-001.json    ← Volvo demo seed
  <engagement-id>.json ← Future engagements
```

Schema defined in `src/types/index.ts` → `ProjectFile`.

---

## Repo Structure

```
pmi-portal/
├── src/
│   ├── App.tsx                  ← Screen router
│   ├── main.tsx
│   ├── index.css
│   ├── components/
│   │   └── ui.tsx               ← Badge, Card, SectionHead, FieldInput, FieldSelect
│   ├── views/
│   │   ├── IntakeScreen.tsx
│   │   ├── AnalyzingScreen.tsx
│   │   ├── BriefingRoom.tsx
│   │   └── Workspace.tsx        ← 8-view workspace shell + all sub-views
│   ├── hooks/
│   │   └── useMandate.ts        ← Claude API service
│   ├── types/
│   │   └── index.ts             ← All TypeScript types
│   ├── data/
│   │   ├── constants.ts         ← PMI prompt, lookup maps, domain lists
│   │   └── demos.ts             ← Seeded demo mandates
│   └── utils/                   ← Helpers (date, ID generation, export)
├── projects/                    ← Per-engagement JSON files
├── docs/
│   └── ADR-001-tech-stack.md
├── .github/
│   ├── workflows/ci.yml
│   └── ISSUE_TEMPLATE/
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- Anthropic API key ([console.anthropic.com](https://console.anthropic.com/))

### Install

```bash
git clone https://github.com/ZenCloudAU/pmi-portal.git
cd pmi-portal
npm install
```

### Configure

```bash
cp .env.example .env
# Add your Anthropic API key to .env
```

### Run

```bash
npm run dev
# → http://localhost:5173
```

### Build

```bash
npm run build
# Output: dist/
```

---

## Roadmap

### v0.1 — Current (Artifact / Scaffold)
- [x] 4-screen flow: Intake → Analyzing → Briefing Room → Workspace
- [x] Claude API mandate analysis (PMBoK 7th + Standard for PgM 4th)
- [x] 8 workspace views (Charter, Schedule, Stakeholders, Risk, Budget, Meetings, Deliverables)
- [x] TypeScript types and repo scaffold
- [x] Demo seed: Volvo VOL-2026-001

### v0.2 — View Migration
- [ ] Migrate all view JSX from artifact into typed `.tsx` modules
- [ ] Wire `VITE_ANTHROPIC_API_KEY` from environment
- [ ] Export/import `ProjectFile` as JSON
- [ ] Load existing project from `/projects/*.json` on intake screen

### v0.3 — Document Generation
- [ ] Export Project Charter as DOCX
- [ ] Export Risk Register as XLSX
- [ ] Weekly Status Report PDF template
- [ ] Lessons Learned register export

### v0.4 — Schedule Integration
- [ ] MS Project XML export from schedule view
- [ ] Gantt editor (editable tasks, owners, dates)
- [ ] Milestone date picker

### v0.5 — Valor Integration
- [ ] Wire to VAF Agentic Architect v2 (velocity-architecture repo)
- [ ] Mandate → VAF context handoff
- [ ] Shared project schema

### v1.0 — Multi-Engagement
- [ ] Project list / portfolio dashboard
- [ ] Multi-tenancy (client-scoped workspaces)
- [ ] Backend persistence (Supabase or Azure Cosmos)

---

## Connection to VAF / ZenCloud Stack

This repo is standalone but designed to integrate with the ZenCloud Velocity Architecture Framework:

```
velocity-architecture/       ← VAF Agentic Architect v2 (Azure, TypeScript, claude-sonnet)
pmi-portal/                  ← This repo — PM governance layer
```

Integration point: `ProjectFile` JSON schema acts as the handoff contract between PM governance and VAF technical execution.

---

## Contributing

Issues use PMI-aligned templates (see `.github/ISSUE_TEMPLATE/`). All features must cite a PMI standard, practice guide, or principle as the basis for inclusion.

---

## License

Private — ZenCloud Consulting. Not for redistribution.
