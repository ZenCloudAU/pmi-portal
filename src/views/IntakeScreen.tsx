import { useMemo, useState, type Dispatch, type ReactNode, type SetStateAction } from 'react'
import {
  ArrowRight,
  BarChart2,
  BookOpen,
  CheckCircle2,
  FileText,
  GitBranch,
  Layers,
  Lock,
  Menu,
  Package,
  Scale,
  Search,
  Shield,
  Target,
  Users,
  type LucideIcon,
} from 'lucide-react'
import { Badge, Card, FieldInput, FieldSelect } from '@/components/ui'
import type { MandateInput } from '@/types'

interface IntakeProps {
  mandate: MandateInput
  setMandate: Dispatch<SetStateAction<MandateInput>>
  onAnalyze: () => void
  onLoadDemo: () => void
  error: string | null
}

type ActiveModule =
  | 'overview'
  | 'intake'
  | 'architecture-framing'
  | 'scale-assessment'
  | 'artefact-catalogue'
  | 'governance'
  | 'raid-decisions'
  | 'milestones'
  | 'executive-snapshot'
  | 'client-visibility'
  | 'handover-pack'
  | 'security-storage'

type EngagementType =
  | 'Advisory'
  | 'Project'
  | 'Programme'
  | 'Portfolio component'
  | 'Recovery / remediation'
  | 'Architecture review'
  | 'Delivery mobilisation'

type EngagementScale = 'Small project' | 'Medium project' | 'Large programme'
type ClientMaturity = 'Low maturity / no PMO' | 'Some governance' | 'Mature PMO / enterprise tooling exists'
type DeliveryMode = 'Discovery' | 'Build' | 'Recovery' | 'Transformation' | 'Governance setup' | 'Handover'
type ArtefactStatus = 'Required' | 'Draft' | 'In review' | 'Approved' | 'Shared' | 'Locked' | 'Superseded' | 'Not required'
type VisibilityState = 'Internal only' | 'Client visible' | 'Shared with client' | 'Locked record' | 'Archived'
type ArtefactCategory =
  | 'Architecture artefacts'
  | 'Solution architecture artefacts'
  | 'Delivery governance artefacts'
  | 'Execution control artefacts'
  | 'Client reporting artefacts'
  | 'Handover artefacts'

interface Artefact {
  name: string
  category: ArtefactCategory
  purpose: string
  requirement: 'Required' | 'Optional'
  owner: string
  status: ArtefactStatus
  visibility: VisibilityState
  timing: string
  version: string
  clientVisible: boolean
  linkedDecisions: number
  linkedRisks: number
}

interface NavItem {
  id: ActiveModule
  label: string
  icon: LucideIcon
}

const WORKFLOW = 'Architecture → Governance → Mobilisation → Artefacts → Execution → Delivery visibility'
const SHORT_WORKFLOW = 'Intake → Architecture → Scale → Artefacts → Governance → Execution → Handover'
const STORAGE_FLOW = 'Generate → Preview → Review → Export → Store privately → Share authorised artefacts → Lock records'

const NAV_ITEMS: NavItem[] = [
  { id: 'overview', label: 'Overview', icon: Target },
  { id: 'intake', label: 'Intake', icon: FileText },
  { id: 'architecture-framing', label: 'Architecture Framing', icon: BookOpen },
  { id: 'scale-assessment', label: 'Scale Assessment', icon: Scale },
  { id: 'artefact-catalogue', label: 'Artefact Catalogue', icon: Package },
  { id: 'governance', label: 'Governance', icon: Shield },
  { id: 'raid-decisions', label: 'RAID & Decisions', icon: GitBranch },
  { id: 'milestones', label: 'Milestones', icon: Layers },
  { id: 'executive-snapshot', label: 'Executive Snapshot', icon: BarChart2 },
  { id: 'client-visibility', label: 'Client Visibility', icon: Users },
  { id: 'handover-pack', label: 'Handover Pack', icon: CheckCircle2 },
  { id: 'security-storage', label: 'Security & Storage', icon: Lock },
]

const SMALL_ARTEFACTS = [
  'Mandate / Intake Brief',
  'Architecture Intent Brief',
  'Delivery Mobilisation Brief',
  'Scope and Outcomes Summary',
  'Stakeholder Map',
  'Simple Delivery Plan',
  'RAID Log',
  'Decision Log',
  'Action Register',
  'Architecture Notes / Solution Summary',
  'Weekly Status Report',
  'Acceptance / Completion Checklist',
  'Handover Summary',
]

