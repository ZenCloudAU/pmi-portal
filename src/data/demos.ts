import type { MandateInput } from '@/types'

export const VOLVO_DEMO: MandateInput = {
  engagementName: 'Tri-Dealership Infrastructure Migration',
  client:         'Volvo Car Corporation AU',
  type:           'Project',
  budget:         'under100k',
  duration:       'under1month',
  sector:         'private',
  location:       'Wacol, QLD',
  startType:      'Immediate',
  mandate: `Client: Volvo Car Corporation AU. Location: Wacol, QLD — 5 days per week on-site. Immediate start required. Contract: 1 month. Rate: $1,000/day inc super.

Volvo has recently acquired 3 automotive dealerships across South-East Queensland. Each dealership runs independent legacy IT infrastructure (network, servers, endpoints) with no standardisation. The client requires a Project Manager to govern the full IT infrastructure migration across all 3 sites to align with Volvo corporate standards.

Key constraints: compressed 1-month timeline, no acceptable permanent data loss, agreed downtime windows per dealership, coordination of third-party network vendor and internal IT team, legacy system compatibility unknown.

Key concerns raised by IT Director: data integrity during migration, dealership operational continuity, and vendor delivery risk.`,
  additionalContext:
    'PM must produce weekly status reports for IT Director sponsor. Scope creep is a known risk — change control is essential. Full closure documentation required including lessons learned and handover package.',
}

// ─── Placeholder for additional demo seeds ────────────────────────────────────
// Add more demos here as the suite expands, e.g.:
//   export const ERP_PROGRAM_DEMO: MandateInput = { ... }
//   export const GOVERNMENT_TRANSFORMATION_DEMO: MandateInput = { ... }
