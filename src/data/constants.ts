import type { BudgetScale, DurationBand } from '@/types'

// ─── Display Maps ──────────────────────────────────────────────────────────────

export const BUDGET_MAP: Record<BudgetScale, string> = {
  '':          '— Select —',
  under100k:   '< $100K',
  '100k_1m':   '$100K – $1M',
  '1m_10m':    '$1M – $10M',
  '10m_100m':  '$10M – $100M',
  '100mplus':  '$100M+',
}

export const DURATION_MAP: Record<DurationBand, string> = {
  '':            '— Select —',
  under1month:   '< 1 Month',
  '1_6months':   '1–6 Months',
  '6_12months':  '6–12 Months',
  '1_3years':    '1–3 Years',
  '3yrsplus':    '3+ Years',
}

// ─── Standards-Informed Performance Domains ───────────────────────────────────

export const PERFORMANCE_DOMAINS = [
  'Stakeholders',
  'Team',
  'Development Approach & Life Cycle',
  'Planning',
  'Project Work',
  'Delivery',
  'Measurement',
  'Uncertainty',
] as const

// ─── Standards-Informed Delivery Principles ───────────────────────────────────

export const PMI_PRINCIPLES = [
  'Be a diligent, respectful, and caring steward',
  'Create a collaborative project team environment',
  'Effectively engage with stakeholders',
  'Focus on value',
  'Recognise, evaluate, and respond to system interactions',
  'Demonstrate leadership behaviours',
  'Tailor based on context',
  'Build quality into processes and deliverables',
  'Navigate complexity',
  'Optimise risk responses',
  'Embrace adaptability and resiliency',
  'Enable change to achieve the envisioned future state',
] as const

// ─── Process Groups ────────────────────────────────────────────────────────────

export const PROCESS_GROUPS = ['Initiating', 'Planning', 'Executing', 'M&C', 'Closing'] as const

export const PROCESS_GROUP_COLORS: Record<string, string> = {
  Initiating: '#E8A020',
  Planning:   '#3B82F6',
  Executing:  '#10B981',
  'M&C':      '#8B5CF6',
  Closing:    '#EF4444',
}

// ─── Action Timing Sort Order ──────────────────────────────────────────────────

export const TIMING_ORDER = ['Day 1', 'Day 2', 'Days 3-5', 'Week 1', 'Week 2'] as const

// ─── Risk Colours ──────────────────────────────────────────────────────────────

export const RISK_COLORS: Record<string, string> = {
  Critical: '#EF4444',
  High:     '#F97316',
  Medium:   '#EAB308',
  Low:      '#22C55E',
}

// ─── Delivery Mobilisation Prompt (system message for Claude API) ─────────────

export const PMI_SYSTEM_PROMPT = `You are a senior delivery mobilisation and governance advisor using PMBOK 7, The Standard for Program Management, risk, benefits, scheduling, governance, and professional ethics as supporting standards.

Analyze the engagement mandate provided and return ONLY a raw JSON object. No markdown, no backticks, no preamble. Raw JSON only.

Required schema:
{
  "classification": "Project" | "Program" | "Portfolio Component",
  "complexityLevel": "Simple" | "Moderate" | "Complex" | "Highly Complex",
  "lifecycle": "Predictive" | "Adaptive" | "Hybrid",
  "summary": "2-3 sentence strategic assessment of what this engagement requires to move from mandate to governed delivery execution",
  "performanceDomains": [
    {"domain": "string (all 8 must appear)", "priority": "High" | "Medium" | "Low"}
  ],
  "immediateActions": [
    {"timing": "Day 1" | "Day 2" | "Days 3-5" | "Week 1" | "Week 2", "action": "specific actionable task", "priority": "Critical" | "High" | "Medium", "basis": "standards-informed governance basis"}
  ],
  "requiredDocuments": [
    {"document": "document name", "due": "Day X or Week X", "priority": "Critical" | "High" | "Medium"}
  ],
  "governance": {
    "model": "governance model name",
    "decisionAuthority": "who decides what",
    "reporting": "reporting cadence description",
    "changeControl": "change control approach"
  },
  "riskCategories": ["category1", "category2"],
  "stakeholderGroups": [
    {"group": "group name", "strategy": "Manage Closely" | "Keep Satisfied" | "Keep Informed" | "Monitor"}
  ],
  "tailoring": "specific governance and delivery tailoring guidance for this context",
  "programNotes": "programme governance guidance if Program classification, otherwise null",
  "principles": ["relevant standards-informed delivery principle"]
}

Rules:
- All 8 standards-informed performance domains must appear (Stakeholders, Team, Development Approach & Life Cycle, Planning, Project Work, Delivery, Measurement, Uncertainty).
- Minimum 10 immediateActions spanning Day 1 through Week 2.
- Minimum 10 requiredDocuments with realistic due dates.
- Minimum 6 riskCategories seeded from the mandate context.
- Be specific and actionable for a delivery leader mobilising a project, programme, or transformation initiative.
- If the engagement is classified as a Program, programNotes must contain substantive guidance on benefits realisation, governance, and component oversight.`