const MEDIUM_ARTEFACTS = [
  'Mandate / Intake Brief',
  'Architecture Intent Brief',
  'Project Charter',
  'Delivery Mobilisation Brief',
  'Business Outcomes and Benefits Summary',
  'Scope Statement',
  'Stakeholder Register',
  'Governance Model',
  'RACI / Decision Rights Matrix',
  'Delivery Plan',
  'Milestone Plan',
  'RAID Log',
  'Decision Log',
  'Dependency Register',
  'Change Control Log',
  'Architecture Decision Records',
  'Solution Architecture Summary',
  'Artefact Register',
  'Communications Plan',
  'Status Report Pack',
  'Steering Committee Pack',
  'Budget Tracking Summary',
  'Test / Acceptance Plan',
  'Transition / Readiness Checklist',
  'Handover Pack',
  'Lessons Learned',
]

const LARGE_ARTEFACTS = [
  'Programme Mandate',
  'Architecture Intent Brief',
  'Programme Charter',
  'Programme Business Case Summary',
  'Vision and Target Outcomes',
  'Benefits Realisation Plan',
  'Programme Roadmap',
  'Workstream Structure',
  'Programme Governance Model',
  'Steering Committee Terms of Reference',
  'Design Authority Terms of Reference',
  'RACI / Decision Authority Matrix',
  'Stakeholder Engagement Plan',
  'Communications Plan',
  'Integrated Master Plan',
  'Milestone Plan',
  'Dependency Register',
  'RAID Log',
  'Decision Log',
  'Change Control Register',
  'Financial Tracking Summary',
  'Resource Plan',
  'Vendor / Partner Management Plan',
  'Architecture Governance Pack',
  'Enterprise Architecture Context',
  'Solution Architecture Pack',
  'Architecture Decision Records',
  'Security / Risk / Compliance Summary',
  'Data / Integration / Platform Impact Summary',
  'Benefits Tracking Dashboard',
  'Executive Status Report',
  'Workstream Status Reports',
  'Exception Report',
  'Readiness Assessment',
  'Transition Plan',
  'Operating Model Impact Summary',
  'Handover Pack',
  'Closure Report',
  'Lessons Learned',
  'Residual Risk Register',
  'Next Phase Recommendations',
]

const STATUS_SEQUENCE: ArtefactStatus[] = ['Required', 'Draft', 'In review', 'Approved', 'Shared', 'Locked']
const VISIBILITY_SEQUENCE: VisibilityState[] = ['Internal only', 'Internal only', 'Client visible', 'Shared with client', 'Shared with client', 'Locked record']

function artefactsForScale(scale: EngagementScale): string[] {
  if (scale === 'Small project') return SMALL_ARTEFACTS
  if (scale === 'Medium project') return MEDIUM_ARTEFACTS
  return LARGE_ARTEFACTS
}

function buildArtefactCatalogue(scale: EngagementScale): Artefact[] {
  return artefactsForScale(scale).map((name, index) => {
    const status = STATUS_SEQUENCE[index % STATUS_SEQUENCE.length]
    return {
      name,
      category: categoryFor(name),
      purpose: purposeFor(name),
      requirement: index < 11 ? 'Required' : 'Optional',
      owner: ownerFor(name),
      status,
      visibility: VISIBILITY_SEQUENCE[index % VISIBILITY_SEQUENCE.length],
      timing: timingFor(index),
      version: `v0.${(index % 4) + 1}`,
      clientVisible: ['Approved', 'Shared', 'Locked'].includes(status),
      linkedDecisions: index % 3,
      linkedRisks: (index + 1) % 4,
    }
  })
}

function categoryFor(name: string): ArtefactCategory {
  if (name.includes('Architecture') || name.includes('Enterprise')) return 'Architecture artefacts'
  if (name.includes('Solution') || name.includes('Design')) return 'Solution architecture artefacts'
  if (name.includes('Governance') || name.includes('Authority') || name.includes('RACI') || name.includes('Change')) return 'Delivery governance artefacts'
  if (name.includes('Status') || name.includes('Report') || name.includes('Steering') || name.includes('Benefits')) return 'Client reporting artefacts'
  if (name.includes('Handover') || name.includes('Transition') || name.includes('Closure') || name.includes('Lessons') || name.includes('Residual')) return 'Handover artefacts'
  return 'Execution control artefacts'
}

function purposeFor(name: string) {
  if (name.includes('Architecture Intent')) return 'Frame business outcomes, capability impact, decisions required, and VAF guardrails.'
  if (name.includes('Architecture') || name.includes('Solution')) return 'Connect execution back to VAF decisions and VAF-SA solution shaping.'
  if (name.includes('Governance') || name.includes('Authority')) return 'Define decision rights, forums, cadence, escalation paths, and control checkpoints.'
  if (name.includes('RAID') || name.includes('Risk')) return 'Track risks, assumptions, issues, dependencies, and transfer points.'
  if (name.includes('Status') || name.includes('Executive')) return 'Provide concise executive visibility across progress, blockers, risks, and decisions.'
  if (name.includes('Handover') || name.includes('Closure')) return 'Create a controlled transition record for client continuation.'
  return 'Provide a controlled delivery artefact for mobilisation, execution, or client transparency.'
}

