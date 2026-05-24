import { useMemo, useState, type Dispatch, type SetStateAction } from 'react'
import {
  ArrowRight, BarChart2, CheckCircle2, Database, FileText, GitBranch,
  Layers, Lock, Package, Shield, Target, Users,
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

interface Artefact {
  name: string
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

const WORKFLOW = 'Architecture → Governance → Mobilisation → Artefacts → Execution → Delivery visibility'

const ECOSYSTEM_LINKS = [
  ['ZenCloud Advisory', 'https://www.zencloud.com.au/'],
  ['StudioSix', 'https://studiosix.com.au/'],
  ['Velocity Architecture Framework', 'https://velocityarchitectureframework.com'],
  ['VAF-SA', 'https://zencloudau.github.io/vaf-sa/'],
  ['EA Artefact Generator', 'https://ea.velocityarchitecture.com.au/'],
]

const STRATEGIC_FLOW = [
  'Client mandate',
  'Engagement scale assessment',
  'Artefact set selection',
  'AI-assisted draft generation',
  'Human review',
  'Controlled private storage',
  'Client-visible sharing',
  'Governance updates',
  'Handover pack',
]

const SMALL_ARTEFACTS = [
  'Mandate / Intake Brief',
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
      purpose: purposeFor(name),
      requirement: index < 10 ? 'Required' : 'Optional',
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

function purposeFor(name: string) {
  if (name.includes('Governance') || name.includes('Authority')) return 'Define decision rights, forums, cadence, and escalation paths.'
  if (name.includes('RAID') || name.includes('Risk')) return 'Track risks, assumptions, issues, dependencies, and transfer points.'
  if (name.includes('Architecture') || name.includes('Solution')) return 'Connect delivery execution back to architecture intent and design decisions.'
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
  if (index < 4) return 'Intake'
  if (index < 10) return 'Mobilisation'
  if (index < 20) return 'Execution'
  return 'Handover'
}

export function IntakeScreen({ mandate, setMandate, onAnalyze, onLoadDemo, error }: IntakeProps) {
  const [engagementType, setEngagementType] = useState<EngagementType>('Programme')
  const [engagementScale, setEngagementScale] = useState<EngagementScale>('Large programme')
  const [clientMaturity, setClientMaturity] = useState<ClientMaturity>('Some governance')
  const [deliveryMode, setDeliveryMode] = useState<DeliveryMode>('Transformation')
  const [workspaceReady, setWorkspaceReady] = useState(true)

  const upd = (k: keyof MandateInput, v: string) => setMandate(p => ({ ...p, [k]: v }))
  const artefacts = useMemo(() => buildArtefactCatalogue(engagementScale), [engagementScale])
  const approvedCount = artefacts.filter(a => a.clientVisible).length

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
    setWorkspaceReady(true)
  }

  const generateWorkspace = () => {
    void onAnalyze
    setWorkspaceReady(true)
    document.getElementById('artefact-catalogue')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 px-6 py-4 shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div>
            <div className="text-xs font-mono tracking-widest text-sky-700">ZenCloud Advisory · StudioSix Delivery Ecosystem</div>
            <div className="font-display text-xl font-black tracking-widest text-slate-950">PMO PORTAL</div>
          </div>
          <div className="hidden text-right text-xs font-mono leading-relaxed text-slate-500 md:block">
            AI drafts · Architect reviews · Client receives controlled artefacts
          </div>
        </div>
      </header>

      <main>
        <section className="border-b border-slate-200 bg-gradient-to-br from-white via-sky-50 to-slate-100 px-6 py-8">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 xl:grid-cols-[1fr_0.9fr]">
            <div>
              <div className="mb-3 text-xs font-mono tracking-widest text-sky-700">STUDIOSIX CLIENT ENGAGEMENT WORKSPACE</div>
              <h1 className="font-display text-4xl font-black leading-none text-slate-950 md:text-6xl">
                From client mandate to governed delivery workspace.
              </h1>
              <p className="mt-5 max-w-3xl text-base leading-relaxed text-slate-600">
                Capture the engagement context, assess project scale, generate the right artefact set,
                and provide transparent delivery visibility from mobilisation to handover.
              </p>
              <p className="mt-4 rounded border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-xs tracking-widest text-slate-600">
                {WORKFLOW}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {['Intake', 'Scale', 'Artefacts', 'Governance', 'Execution', 'Handover'].map(step => (
                  <Badge key={step} label={step} variant="blue" />
                ))}
              </div>
              <div className="mt-5 rounded-lg border border-sky-200 bg-white/80 p-4 text-sm leading-relaxed text-slate-700">
                PMO Portal is the delivery mobilisation and execution visibility layer in the StudioSix ecosystem,
                supported by Velocity Architecture Framework, VAF-SA, and EA Artefact Generator.
                <div className="mt-3 flex flex-wrap gap-3 text-xs font-semibold">
                  {ECOSYSTEM_LINKS.map(([label, href]) => (
                    <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="text-sky-700 hover:text-sky-900">
                      {label}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <Card accent className="p-5">
              <div className="mb-4 text-xs font-mono tracking-widest text-sky-700">CONTROLLED ARTEFACT LIFECYCLE</div>
              <div className="grid grid-cols-2 gap-2 text-sm md:grid-cols-4 xl:grid-cols-2">
                {['Required', 'Draft', 'In review', 'Approved', 'Shared', 'Locked', 'Handover'].map(item => (
                  <div key={item} className="rounded border border-slate-200 bg-white px-3 py-2 font-semibold text-slate-700">
                    {item}
                  </div>
                ))}
              </div>
              <p className="mt-4 text-sm leading-relaxed text-slate-600">
                Generated artefacts are draft outputs. They require human review before being shared,
                locked, or used as delivery records.
              </p>
            </Card>
          </div>
        </section>

        <section className="border-b border-slate-200 bg-white px-6 py-6">
          <div className="mx-auto max-w-7xl">
            <div className="mb-3 text-xs font-mono tracking-widest text-slate-500 uppercase">Strategic workflow</div>
            <div className="grid grid-cols-1 gap-2 md:grid-cols-3 xl:grid-cols-9">
              {STRATEGIC_FLOW.map((step, index) => (
                <div key={step} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <div className="text-xs font-mono text-sky-600">{String(index + 1).padStart(2, '0')}</div>
                  <div className="mt-1 text-sm font-semibold text-slate-800">{step}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 py-8">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <Card className="p-5">
              <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                  <div className="mb-2 text-xs font-mono tracking-widest text-sky-700">MANDATE INTAKE AND SCALE ASSESSMENT</div>
                  <h2 className="font-display text-3xl font-black leading-none text-slate-950">Generate delivery workspace.</h2>
                </div>
                <div className="max-w-sm text-xs text-slate-500">
                  Public demo only. Do not enter confidential, sensitive, or client-identifiable information.
                  Real engagement artefacts must be exported to a private controlled workspace.
                </div>
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
              </div>

              <div className="mt-3">
                <FieldInput label="Location / remote context" value={mandate.location} onChange={v => upd('location', v)} placeholder="City, State, or remote" />
              </div>
              <label className="mt-4 block text-xs font-mono uppercase tracking-widest text-slate-500">Mandate description *</label>
              <textarea
                rows={6}
                className="mt-1.5 w-full resize-none rounded border border-slate-200 bg-white px-3 py-2.5 text-sm leading-relaxed text-slate-900 placeholder-slate-400 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
                placeholder="Paste the mandate as received. Include business outcomes, scope, constraints, timeline, stakeholders, known risks, governance concerns, and delivery dependencies."
                value={mandate.mandate}
                onChange={e => upd('mandate', e.target.value)}
              />
              <label className="mt-4 block text-xs font-mono uppercase tracking-widest text-slate-500">Additional delivery context</label>
              <textarea
                rows={3}
                className="mt-1.5 w-full resize-none rounded border border-slate-200 bg-white px-3 py-2.5 text-sm leading-relaxed text-slate-900 placeholder-slate-400 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
                placeholder="Governance maturity, decision rights, architecture dependencies, vendor risks, reporting constraints, or handover expectations."
                value={mandate.additionalContext}
                onChange={e => upd('additionalContext', e.target.value)}
              />
              {error && <div className="mt-3 rounded border border-red-200 bg-red-50 p-3 text-xs font-mono text-red-700">{error}</div>}
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <button onClick={generateWorkspace} className="inline-flex items-center justify-center gap-2 rounded bg-sky-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-sky-800">
                  Generate delivery workspace <ArrowRight size={14} />
                </button>
                <button onClick={loadDemoWorkspace} className="rounded border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-600 hover:border-sky-300 hover:text-sky-700">
                  Load sample workspace
                </button>
              </div>
            </Card>

            <Card className="p-5">
              <div className="mb-4 text-xs font-mono tracking-widest text-sky-700">SCALE-BASED ARTEFACT SET</div>
              <div className="grid grid-cols-3 gap-3">
                {(['Small project', 'Medium project', 'Large programme'] as EngagementScale[]).map(scale => (
                  <button
                    key={scale}
                    onClick={() => setEngagementScale(scale)}
                    className={`rounded-lg border p-4 text-left transition-colors ${engagementScale === scale ? 'border-sky-300 bg-sky-50' : 'border-slate-200 bg-slate-50 hover:border-sky-200'}`}
                  >
                    <div className="text-sm font-bold text-slate-950">{scale}</div>
                    <div className="mt-1 text-xs text-slate-500">{artefactsForScale(scale).length} artefacts</div>
                  </button>
                ))}
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <Metric label="Selected artefacts" value={String(artefacts.length)} icon={Package} />
                <Metric label="Client visible now" value={String(approvedCount)} icon={Users} />
                <Metric label="Lifecycle states" value="8" icon={GitBranch} />
                <Metric label="Export model" value="Private" icon={Lock} />
              </div>
              <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-4">
                <div className="text-sm font-semibold text-slate-950">Generate → Preview → Export → Store privately</div>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  The public demo does not store real client data. Real engagement artefacts must be exported
                  to a private client workspace, private repository, or approved client document store.
                </p>
              </div>
            </Card>
          </div>
        </section>

        {workspaceReady && (
          <WorkspaceModel
            mandate={mandate}
            engagementType={engagementType}
            engagementScale={engagementScale}
            clientMaturity={clientMaturity}
            deliveryMode={deliveryMode}
            artefacts={artefacts}
          />
        )}
      </main>
    </div>
  )
}

function Metric({ label, value, icon: Icon }: { label: string; value: string; icon: typeof BarChart2 }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-mono uppercase tracking-widest text-slate-500">{label}</span>
        <Icon size={15} className="text-sky-600" />
      </div>
      <div className="font-display text-2xl font-black text-slate-950">{value}</div>
    </div>
  )
}

function WorkspaceModel({
  mandate,
  engagementType,
  engagementScale,
  clientMaturity,
  deliveryMode,
  artefacts,
}: {
  mandate: MandateInput
  engagementType: EngagementType
  engagementScale: EngagementScale
  clientMaturity: ClientMaturity
  deliveryMode: DeliveryMode
  artefacts: Artefact[]
}) {
  const topRisks = ['Decision latency across workstreams', 'Data migration readiness', 'Unclear handover ownership']
  const nextDecisions = ['Confirm design authority', 'Approve mobilisation pack', 'Select private artefact store']

  return (
    <section className="border-t border-slate-200 bg-white px-6 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-2 text-xs font-mono uppercase tracking-widest text-sky-700">Demo workspace output</div>
            <h2 className="font-display text-3xl font-black text-slate-950">Controlled delivery workspace</h2>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
              Fictional sample output for {mandate.engagementName || 'ERP Consolidation Programme'}.
              AI drafts the structure, the architect reviews it, and approved artefacts are exported
              to controlled private workspaces.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {['Overview', 'Mobilisation Brief', 'Governance', 'Artefacts', 'RAID & Decisions', 'Milestones', 'Executive Snapshot', 'Handover'].map(anchor => (
              <a key={anchor} href={`#${anchor.toLowerCase().split(' ').join('-').replace('&', 'and')}`} className="rounded border border-slate-200 px-2 py-1 text-xs text-slate-600 hover:border-sky-300 hover:text-sky-700">
                {anchor}
              </a>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
          <Card className="p-5" id="overview">
            <ModuleTitle icon={Target} title="Engagement Overview" />
            <InfoRows rows={[
              ['Engagement', mandate.engagementName || 'ERP Consolidation Programme'],
              ['Organisation', mandate.client || 'Fictional Manufacturing Group'],
              ['Type', engagementType],
              ['Scale', engagementScale],
              ['Maturity', clientMaturity],
              ['Delivery mode', deliveryMode],
              ['Current phase', 'Mobilisation'],
            ]} />
          </Card>

          <Card className="p-5" id="mobilisation-brief">
            <ModuleTitle icon={FileText} title="Mobilisation Brief" />
            <ul className="space-y-2 text-sm text-slate-600">
              <li>First 10 working days: confirm sponsor, decision forum, RAID baseline, and artefact store.</li>
              <li>Immediate decisions: design authority, reporting rhythm, export destination, and client-visible artefacts.</li>
              <li>Mobilisation risks: unclear ownership, workstream dependency gaps, data migration assumptions.</li>
            </ul>
          </Card>

          <Card className="p-5" id="governance">
            <ModuleTitle icon={Shield} title="Governance Model" />
            <InfoRows rows={[
              ['Decision authority', 'Sponsor, delivery lead, architecture lead'],
              ['Cadence', 'Weekly delivery control, fortnightly steering'],
              ['Forums', 'Steering committee, design authority, RAID review'],
              ['Escalation', 'Risk, scope, architecture, and handover impacts'],
              ['Reporting', 'Executive snapshot and artefact visibility report'],
            ]} />
          </Card>
        </div>

        <Card className="mt-4 overflow-hidden" id="artefact-catalogue">
          <div className="border-b border-slate-200 p-5">
            <ModuleTitle icon={Package} title="Artefact Catalogue" />
            <p className="text-sm text-slate-600">
              Scale-based artefact set with lifecycle status, visibility, owner, timing, version, linked decisions, and linked risks.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  {['Artefact', 'Purpose', 'Req.', 'Owner', 'Status', 'Visibility', 'Timing', 'Version', 'Client', 'Links'].map(head => (
                    <th key={head} className="whitespace-nowrap px-3 py-3 font-mono uppercase tracking-widest">{head}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {artefacts.slice(0, 18).map(item => (
                  <tr key={item.name} className="align-top">
                    <td className="min-w-56 px-3 py-3 font-semibold text-slate-900">{item.name}</td>
                    <td className="min-w-72 px-3 py-3 text-slate-600">{item.purpose}</td>
                    <td className="px-3 py-3"><Badge label={item.requirement} variant={item.requirement === 'Required' ? 'blue' : 'gray'} /></td>
                    <td className="min-w-32 px-3 py-3 text-slate-600">{item.owner}</td>
                    <td className="px-3 py-3"><Badge label={item.status} variant={item.status === 'Approved' || item.status === 'Shared' || item.status === 'Locked' ? 'green' : 'amber'} /></td>
                    <td className="min-w-32 px-3 py-3 text-slate-600">{item.visibility}</td>
                    <td className="px-3 py-3 text-slate-600">{item.timing}</td>
                    <td className="px-3 py-3 font-mono text-slate-500">{item.version}</td>
                    <td className="px-3 py-3">{item.clientVisible ? 'Yes' : 'No'}</td>
                    <td className="px-3 py-3 text-slate-500">D{item.linkedDecisions} / R{item.linkedRisks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-2">
          <Card className="p-5" id="raid-and-decisions">
            <ModuleTitle icon={GitBranch} title="RAID and Decision Control" />
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {[
                ['Risks', topRisks.join('; ')],
                ['Assumptions', 'Client SMEs available; source systems documented; steering forum active.'],
                ['Issues', 'Data ownership and environment access need confirmation.'],
                ['Dependencies', 'Architecture review, vendor inputs, migration sequencing, handover acceptance.'],
                ['Decisions', nextDecisions.join('; ')],
                ['Linked artefacts', 'Governance Model, Architecture Decision Records, RAID Log, Handover Pack.'],
              ].map(([label, text]) => (
                <div key={label} className="rounded border border-slate-200 bg-slate-50 p-3">
                  <div className="text-xs font-mono uppercase tracking-widest text-sky-700">{label}</div>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{text}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5" id="milestones">
            <ModuleTitle icon={Layers} title="Milestone Plan" />
            <div className="space-y-2">
              {['Intake', 'Mobilisation', 'Governance setup', 'Architecture review', 'Delivery planning', 'Execution checkpoints', 'Executive reviews', 'Handover'].map((milestone, index) => (
                <div key={milestone} className="flex items-center gap-3 rounded border border-slate-200 bg-slate-50 p-3">
                  <span className="font-mono text-xs text-sky-700">{String(index + 1).padStart(2, '0')}</span>
                  <span className="text-sm font-semibold text-slate-800">{milestone}</span>
                  <span className="ml-auto text-xs text-slate-500">{index < 2 ? 'Active' : 'Planned'}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-3">
          <Card className="p-5" id="executive-snapshot">
            <ModuleTitle icon={BarChart2} title="Executive Snapshot" />
            <InfoRows rows={[
              ['Current status', 'Mobilisation active'],
              ['Top risks', topRisks[0]],
              ['Next decisions', nextDecisions[0]],
              ['Blockers', 'Private artefact store selection'],
              ['Upcoming milestone', 'Design authority confirmation'],
              ['Recommended action', 'Approve governance model and export destination'],
            ]} />
          </Card>

          <Card className="p-5" id="handover">
            <ModuleTitle icon={CheckCircle2} title="Client Handover Pack" />
            <ul className="space-y-2 text-sm text-slate-600">
              <li>Artefacts delivered and locked records.</li>
              <li>Decisions recorded with rationale and owner.</li>
              <li>Risks transferred or accepted with residual risk notes.</li>
              <li>Governance model, operating notes, and next phase recommendations.</li>
            </ul>
          </Card>

          <Card className="p-5">
            <ModuleTitle icon={Database} title="Client Transparency and Storage" />
            <div className="grid grid-cols-1 gap-3 text-sm text-slate-600">
              <div><strong className="text-slate-900">Client can see:</strong> approved artefacts, shared decisions, RAID summary, milestone status, executive updates, handover pack.</div>
              <div><strong className="text-slate-900">Internal only:</strong> working drafts, private notes, sensitive analysis, internal prompts, unapproved artefacts.</div>
              <div><strong className="text-slate-900">Export targets:</strong> Markdown, PDF, Word, CSV, private Git repository, SharePoint / OneDrive, client document store.</div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}

function ModuleTitle({ icon: Icon, title }: { icon: typeof FileText; title: string }) {
  return (
    <div className="mb-3 flex items-center gap-2">
      <Icon size={16} className="text-sky-700" />
      <h3 className="font-display text-xl font-black text-slate-950">{title}</h3>
    </div>
  )
}

function InfoRows({ rows }: { rows: [string, string][] }) {
  return (
    <div className="space-y-2">
      {rows.map(([label, value]) => (
        <div key={label} className="grid grid-cols-[140px_1fr] gap-3 border-b border-slate-100 pb-2 text-sm">
          <div className="font-mono text-xs uppercase tracking-widest text-slate-500">{label}</div>
          <div className="text-slate-700">{value}</div>
        </div>
      ))}
    </div>
  )
}
