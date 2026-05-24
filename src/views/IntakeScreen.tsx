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
  | 'Architecture artefact'
  | 'Solution architecture artefact'
  | 'Delivery governance artefact'
  | 'Execution control artefact'
  | 'Client reporting artefact'
  | 'Handover artefact'

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

const WORKFLOW = 'Intake → Architecture → Scale → Artefacts → Governance → Execution → Handover'
const ARCHITECTURE_FLOW = 'Architecture intent → Architecture decisions → Solution guardrails → Delivery mobilisation → Governance model → Execution control → Handover records'
const STORAGE_FLOW = 'Generate → Preview → Review → Export → Store privately → Share authorised artefacts → Lock records'

const ECOSYSTEM_LINKS = [
  ['ZenCloud', 'https://www.zencloud.com.au/'],
  ['StudioSix', 'https://studiosix.com.au/'],
  ['Velocity Architecture Framework', 'https://zencloudau.github.io/velocity-architecture/'],
  ['VAF custom site', 'https://velocityarchitectureframework.com'],
  ['VAF-SA', 'https://zencloudau.github.io/vaf-sa/'],
  ['EA Artefact Generator', 'https://ea.velocityarchitecture.com.au/'],
]

const NAV_ITEMS = [
  ['overview', 'Overview', Target],
  ['intake', 'Intake', FileText],
  ['architecture-framing', 'Architecture Framing', BookOpen],
  ['scale-assessment', 'Scale Assessment', Scale],
  ['artefact-catalogue', 'Artefact Catalogue', Package],
  ['governance', 'Governance', Shield],
  ['raid-decisions', 'RAID & Decisions', GitBranch],
  ['milestones', 'Milestones', Layers],
  ['executive-snapshot', 'Executive Snapshot', BarChart2],
  ['client-visibility', 'Client Visibility', Users],
  ['handover-pack', 'Handover Pack', CheckCircle2],
  ['security-storage', 'Security & Storage', Lock],
] as const

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
  if (name.includes('Architecture') || name.includes('Enterprise')) return 'Architecture artefact'
  if (name.includes('Solution') || name.includes('Design')) return 'Solution architecture artefact'
  if (name.includes('Governance') || name.includes('Authority') || name.includes('RACI') || name.includes('Change')) return 'Delivery governance artefact'
  if (name.includes('Status') || name.includes('Report') || name.includes('Steering') || name.includes('Benefits')) return 'Client reporting artefact'
  if (name.includes('Handover') || name.includes('Transition') || name.includes('Closure') || name.includes('Lessons') || name.includes('Residual')) return 'Handover artefact'
  return 'Execution control artefact'
}