function ownerFor(name: string) {
  if (name.includes('Architecture') || name.includes('Solution') || name.includes('Design')) return 'Architecture lead'
  if (name.includes('Status') || name.includes('Steering') || name.includes('Executive')) return 'Delivery lead'
  if (name.includes('Risk') || name.includes('RAID') || name.includes('Change')) return 'Governance lead'
  if (name.includes('Handover') || name.includes('Readiness')) return 'Client + StudioSix'
  return 'StudioSix'
}

function timingFor(index: number) {
  if (index < 5) return 'Intake'
  if (index < 12) return 'Mobilisation'
  if (index < 27) return 'Execution'
  return 'Handover'
}

function initialModule(): ActiveModule {
  const hash = window.location.hash.replace('#', '')
  return NAV_ITEMS.some(item => item.id === hash) ? hash as ActiveModule : 'overview'
}

export function IntakeScreen({ mandate, setMandate, onAnalyze: _onAnalyze, onLoadDemo, error }: IntakeProps) {
  const [activeModule, setActiveModule] = useState<ActiveModule>(initialModule)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [engagementType, setEngagementType] = useState<EngagementType>('Programme')
  const [engagementScale, setEngagementScale] = useState<EngagementScale>('Large programme')
  const [clientMaturity, setClientMaturity] = useState<ClientMaturity>('Some governance')
  const [deliveryMode, setDeliveryMode] = useState<DeliveryMode>('Transformation')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [visibilityFilter, setVisibilityFilter] = useState('All')
  const [search, setSearch] = useState('')

  const artefacts = useMemo(() => buildArtefactCatalogue(engagementScale), [engagementScale])
  const filteredArtefacts = useMemo(() => {
    const term = search.trim().toLowerCase()
    return artefacts.filter(item => {
      const categoryMatch = categoryFilter === 'All' || item.category === categoryFilter
      const statusMatch = statusFilter === 'All' || item.status === statusFilter
      const visibilityMatch = visibilityFilter === 'All' || item.visibility === visibilityFilter
      const searchMatch = !term || `${item.name} ${item.category} ${item.owner}`.toLowerCase().includes(term)
      return categoryMatch && statusMatch && visibilityMatch && searchMatch
    })
  }, [artefacts, categoryFilter, statusFilter, search, visibilityFilter])

  const clientVisibleCount = artefacts.filter(a => a.clientVisible).length
  const completeCount = artefacts.filter(a => ['Shared', 'Locked'].includes(a.status)).length
  const completion = Math.round((completeCount / artefacts.length) * 100)
  const activeLabel = NAV_ITEMS.find(item => item.id === activeModule)?.label ?? 'Overview'
  const upd = (k: keyof MandateInput, v: string) => setMandate(p => ({ ...p, [k]: v }))

  const openModule = (module: ActiveModule) => {
    setActiveModule(module)
    setMobileNavOpen(false)
    window.location.hash = module
  }

  const loadDemoWorkspace = () => {
    onLoadDemo()
    setMandate(p => ({
      ...p,
      engagementName: 'ERP Consolidation Programme',
      client: 'Fictional Manufacturing Group',
      type: 'Program',
      budget: '10m_100m',
      duration: '1_3years',
      sector: 'private',
      location: 'Brisbane / remote',
      startType: 'Immediate',
      mandate: 'Consolidate three legacy ERP instances into a governed operating model with clear decision rights, architecture review, delivery controls, migration sequencing, stakeholder visibility, and executive reporting.',
      additionalContext: 'Fictional demo only. Known concerns include data migration risk, workstream dependency control, architecture decision visibility, and transition readiness.',
    }))
    setEngagementType('Programme')
    setEngagementScale('Large programme')
    setClientMaturity('Some governance')
    setDeliveryMode('Transformation')
    setActiveModule('overview')
  }

  const generateWorkspace = () => {
    if (!mandate.mandate.trim()) loadDemoWorkspace()
    setActiveModule('overview')
    window.location.hash = 'overview'
  }

  const moduleContent: Record<ActiveModule, ReactNode> = {
    overview: (
      <ModuleShell eyebrow="Executive overview" title="Summary first. Detail on selection." icon={Target}>
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.2fr_0.8fr]">
          <Card accent className="border-orange-200 bg-orange-50/50 p-5">
            <div className="text-xs font-mono uppercase tracking-widest text-orange-700">Demo workspace output</div>
            <h2 className="mt-2 font-display text-3xl font-black leading-tight text-slate-950">
              {mandate.engagementName || 'ERP Consolidation Programme'}
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-700">
              PMO Portal is the VAF-aligned client engagement workspace for delivery mobilisation,
              architecture framing, controlled artefact lifecycle, governance, execution visibility,
              client transparency, and handover.
            </p>
            <div className="mt-4 rounded border border-slate-200 bg-white px-3 py-2 font-mono text-xs tracking-wider text-slate-600">
              {WORKFLOW}
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <button onClick={() => openModule('intake')} className="rounded bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">
                Open Intake
              </button>
              <button onClick={() => openModule('artefact-catalogue')} className="rounded border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:border-orange-500">
                View Artefact Catalogue
              </button>
            </div>
          </Card>
          <div className="grid grid-cols-2 gap-3">
            <Metric label="Engagement" value={mandate.client || 'Fictional Manufacturing Group'} icon={Users} compact />
            <Metric label="Scale" value={engagementScale} icon={Scale} compact />
            <Metric label="Phase" value="Mobilisation active" icon={Layers} compact />
            <Metric label="Artefacts" value={`${artefacts.length} selected`} icon={Package} compact />
            <Metric label="Client visible" value={String(clientVisibleCount)} icon={Users} compact />
            <Metric label="Completion" value={`${completion}%`} icon={BarChart2} compact />
          </div>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
          <InfoCard title="Next decision" text="Confirm design authority and decision rights across workstreams." />
          <InfoCard title="Top risk" text="Decision latency across workstreams may slow mobilisation and handover readiness." />
          <InfoCard title="Next action" text="Approve the control model and private artefact store before sharing outputs." />
        </div>
      </ModuleShell>
    ),
    intake: (
      <ModuleShell eyebrow="Mandate capture" title="Intake and mobilisation inputs." icon={FileText}>
        <SafetyNote />
        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
          <FieldInput label="Engagement name *" value={mandate.engagementName} onChange={v => upd('engagementName', v)} placeholder="e.g. ERP Consolidation Programme" />
          <FieldInput label="Organisation *" value={mandate.client} onChange={v => upd('client', v)} placeholder="e.g. Fictional Manufacturing Group" />
          <FieldSelect label="Engagement type" value={engagementType} onChange={v => setEngagementType(v as EngagementType)}
            options={['Advisory', 'Project', 'Programme', 'Portfolio component', 'Recovery / remediation', 'Architecture review', 'Delivery mobilisation'].map(v => [v, v])} />
          <FieldSelect label="Engagement scale" value={engagementScale} onChange={v => setEngagementScale(v as EngagementScale)}
            options={['Small project', 'Medium project', 'Large programme'].map(v => [v, v])} />
          <FieldSelect label="Client maturity" value={clientMaturity} onChange={v => setClientMaturity(v as ClientMaturity)}
            options={['Low maturity / no PMO', 'Some governance', 'Mature PMO / enterprise tooling exists'].map(v => [v, v])} />
          <FieldSelect label="Delivery mode" value={deliveryMode} onChange={v => setDeliveryMode(v as DeliveryMode)}
            options={['Discovery', 'Build', 'Recovery', 'Transformation', 'Governance setup', 'Handover'].map(v => [v, v])} />
          <FieldSelect label="Funding / delivery scale" value={mandate.budget} onChange={v => upd('budget', v)}
            options={[['','-- Select --'],['under100k','< $100K'],['100k_1m','$100K - $1M'],['1m_10m','$1M - $10M'],['10m_100m','$10M - $100M'],['100mplus','$100M+']]} />
          <FieldSelect label="Expected duration" value={mandate.duration} onChange={v => upd('duration', v)}
            options={[['','-- Select --'],['under1month','< 1 Month'],['1_6months','1-6 Months'],['6_12months','6-12 Months'],['1_3years','1-3 Years'],['3yrsplus','3+ Years']]} />
          <FieldSelect label="Sector" value={mandate.sector} onChange={v => upd('sector', v)}
            options={[['','-- Select --'],['government','Government / Public'],['private','Private'],['nfp','Not-for-Profit'],['mixed','Mixed'],['defence','Defence'],['health','Health'],['finance','Financial Services'],['energy','Energy / Utilities']]} />
          <FieldSelect label="Mobilisation timing" value={mandate.startType} onChange={v => upd('startType', v)}
            options={[['Immediate','Immediate'],['Planned','Planned / Defined'],['TBD','TBD']]} />
          <div className="md:col-span-2">
            <FieldInput label="Location / remote context" value={mandate.location} onChange={v => upd('location', v)} placeholder="City, State, or remote" />
          </div>
        </div>
        <TextArea label="Mandate description *" value={mandate.mandate} onChange={v => upd('mandate', v)}
          placeholder="Paste the mandate as received. Include business outcomes, scope, constraints, timeline, stakeholders, known risks, governance concerns, and delivery dependencies." rows={5} />
        <TextArea label="Additional delivery context" value={mandate.additionalContext} onChange={v => upd('additionalContext', v)}
          placeholder="Governance maturity, decision rights, architecture dependencies, vendor risks, reporting constraints, or handover expectations." rows={3} />
        {error && <div className="mt-3 rounded border border-red-200 bg-red-50 p-3 text-xs font-mono text-red-700">{error}</div>}
        <div className="mt-5 flex flex-wrap gap-3">
          <button onClick={generateWorkspace} className="inline-flex items-center gap-2 rounded bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800">
            Generate delivery workspace <ArrowRight size={14} />
          </button>
          <button onClick={loadDemoWorkspace} className="rounded border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-700 hover:border-orange-500 hover:text-slate-950">
            Load sample workspace
          </button>
        </div>
      </ModuleShell>
    ),
    'architecture-framing': (
      <ModuleShell eyebrow="Velocity Architecture Framework" title="Architecture framing and VAF-SA linkage." icon={BookOpen}>
        <p className="max-w-3xl text-sm leading-relaxed text-slate-600">
          PMO Portal operationalises Velocity Architecture Framework artefacts into delivery control.
          It connects architecture intent, solution decisions, governance checkpoints, and delivery execution
          into one controlled client workspace.
        </p>
        <div className="mt-4 rounded border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-xs tracking-wider text-slate-600">
          Architecture intent → Architecture decisions → Solution guardrails → Delivery mobilisation → Governance model → Execution control → Handover records
        </div>
        <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
          <InfoCard title="Architecture intent" text="Clarify the outcome, capability impact, operating change, and decision context before delivery starts." />
          <InfoCard title="Business outcome" text="Connect delivery work to target business outcomes, benefits, constraints, and accountable sponsors." />
          <InfoCard title="Capability or service affected" text="Identify the capability, service, platform, data, integration, or operating model area being changed." />
          <InfoCard title="Decisions required" text="Confirm decision owners, design authority, ADR candidates, and decisions affecting delivery sequencing." />
          <InfoCard title="Solution boundaries" text="Capture integration edges, in-scope/out-of-scope constraints, vendor boundaries, data/security impact, and platform limits." />
          <InfoCard title="Delivery guardrails" text="Translate VAF and VAF-SA artefacts into practical governance checkpoints and delivery controls." />
        </div>
      </ModuleShell>
    ),
    'scale-assessment': (
      <ModuleShell eyebrow="Engagement scale" title="Scale assessment and control model." icon={Scale}>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {(['Small project', 'Medium project', 'Large programme'] as EngagementScale[]).map(scale => (
            <button
              key={scale}
              onClick={() => setEngagementScale(scale)}
              className={`border-l-4 p-4 text-left shadow-sm transition-colors ${engagementScale === scale ? 'border-orange-600 bg-orange-50' : 'border-slate-200 bg-white hover:border-blue-600'}`}
            >
              <div className="text-sm font-bold text-slate-950">{scale}</div>
              <div className="mt-1 text-xs text-slate-500">{artefactsForScale(scale).length} artefacts</div>
              <div className="mt-3 text-xs leading-relaxed text-slate-600">
                {scale === 'Small project' && 'Light governance, weekly status, simple delivery controls.'}
                {scale === 'Medium project' && 'Formal governance, decision rights, steering pack, and traceability.'}
                {scale === 'Large programme' && 'Programme controls, design authority, workstream reporting, and handover records.'}
              </div>
            </button>
          ))}
        </div>
      </ModuleShell>
    ),
    'artefact-catalogue': (
      <ModuleShell eyebrow="Controlled records" title="Artefact catalogue." icon={Package}>
        <p className="mb-4 text-sm leading-relaxed text-slate-600">
          The catalogue is a working module, not a document dump. Filter by category, status, visibility,
          or search term to inspect the controlled artefact lifecycle.
        </p>
        <div className="grid grid-cols-1 gap-3 rounded border border-slate-200 bg-slate-50 p-3 lg:grid-cols-[1fr_220px_220px_220px]">
          <label className="relative">
            <Search className="absolute left-3 top-3 text-slate-400" size={14} />
            <input
              value={search}
              onChange={event => setSearch(event.target.value)}
              placeholder="Search artefacts, owners, categories"
              className="w-full rounded border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 focus:border-sky-400 focus:outline-none"
            />
          </label>
          <SelectFilter value={categoryFilter} onChange={setCategoryFilter} options={['All', ...Array.from(new Set(artefacts.map(a => a.category)))]} />
          <SelectFilter value={statusFilter} onChange={setStatusFilter} options={['All', 'Required', 'Draft', 'In review', 'Approved', 'Shared', 'Locked', 'Superseded', 'Not required']} />
          <SelectFilter value={visibilityFilter} onChange={setVisibilityFilter} options={['All', 'Internal only', 'Client visible', 'Shared with client', 'Locked record', 'Archived']} />
        </div>
        <div className="mt-4 grid grid-cols-1 gap-3 xl:grid-cols-2">
          {filteredArtefacts.map(item => (
            <div key={item.name} className="rounded border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-bold text-slate-950">{item.name}</div>
                  <div className="mt-1 text-xs font-mono uppercase tracking-widest text-slate-500">{item.category}</div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge label={item.status} variant={item.status === 'Approved' || item.status === 'Shared' || item.status === 'Locked' ? 'green' : 'amber'} />
                  <Badge label={item.visibility} variant={item.clientVisible ? 'blue' : 'gray'} />
                </div>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.purpose}</p>
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs md:grid-cols-4">
                <ControlField label="Owner" value={item.owner} />
                <ControlField label="Timing" value={item.timing} />
                <ControlField label="Version" value={item.version} />
                <ControlField label="Required" value={item.requirement} />
                <ControlField label="Client visible" value={item.clientVisible ? 'Yes' : 'No'} />
                <ControlField label="Decisions" value={`D${item.linkedDecisions}`} />
                <ControlField label="Risks" value={`R${item.linkedRisks}`} />
                <ControlField label="Mode" value="Review" />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
          {['Preview', 'Generate draft', 'Export controlled artefact'].map(mode => (
            <div key={mode} className="rounded border-l-4 border-orange-600 bg-slate-50 p-3 text-sm font-semibold text-slate-800">{mode}</div>
          ))}
        </div>
        <p className="mt-4 text-sm leading-relaxed text-slate-600">
          Generated artefacts are draft outputs. They require human review before being shared, locked, or used as delivery records.
        </p>
      </ModuleShell>
    ),
    governance: (
      <ModuleShell eyebrow="PMO governance" title="Decision authority and governance cadence." icon={Shield}>
        <InfoRows rows={[
          ['Decision authority', 'Sponsor, delivery lead, architecture lead, design authority'],
          ['Cadence', 'Weekly delivery control, fortnightly architecture review, monthly steering'],
          ['Forums', 'Steering committee, design authority, RAID review, handover checkpoint'],
          ['Change control', 'Scope, cost, architecture, risk, and handover impacts require traceable decisions'],
          ['Escalation path', 'Delivery lead -> architecture lead -> sponsor -> steering committee'],
          ['Reporting rhythm', 'Executive snapshot, artefact visibility report, RAID summary, decision log'],
        ]} />
      </ModuleShell>
    ),
    'raid-decisions': (
      <ModuleShell eyebrow="Control loop" title="RAID and decisions." icon={GitBranch}>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {[
            ['Risks', 'Decision latency across workstreams; data migration readiness; unclear handover ownership.'],
            ['Assumptions', 'Client SMEs available; source systems documented; steering forum active.'],
            ['Issues', 'Data ownership and environment access need confirmation.'],
            ['Dependencies', 'Architecture review, vendor inputs, migration sequencing, handover acceptance.'],
            ['Decisions required', 'Confirm design authority; approve mobilisation pack; select private artefact store.'],
            ['Linked artefacts', 'Architecture Intent Brief, Governance Model, ADRs, RAID Log, Handover Pack.'],
          ].map(([label, text]) => <InfoCard key={label} title={label} text={text} />)}
        </div>
      </ModuleShell>
    ),
    milestones: (
      <ModuleShell eyebrow="Delivery plan" title="Milestones." icon={Layers}>
        <div className="grid gap-2">
          {['Intake', 'Mobilisation', 'Governance setup', 'Architecture review', 'Delivery planning', 'Execution checkpoints', 'Executive reviews', 'Handover'].map((milestone, index) => (
            <div key={milestone} className="flex items-center gap-3 rounded border border-slate-200 bg-white p-3">
              <span className="font-mono text-xs text-orange-700">{String(index + 1).padStart(2, '0')}</span>
              <span className="text-sm font-semibold text-slate-800">{milestone}</span>
              <span className="ml-auto text-xs text-slate-500">{index < 2 ? 'Active' : 'Planned'}</span>
            </div>
          ))}
        </div>
      </ModuleShell>
    ),
    'executive-snapshot': (
      <ModuleShell eyebrow="Executive visibility" title="Executive snapshot." icon={BarChart2}>
        <InfoRows rows={[
          ['Current status', 'Mobilisation active'],
          ['Top risk', 'Decision latency across workstreams'],
          ['Next decision', 'Confirm design authority'],
          ['Blocker', 'Private artefact store selection'],
          ['Upcoming milestone', 'Architecture review and governance model approval'],
          ['Recommended action', 'Approve control model, VAF artefact set, and export destination'],
          ['Artefact completion', `${completion}% shared or locked`],
        ]} />
      </ModuleShell>
    ),
    'client-visibility': (
      <ModuleShell eyebrow="Transparency" title="Client visibility model." icon={Users}>
        <p className="mb-4 text-sm leading-relaxed text-slate-600">
          Every engagement creates a visible trail of artefacts, decisions, risks, assumptions,
          governance checkpoints, and delivery outputs.
        </p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <InfoList title="Client visible" items={['Approved artefacts', 'Shared decisions', 'RAID summary', 'Milestone status', 'Executive updates', 'Handover pack']} />
          <InfoList title="Internal only" items={['Working drafts', 'Private notes', 'Sensitive analysis', 'Internal prompts', 'Unapproved artefacts']} />
        </div>
      </ModuleShell>
    ),
    'handover-pack': (
      <ModuleShell eyebrow="Controlled closure" title="Client handover pack." icon={CheckCircle2}>
        <InfoList title="Handover records" items={['Artefacts delivered and locked records', 'Decisions recorded with rationale and owner', 'Risks transferred or accepted with residual risk notes', 'Governance model and operating notes', 'Next phase recommendations']} />
      </ModuleShell>
    ),
    'security-storage': (
      <ModuleShell eyebrow="Storage model" title="Security and private artefact storage." icon={Lock}>
        <p className="text-sm leading-relaxed text-slate-600">
          The public PMO Portal demo does not store real client data. Any artefacts generated from real engagement
          information must be exported to a private client workspace, private repository, or approved client document store.
        </p>
        <div className="mt-4 rounded border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-xs tracking-wider text-slate-600">
          {STORAGE_FLOW}
        </div>
        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
          <InfoList title="Public demo rules" items={['Public demo data only', 'Do not enter confidential or client-identifiable information', 'Public repo contains code, templates, and fictional/demo examples only', 'No real client mandates, risks, decisions, reports, or generated artefacts should be committed']} />
          <InfoList title="Controlled artefact rules" items={['Real artefacts go to private client workspace', 'Client artefacts are shared only with authorised stakeholders', 'Generated artefacts are controlled records', 'Authorised records are locked before handover']} />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
          {['Markdown', 'PDF', 'Word', 'CSV', 'Private Git repository', 'SharePoint / OneDrive', 'Client document store', 'Locked records'].map(target => (
            <div key={target} className="rounded border border-slate-200 bg-white p-3 text-sm text-slate-700">{target}</div>
          ))}
        </div>
      </ModuleShell>
    ),
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 px-4 py-3 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-[1500px] items-center gap-4">
          <button
            className="rounded border border-slate-200 p-2 text-slate-600 lg:hidden"
            onClick={() => setMobileNavOpen(v => !v)}
            aria-label="Toggle workspace navigation"
          >
            <Menu size={16} />
          </button>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-mono tracking-widest text-slate-500">ZenCloud Advisory · StudioSix Delivery Ecosystem · Velocity Architecture Framework</div>
            <div className="font-display text-xl font-black tracking-widest text-slate-950">PMO PORTAL</div>
          </div>
          <div className="hidden text-right text-xs font-mono leading-relaxed text-slate-500 md:block">
            AI drafts · Architect reviews · Client receives controlled artefacts
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1500px] grid-cols-1 lg:grid-cols-[260px_1fr_300px]">
        <aside className={`${mobileNavOpen ? 'block' : 'hidden'} border-b border-slate-200 bg-slate-50 p-4 lg:sticky lg:top-[73px] lg:block lg:h-[calc(100vh-73px)] lg:border-b-0 lg:border-r`}>
          <div className="mb-4 rounded border-l-4 border-orange-600 bg-white p-4 shadow-sm">
            <div className="text-xs font-mono tracking-widest text-orange-700">VAF-ALIGNED WORKSPACE</div>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">One module at a time. Summary first. Detail on selection.</p>
          </div>
          <nav className="space-y-1">
            {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
              const active = activeModule === id
              return (
                <button
                  key={id}
                  onClick={() => openModule(id)}
                  className={`flex w-full items-center gap-2 rounded border px-3 py-2 text-left text-sm transition-colors ${
                    active
                      ? 'border-orange-200 bg-orange-50 text-slate-950'
                      : 'border-transparent text-slate-600 hover:border-slate-200 hover:bg-white hover:text-slate-950'
                  }`}
                >
                  <Icon size={15} className={active ? 'text-orange-700' : 'text-slate-400'} />
                  {label}
                </button>
              )
            })}
          </nav>
        </aside>

        <main className="min-w-0 px-4 py-5 lg:px-6">
          <div className="mb-4 rounded border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-mono uppercase tracking-widest text-slate-500">Active module</span>
              <strong className="text-sm text-slate-950">{activeLabel}</strong>
              <span className="ml-auto text-xs font-mono text-slate-500">{SHORT_WORKFLOW}</span>
            </div>
          </div>
          {moduleContent[activeModule]}
        </main>

        <aside className="border-t border-slate-200 bg-slate-50 p-4 lg:sticky lg:top-[73px] lg:block lg:h-[calc(100vh-73px)] lg:border-l lg:border-t-0">
          <div className="space-y-4">
            <Card className="p-4">
              <div className="text-xs font-mono tracking-widest text-slate-500">RIGHT SUMMARY</div>
              <div className="mt-2 font-display text-2xl font-black text-slate-950">
                {mandate.engagementName || 'ERP Consolidation Programme'}
              </div>
              <p className="mt-2 text-sm text-slate-600">{mandate.client || 'Fictional Manufacturing Group'}</p>
            </Card>
            <Metric label="Active module" value={activeLabel} icon={Target} />
            <Metric label="Selected scale" value={engagementScale} icon={Scale} />
            <Metric label="Current phase" value="Mobilisation" icon={Layers} />
            <Metric label="Artefact completion" value={`${completion}%`} icon={BarChart2} />
            <Card accent className="border-orange-200 bg-orange-50/60 p-4">
              <div className="text-xs font-mono tracking-widest text-orange-700">PRIVATE STORAGE WARNING</div>
              <p className="mt-2 text-sm leading-relaxed text-slate-700">
                Public demo only. Real engagement artefacts must be exported to a private client workspace,
                private repository, or approved client document store.
              </p>
            </Card>
          </div>
        </aside>
      </div>
    </div>
  )
}

