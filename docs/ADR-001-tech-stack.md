# ADR-001 — Technology Stack

**Date:** 2026-06-02  
**Status:** Accepted  
**Author:** ZenCloud Consulting

---

## Context

PMI Portal requires a web-based frontend that can:
- Run locally without a dedicated backend
- Call the Anthropic Claude API directly from the browser
- Persist project files to `/projects/*.json` for multi-engagement support
- Be extended incrementally by a solo or small team
- Deploy to any static host (GitHub Pages, Vercel, Azure Static Web Apps)

## Decision

| Layer | Choice | Rationale |
|---|---|---|
| Framework | React 18 + TypeScript | Type safety critical for PMI schema; React ecosystem for component reuse |
| Build tool | Vite 5 | Fast HMR; native ESM; compatible with Node 20 |
| Styling | Tailwind CSS 3 | Utility-first; no runtime; consistent with ZenCloud VAF pattern |
| Charts | Recharts | Declarative; composable; sufficient for PM dashboards |
| Icons | Lucide React | Consistent; tree-shakeable |
| AI | Anthropic Claude API (claude-sonnet-4) | PMI analysis accuracy; structured JSON output |
| CI | GitHub Actions | Native to repo host; no external tooling required |

## Consequences

- No backend required for v1 — all state in-browser or in `/projects/*.json`
- API key handled via `.env` locally; `ANTHROPIC_API_KEY` GitHub secret for CI
- File persistence (export/import of `ProjectFile`) is a v2 concern
- Multi-user collaboration is a v3 concern (requires backend or Supabase)