function purposeFor(name: string) {
  if (name.includes('Architecture Intent')) return 'Frame business outcomes, capability impact, decisions required, and VAF guardrails.'
  if (name.includes('Architecture') || name.includes('Solution')) return 'Connect delivery execution back to architecture intent, VAF decisions, and VAF-SA solution shaping.'
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

export function IntakeScreen({ mandate, setMandate, onAnalyze, onLoadDemo, error }: IntakeProps) {
  const [engagementType, setEngagementType] = useState<EngagementType>('Programme')
  const [engagementScale, setEngagementScale] = useState<EngagementScale>('Large programme')
  const [clientMaturity, setClientMaturity] = useState<ClientMaturity>('Some governance')
  const [deliveryMode, setDeliveryMode] = useState<DeliveryMode>('Transformation')
  const [navOpen, setNavOpen] = useState(false)

  const artefacts = useMemo(() => buildArtefactCatalogue(engagementScale), [engagementScale])
  const clientVisibleCount = artefacts.filter(a => a.clientVisible).length
  const completion = Math.round((clientVisibleCount / artefacts.length) * 100)
  const upd = (k: keyof MandateInput, v: string) => setMandate(p => ({ ...p, [k]: v }))

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
  }

  const generateWorkspace = () => {
    void onAnalyze
    document.getElementById('overview')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 px-4 py-3 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-[1500px] items-center gap-4">
          <button
            className="rounded border border-slate-200 p-2 text-slate-600 lg:hidden"
            onClick={() => setNavOpen(v => !v)}
            aria-label="Toggle workspace navigation"
          >
            <Menu size={16} />
          </button>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-mono tracking-widest text-slate-500">ZenCloud Advisory · StudioSix Delivery Ecosystem</div>
            <div className="font-display text-xl font-black tracking-widest text-slate-950">PMO PORTAL</div>
          </div>
          <div className="hidden text-right text-xs font-mono leading-relaxed text-slate-500 md:block">
            AI drafts · Architect reviews · Client receives controlled artefacts
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1500px] grid-cols-1 lg:grid-cols-[260px_1fr_300px]">
        <aside className={`${navOpen ? 'block' : 'hidden'} border-b border-slate-200 bg-slate-50 p-4 lg:sticky lg:top-[73px] lg:block lg:h-[calc(100vh-73px)] lg:border-b-0 lg:border-r`}>
          <div className="mb-4 border-l-4 border-amber-600 bg-white p-4 shadow-sm">
            <div className="text-xs font-mono tracking-widest text-amber-700">VAF-ALIGNED WORKSPACE</div>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              From architecture intent to governed delivery execution.
            </p>
          </div>
          <nav className="space-y-1">
            {NAV_ITEMS.map(([id, label, Icon]) => (
              <a
                key={id}
                href={`#${id}`}
                onClick={() => setNavOpen(false)}
                className="flex items-center gap-2 rounded border border-transparent px-3 py-2 text-sm text-slate-600 hover:border-slate-200 hover:bg-white hover:text-slate-950"
              >
                <Icon size={15} className="text-slate-400" />
                {label}
              </a>
            ))}
          </nav>
        </aside>

        <main className="min-w-0 space-y-5 px-4 py-5 lg:px-6">
          <Module id="overview" eyebrow="StudioSix client engagement workspace" title="From architecture intent to governed delivery execution." icon={Target} accent="amber">
            <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
              <div>
                <p className="max-w-3xl text-base leading-relaxed text-slate-600">
                  Capture the client mandate, frame the architecture context, select the right artefact set,
                  and manage delivery governance, visibility, and handover from one controlled workspace.
                </p>
                <p className="mt-4 rounded border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-xs tracking-widest text-slate-600">
                  {WORKFLOW}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {['VAF decision governance', 'VAF-SA solution shaping', 'PMO control', 'Client transparency'].map(label => (
                    <Badge key={label} label={label} variant="blue" />
                  ))}
                </div>
                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <button onClick={generateWorkspace} className="inline-flex items-center justify-center gap-2 rounded bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800">
                    Generate delivery workspace <ArrowRight size={14} />
                  </button>
                  <button onClick={loadDemoWorkspace} className="rounded border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-700 hover:border-amber-500 hover:text-slate-950">
                    Load sample workspace
                  </button>
                </div>
              </div>
              <Card accent className="border-amber-200 bg-amber-50/50 p-5">
                <div className="text-xs font-mono tracking-widest text-amber-700">COMPACT ECOSYSTEM CONTEXT</div>
                <p className="mt-3 text-sm leading-relaxed text-slate-700">
                  PMO Portal is the delivery mobilisation and execution visibility layer in the StudioSix ecosystem,
                  supported by Velocity Architecture Framework, VAF-SA, and EA Artefact Generator.
                </p>
                <div className="mt-4 flex flex-wrap gap-3 text-xs font-semibold">
                  {ECOSYSTEM_LINKS.map(([label, href]) => (
                    <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="text-slate-700 underline decoration-amber-500/40 underline-offset-4 hover:text-amber-700">
                      {label}
                    </a>
                  ))}
                </div>
              </Card>
            </div>
          </Module>

          <Module id="intake" eyebrow="Client mandate" title="Intake and mobilisation inputs." icon={FileText} accent="blue">
            <div className="mb-4 rounded border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-slate-700">
              Public demo only. Do not enter confidential, sensitive, or client-identifiable information.
              Real engagement artefacts must be exported to a private controlled workspace.
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
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
            <label className="mt-4 block text-xs font-mono uppercase tracking-widest text-slate-500">Mandate description *</label>
            <textarea
              rows={5}
              className="mt-1.5 w-full resize-none rounded border border-slate-200 bg-white px-3 py-2.5 text-sm leading-relaxed text-slate-900 placeholder-slate-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-100"
              placeholder="Paste the mandate as received. Include business outcomes, scope, constraints, timeline, stakeholders, known risks, governance concerns, and delivery dependencies."
              value={mandate.mandate}
              onChange={e => upd('mandate', e.target.value)}
            />
            <label className="mt-4 block text-xs font-mono uppercase tracking-widest text-slate-500">Additional delivery context</label>
            <textarea
              rows={3}
              className="mt-1.5 w-full resize-none rounded border border-slate-200 bg-white px-3 py-2.5 text-sm leading-relaxed text-slate-900 placeholder-slate-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-100"
              placeholder="Governance maturity, decision rights, architecture dependencies, vendor risks, reporting constraints, or handover expectations."
              value={mandate.additionalContext}
              onChange={e => upd('additionalContext', e.target.value)}
            />
            {error && <div className="mt-3 rounded border border-red-200 bg-red-50 p-3 text-xs font-mono text-red-700">{error}</div>}
          </Module>

          <Module id="architecture-framing" eyebrow="Velocity Architecture Framework" title="Architecture framing and VAF-SA linkage." icon={BookOpen} accent="amber">
            <p className="max-w-3xl text-sm leading-relaxed text-slate-600">
              PMO Portal operationalises Velocity Architecture Framework artefacts into delivery control.
              It connects architecture intent, solution decisions, governance checkpoints, and delivery execution into one controlled client workspace.
            </p>
            <p className="mt-4 rounded border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-xs tracking-wider text-slate-600">
              {ARCHITECTURE_FLOW}
            </p>
            <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
              <InfoCard title="Architecture intent" text="Clarify the outcome, capability impact, operating change, and decision context before delivery starts." />
              <InfoCard title="Key architecture decisions required" text="Confirm decision owners, design authority, ADR candidates, and decisions that affect delivery sequencing." />
              <InfoCard title="Solution boundaries and guardrails" text="Capture constraints, integration edges, data/security impact, vendor boundaries, and non-negotiable delivery controls." />
              <InfoCard title="Required VAF / VAF-SA artefacts" text="Architecture Intent Brief, Architecture Decision Records, Solution Architecture Summary, Architecture Governance Pack, and delivery guardrails." />
            </div>
          </Module>

          <Module id="scale-assessment" eyebrow="Engagement scale" title="Scale assessment and control model." icon={Scale} accent="blue">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              {(['Small project', 'Medium project', 'Large programme'] as EngagementScale[]).map(scale => (
                <button
                  key={scale}
                  onClick={() => setEngagementScale(scale)}
                  className={`border-l-4 p-4 text-left shadow-sm transition-colors ${engagementScale === scale ? 'border-amber-600 bg-amber-50' : 'border-slate-200 bg-white hover:border-blue-600'}`}
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
            <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
              <Metric label="Selected artefacts" value={String(artefacts.length)} icon={Package} />
              <Metric label="Client visible now" value={String(clientVisibleCount)} icon={Users} />
              <Metric label="Completion" value={`${completion}%`} icon={BarChart2} />
              <Metric label="Control model" value="VAF" icon={Shield} />
            </div>
          </Module>

          <Module id="artefact-catalogue" eyebrow="Controlled records" title="Artefact catalogue." icon={Package} accent="amber">
            <p className="mb-4 text-sm leading-relaxed text-slate-600">
              Scale-based artefact set grouped by architecture, solution architecture, delivery governance, execution control,
              client reporting, and handover categories.
            </p>
            <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
              {artefacts.slice(0, 10).map(item => (
                <div key={item.name} className="border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-bold text-slate-950">{item.name}</div>
                      <div className="mt-1 text-xs font-mono uppercase tracking-widest text-slate-500">{item.category}</div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge label={item.requirement} variant={item.requirement === 'Required' ? 'blue' : 'gray'} />
                      <Badge label={item.status} variant={item.status === 'Approved' || item.status === 'Shared' || item.status === 'Locked' ? 'green' : 'amber'} />
                    </div>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">{item.purpose}</p>
                  <div className="mt-4 grid grid-cols-2 gap-2 text-xs md:grid-cols-4">
                    <ControlField label="Owner" value={item.owner} />
                    <ControlField label="Visibility" value={item.visibility} />
                    <ControlField label="Timing" value={item.timing} />
                    <ControlField label="Version" value={item.version} />
                    <ControlField label="Client visible" value={item.clientVisible ? 'Yes' : 'No'} />
                    <ControlField label="Linked decisions" value={`D${item.linkedDecisions}`} />
                    <ControlField label="Linked risks" value={`R${item.linkedRisks}`} />
                    <ControlField label="Record state" value={item.status} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
              {['Preview', 'Generate draft', 'Export controlled artefact'].map(mode => (
                <div key={mode} className="border-l-4 border-amber-600 bg-slate-50 p-3 text-sm font-semibold text-slate-800">{mode}</div>
              ))}
            </div>
            <p className="mt-4 text-sm leading-relaxed text-slate-600">
              Generated artefacts are draft outputs. They require human review before being shared, locked, or used as delivery records.
            </p>
          </Module>

          <Module id="governance" eyebrow="PMO governance" title="Decision authority and governance cadence." icon={Shield} accent="blue">
            <InfoRows rows={[
              ['Decision authority', 'Sponsor, delivery lead, architecture lead, design authority'],
              ['Cadence', 'Weekly delivery control, fortnightly architecture review, monthly steering'],
              ['Forums', 'Steering committee, design authority, RAID review, handover checkpoint'],
              ['Change control', 'Scope, cost, architecture, risk, and handover impacts require traceable decisions'],
              ['Escalation path', 'Delivery lead -> architecture lead -> sponsor -> steering committee'],
              ['Reporting rhythm', 'Executive snapshot, artefact visibility report, RAID summary, decision log'],
            ]} />
          </Module>

          <Module id="raid-decisions" eyebrow="Control loop" title="RAID and decisions." icon={GitBranch} accent="amber">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {[
                ['Risks', 'Decision latency across workstreams; data migration readiness; unclear handover ownership.'],
                ['Assumptions', 'Client SMEs available; source systems documented; steering forum active.'],
                ['Issues', 'Data ownership and environment access need confirmation.'],
                ['Dependencies', 'Architecture review, vendor inputs, migration sequencing, handover acceptance.'],
                ['Decisions required', 'Confirm design authority; approve mobilisation pack; select private artefact store.'],
                ['Linked artefacts', 'Architecture Intent Brief, Governance Model, ADRs, RAID Log, Handover Pack.'],
              ].map(([label, text]) => (
                <InfoCard key={label} title={label} text={text} />
              ))}
            </div>
          </Module>

          <Module id="milestones" eyebrow="Delivery plan" title="Milestones." icon={Layers} accent="blue">
            <div className="grid gap-2">
              {['Intake', 'Mobilisation', 'Governance setup', 'Architecture review', 'Delivery planning', 'Execution checkpoints', 'Executive reviews', 'Handover'].map((milestone, index) => (
                <div key={milestone} className="flex items-center gap-3 border border-slate-200 bg-white p-3">
                  <span className="font-mono text-xs text-amber-700">{String(index + 1).padStart(2, '0')}</span>
                  <span className="text-sm font-semibold text-slate-800">{milestone}</span>
                  <span className="ml-auto text-xs text-slate-500">{index < 2 ? 'Active' : 'Planned'}</span>
                </div>
              ))}
            </div>
          </Module>

          <Module id="executive-snapshot" eyebrow="Executive visibility" title="Executive snapshot." icon={BarChart2} accent="amber">
            <InfoRows rows={[
              ['Current status', 'Mobilisation active'],
              ['Top risk', 'Decision latency across workstreams'],
              ['Next decision', 'Confirm design authority'],
              ['Blocker', 'Private artefact store selection'],
              ['Upcoming milestone', 'Architecture review and governance model approval'],
              ['Recommended action', 'Approve control model, VAF artefact set, and export destination'],
              ['Artefact completion', `${completion}% client-visible or locked`],
            ]} />
          </Module>

          <Module id="client-visibility" eyebrow="Transparency" title="Client visibility model." icon={Users} accent="blue">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <InfoList title="Client visible" items={['Approved artefacts', 'Shared decisions', 'RAID summary', 'Milestone status', 'Executive updates', 'Handover pack']} />
              <InfoList title="Internal only" items={['Working drafts', 'Private notes', 'Sensitive analysis', 'Internal prompts', 'Unapproved artefacts']} />
            </div>
          </Module>

          <Module id="handover-pack" eyebrow="Controlled closure" title="Client handover pack." icon={CheckCircle2} accent="amber">
            <InfoList title="Handover records" items={['Artefacts delivered and locked records', 'Decisions recorded with rationale and owner', 'Risks transferred or accepted with residual risk notes', 'Governance model and operating notes', 'Next phase recommendations']} />
          </Module>

          <Module id="security-storage" eyebrow="Storage model" title="Security and private artefact storage." icon={Lock} accent="blue">
            <p className="text-sm leading-relaxed text-slate-600">
              The public PMO Portal demo does not store real client data. Any artefacts generated from real engagement
              information must be exported to a private client workspace, private repository, or approved client document store.
            </p>
            <p className="mt-4 rounded border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-xs tracking-wider text-slate-600">
              {STORAGE_FLOW}
            </p>
            <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
              {['Markdown', 'PDF', 'Word', 'CSV', 'Private Git repository', 'SharePoint / OneDrive', 'Client document store', 'Locked records'].map(target => (
                <div key={target} className="border border-slate-200 bg-white p-3 text-sm text-slate-700">{target}</div>
              ))}
            </div>
          </Module>
        </main>

        <aside className="hidden border-l border-slate-200 bg-slate-50 p-4 lg:sticky lg:top-[73px] lg:block lg:h-[calc(100vh-73px)]">
          <div className="space-y-4">
            <Card className="p-4">
              <div className="text-xs font-mono tracking-widest text-slate-500">DEMO WORKSPACE OUTPUT</div>
              <div className="mt-2 font-display text-2xl font-black text-slate-950">
                {mandate.engagementName || 'ERP Consolidation Programme'}
              </div>
              <p className="mt-2 text-sm text-slate-600">{mandate.client || 'Fictional Manufacturing Group'}</p>
            </Card>
            <Metric label="Artefact catalogue" value={String(artefacts.length)} icon={Package} />
            <Metric label="Client visible" value={String(clientVisibleCount)} icon={Users} />
            <Metric label="Completion" value={`${completion}%`} icon={BarChart2} />
            <Card accent className="border-amber-200 bg-amber-50/60 p-4">
              <div className="text-xs font-mono tracking-widest text-amber-700">STANDARDS-INFORMED</div>
              <p className="mt-2 text-sm leading-relaxed text-slate-700">
                Standards-informed by PMBOK 7, programme governance, risk, benefits, scheduling, governance, and professional ethics.
              </p>
            </Card>
          </div>
        </aside>
      </div>
    </div>
  )
}

function Module({
  id,
  eyebrow,
  title,
  icon: Icon,
  accent,
  children,
}: {
  id: string
  eyebrow: string
  title: string
  icon: LucideIcon
  accent: 'amber' | 'blue'
  children: ReactNode
}) {
  return (
    <section id={id} className={`scroll-mt-24 border-l-4 bg-white p-5 shadow-sm ${accent === 'amber' ? 'border-amber-600' : 'border-blue-600'} border-y border-r border-slate-200`}>
      <div className="mb-5 flex items-start gap-3">
        <div className={`rounded border p-2 ${accent === 'amber' ? 'border-amber-200 bg-amber-50 text-amber-700' : 'border-blue-200 bg-blue-50 text-blue-700'}`}>
          <Icon size={18} />
        </div>
        <div>
          <div className={`text-xs font-mono uppercase tracking-widest ${accent === 'amber' ? 'text-amber-700' : 'text-blue-700'}`}>{eyebrow}</div>
          <h2 className="font-display text-3xl font-black leading-tight text-slate-950">{title}</h2>
        </div>
      </div>
      {children}
    </section>
  )
}

function Metric({ label, value, icon: Icon }: { label: string; value: string; icon: LucideIcon }) {
  return (
    <div className="border border-slate-200 bg-white p-3 shadow-sm">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-mono uppercase tracking-widest text-slate-500">{label}</span>
        <Icon size={15} className="text-blue-700" />
      </div>
      <div className="font-display text-2xl font-black text-slate-950">{value}</div>
    </div>
  )
}

function InfoCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="border border-slate-200 bg-slate-50 p-4">
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
    <div className="border border-slate-200 bg-slate-50 px-2 py-1.5">
      <div className="font-mono uppercase tracking-widest text-slate-400">{label}</div>
      <div className="mt-1 font-semibold text-slate-700">{value}</div>
    </div>
  )
}

function InfoList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="border border-slate-200 bg-slate-50 p-4">
      <div className="text-xs font-mono uppercase tracking-widest text-slate-500">{title}</div>
      <ul className="mt-3 space-y-2">
        {items.map(item => (
          <li key={item} className="flex gap-2 text-sm text-slate-700">
            <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-600" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}