function ModuleShell({ eyebrow, title, icon: Icon, children }: { eyebrow: string; title: string; icon: LucideIcon; children: ReactNode }) {
  return (
    <section className="rounded border-l-4 border-orange-600 border-y border-r border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-start gap-3">
        <div className="rounded border border-orange-200 bg-orange-50 p-2 text-orange-700">
          <Icon size={18} />
        </div>
        <div>
          <div className="text-xs font-mono uppercase tracking-widest text-orange-700">{eyebrow}</div>
          <h1 className="font-display text-3xl font-black leading-tight text-slate-950">{title}</h1>
        </div>
      </div>
      {children}
    </section>
  )
}

function Metric({ label, value, icon: Icon, compact = false }: { label: string; value: string; icon: LucideIcon; compact?: boolean }) {
  return (
    <div className="rounded border border-slate-200 bg-white p-3 shadow-sm">
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="text-xs font-mono uppercase tracking-widest text-slate-500">{label}</span>
        <Icon size={15} className="text-blue-700" />
      </div>
      <div className={`font-display font-black leading-tight text-slate-950 ${compact ? 'text-lg' : 'text-xl'}`}>{value}</div>
    </div>
  )
}

function InfoCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded border border-slate-200 bg-slate-50 p-4">
      <div className="text-xs font-mono uppercase tracking-widest text-slate-500">{title}</div>
      <p className="mt-2 text-sm leading-relaxed text-slate-700">{text}</p>
    </div>
  )
}

