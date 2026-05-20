// ─── PMI Framework Types ───────────────────────────────────────────────────────

export type Classification = 'Project' | 'Program' | 'Portfolio Component'
export type ComplexityLevel = 'Simple' | 'Moderate' | 'Complex' | 'Highly Complex'
export type Lifecycle = 'Predictive' | 'Adaptive' | 'Hybrid'
export type Priority = 'Critical' | 'High' | 'Medium' | 'Low'
export type ActionTiming = 'Day 1' | 'Day 2' | 'Days 3-5' | 'Week 1' | 'Week 2'
export type DomainPriority = 'High' | 'Medium' | 'Low'
export type StakeholderStrategy = 'Manage Closely' | 'Keep Satisfied' | 'Keep Informed' | 'Monitor'
export type EngagementStatus = 'Not Started' | 'In Progress' | 'In Review' | 'Complete'
export type RiskScore = 'Critical' | 'High' | 'Medium' | 'Low'
export type RiskProbability = 'High' | 'Medium' | 'Low'
export type RiskImpact = 'High' | 'Medium' | 'Low'
export type RiskResponse = 'Mitigate' | 'Avoid' | 'Transfer' | 'Accept' | 'Escalate'

// ─── Mandate Input ─────────────────────────────────────────────────────────────

export type BudgetScale =
  | '' | 'under100k' | '100k_1m' | '1m_10m' | '10m_100m' | '100mplus'

export type DurationBand =
  | '' | 'under1month' | '1_6months' | '6_12months' | '1_3years' | '3yrsplus'

export type Sector =
  | '' | 'government' | 'private' | 'nfp' | 'mixed'
  | 'defence' | 'health' | 'finance' | 'energy'

export interface MandateInput {
  engagementName:    string
  client:            string
  type:              'Project' | 'Program' | 'Portfolio'
  budget:            BudgetScale
  duration:          DurationBand
  sector:            Sector
  location:          string
  startType:         'Immediate' | 'Planned' | 'TBD'
  mandate:           string
  additionalContext: string
}

// ─── AI Analysis Output ────────────────────────────────────────────────────────

export interface PerformanceDomain {
  domain:   string
  priority: DomainPriority
}

export interface ImmediateAction {
  timing:   ActionTiming
  action:   string
  priority: Priority
  basis:    string
}

export interface RequiredDocument {
  document: string
  due:      string
  priority: Priority
}

export interface GovernanceFramework {
  model:             string
  decisionAuthority: string
  reporting:         string
  changeControl:     string
}

export interface StakeholderGroup {
  group:    string
  strategy: StakeholderStrategy
}

export interface MandateAnalysis {
  classification:     Classification
  complexityLevel:    ComplexityLevel
  lifecycle:          Lifecycle
  summary:            string
  performanceDomains: PerformanceDomain[]
  immediateActions:   ImmediateAction[]
  requiredDocuments:  RequiredDocument[]
  governance:         GovernanceFramework
  riskCategories:     string[]
  stakeholderGroups:  StakeholderGroup[]
  tailoring:          string
  programNotes:       string | null
  principles:         string[]
}

// ─── Workspace Domain Types ────────────────────────────────────────────────────

export interface StakeholderRow {
  id:         number
  name:       string
  group:      string
  strategy:   StakeholderStrategy
  influence:  string
  interest:   string
  engagement: string
  notes:      string
}

export interface RiskRow {
  id:          number
  category:    string
  description: string
  probability: RiskProbability | ''
  impact:      RiskImpact | ''
  score:       RiskScore | ''
  response:    RiskResponse | ''
  mitigation:  string
  owner:       string
  status:      'Open' | 'In Progress' | 'Closed'
}

export interface DeliverableRow {
  id:       number
  name:     string
  due:      string
  priority: Priority
  owner:    string
  status:   EngagementStatus
}

// ─── Project File (persisted to /projects/*.json) ──────────────────────────────

export interface ProjectFile {
  id:           string           // e.g. "VOL-2026-001"
  createdAt:    string           // ISO 8601
  updatedAt:    string           // ISO 8601
  mandate:      MandateInput
  analysis:     MandateAnalysis
  stakeholders: StakeholderRow[]
  risks:        RiskRow[]
  deliverables: DeliverableRow[]
  charterFields: Record<string, string>
  notes:        string
}

// ─── App State ─────────────────────────────────────────────────────────────────

export type AppScreen = 'intake' | 'analyzing' | 'briefing' | 'workspace'