function InfoRows({ rows }: { rows: [string, string][] }) {
  return (
    <div className="space-y-2">
      {rows.map(([label, value]) => (
        <div key={label} className="grid gap-2 border-b border-slate-100 pb-2 text-sm md:grid-cols-[190px_1fr]">
          <div className="font-mono text-xs uppercase tracking-widest text-slate-500">{label}</div>
          <div className="text-slate-700">{value}</div>
        </div>
      ))}
    </div>
  )
}

function ControlField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded border border-slate-200 bg-slate-50 px-2 py-1.5">
      <div className="font-mono text-[10px] uppercase tracking-widest text-slate-400">{label}</div>
      <div className="mt-1 truncate font-semibold text-slate-700">{value}</div>
    </div>
  )
}

function InfoList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded border border-slate-200 bg-slate-50 p-4">
      <div className="text-xs font-mono uppercase tracking-widest text-slate-500">{title}</div>
      <ul className="mt-3 space-y-2">
        {items.map(item => (
          <li key={item} className="flex gap-2 text-sm text-slate-700">
            <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-orange-600" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

function TextArea({ label, value, onChange, placeholder, rows }: { label: string; value: string; onChange: (value: string) => void; placeholder: string; rows: number }) {
  return (
    <label className="mt-4 block">
      <span className="block text-xs font-mono uppercase tracking-widest text-slate-500">{label}</span>
      <textarea
        rows={rows}
        className="mt-1.5 w-full resize-none rounded border border-slate-200 bg-white px-3 py-2.5 text-sm leading-relaxed text-slate-900 placeholder-slate-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100"
        placeholder={placeholder}
        value={value}
        onChange={event => onChange(event.target.value)}
      />
    </label>
  )
}

function SelectFilter({ value, onChange, options }: { value: string; onChange: (value: string) => void; options: string[] }) {
  return (
    <select
      value={value}
      onChange={event => onChange(event.target.value)}
      className="rounded border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-sky-400 focus:outline-none"
    >
      {options.map(option => <option key={option} value={option}>{option}</option>)}
    </select>
  )
}

function SafetyNote() {
  return (
    <div className="rounded border border-orange-200 bg-orange-50 px-4 py-3 text-sm leading-relaxed text-slate-700">
      Public demo only. Do not enter confidential, sensitive, or client-identifiable information.
      Real engagement artefacts must be exported to a private controlled workspace.
    </div>
  )
}
