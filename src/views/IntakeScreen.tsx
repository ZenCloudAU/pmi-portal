import type { Dispatch, SetStateAction } from 'react'
import { ArrowRight, BarChart2, FileText, GitBranch, Shield, Target, Users } from 'lucide-react'
import { Badge, Card, FieldInput, FieldSelect } from '@/components/ui'
import type { MandateInput } from '@/types'

interface IntakeProps {
  mandate:    MandateInput
  setMandate: Dispatch<SetStateAction<MandateInput>>
  onAnalyze:  () => void
  onLoadDemo: () => void
  error:      string | null
}

const LIFECYCLE = [
  'Architecture',
  'Governance',
  'Mobilisation',
  'Artefacts',
  'Execution',
  'Visibility',
]

const SNAPSHOT_CARDS = [
  {
    label: 'Mobilisation readiness',
    value: 'Day 1-5',
    desc: 'Convert the mandate into a governed start sequence.',
    icon: Target,
  },
  {
    label: 'Governance control',
    value: '4 lanes',
    desc: 'Authority, reporting, change, and escalation.',
    icon: Shield,
  },
  {
    label: 'Execution workspace',
    value: '8 views',
    desc: 'Briefing, charter, schedule, risk, stakeholders, cost, meetings, deliverables.',
    icon: BarChart2,
  },
]

const CONTROL_AREAS = [
  { label: 'Intake', desc: 'Capture mandate, scope, constraints, stakeholders, and delivery context.', icon: FileText },
  { label: 'Governance', desc: 'Identify decision authority, reporting cadence, and change control needs.', icon: Shield },
  { label: 'Traceability', desc: 'Connect actions, documents, risks, decisions, and delivery artefacts.', icon: GitBranch },
  { label: 'Visibility', desc: 'Prepare executive-readable summaries for delivery oversight.', icon: Users },
]

export function IntakeScreen({ mandate, setMandate, onAnalyze, onLoadDemo, error }: IntakeProps) {
  const upd = (k: keyof MandateInput, v: string) =>
    setMandate(p => ({ ...p, [k]: v }))

  const canSubmit =
    mandate.engagementName.trim() &&
    mandate.client.trim() &&
    mandate.mandate.trim().length > 50

  return (
    <div className="min-h-screen bg-[#060D18] flex flex-col">
      <header className="border-b border-[#1A2840] bg-[#060D18]/95 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div>
          <div className="text-xs font-mono text-amber-500 tracking-widest">STUDIOSIX DELIVERY SYSTEM</div>
          <div className="text-lg font-black text-white tracking-widest font-display">
            PMI PORTAL
          </div>
        </div>
        <div className="text-right text-xs font-mono text-gray-700 leading-relaxed">
          Architecture-led delivery control<br />Mobilisation · Governance · Visibility
        </div>
      </header>

      <main className="flex-1 overflow-y-auto">
        <section className="px-6 py-10 border-b border-[#1A2840] bg-[radial-gradient(circle_at_top_left,#1A2840_0,#060D18_38rem)]">
          <div className="max-w-6xl mx-auto grid grid-cols-1 xl:grid-cols-[1.05fr_0.95fr] gap-8 items-start">
            <div>
              <div className="text-xs font-mono text-amber-500 tracking-widest mb-3">
                DELIVERY MOBILISATION PORTAL
              </div>
              <h1 className="text-5xl md:text-6xl font-black text-white leading-none mb-5 font-display" style={{ letterSpacing: '0.02em' }}>
                Turn architecture intent into delivery execution.
              </h1>
              <p className="text-base text-gray-400 leading-relaxed max-w-2xl">
                PMI Portal connects intake, governance, planning, artefacts, risks, decisions,
                and delivery visibility into one practical execution workspace.
              </p>
              <div className="flex flex-wrap gap-2 mt-6">
                {['Project intake', 'Programme mobilisation', 'Governance checkpoints', 'Executive visibility'].map(t => (
                  <Badge key={t} label={t} variant="amber" />
                ))}
              </div>
            </div>

            <Card accent className="p-5">
              <div className="text-xs font-mono text-amber-500 tracking-widest mb-4">EXECUTIVE SNAPSHOT</div>
              <div className="grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-1 gap-3">
                {SNAPSHOT_CARDS.map(card => {
                  const Icon = card.icon
                  return (
                    <div key={card.label} className="rounded-lg border border-amber-500/15 bg-[#060D18]/60 p-4">
                      <div className="flex items-center justify-between gap-3 mb-2">
                        <div className="text-xs font-mono text-gray-600 uppercase tracking-widest">{card.label}</div>
                        <Icon size={16} className="text-amber-500" />
                      </div>
                      <div className="text-2xl font-black text-white font-display">{card.value}</div>
                      <p className="text-xs text-gray-500 leading-relaxed mt-1">{card.desc}</p>
                    </div>
                  )
                })}
              </div>
            </Card>
          </div>

          <div className="max-w-6xl mx-auto mt-8 rounded-xl border border-[#1A2840] bg-[#0A1523]/70 p-3">
            <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
              {LIFECYCLE.map((step, i) => (
                <div key={step} className="rounded-lg border border-[#1A2840] bg-[#060D18]/60 px-3 py-3">
                  <div className="text-xs font-mono text-amber-500/70 mb-1">{String(i + 1).padStart(2, '0')}</div>
                  <div className="text-sm font-semibold text-gray-200">{step}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 py-8">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-6">
            <aside className="space-y-4">
              <Card className="p-5">
                <div className="text-xs font-mono text-gray-600 tracking-widest uppercase mb-4">Control model</div>
                <div className="space-y-3">
                  {CONTROL_AREAS.map(area => {
                    const Icon = area.icon
                    return (
                      <div key={area.label} className="flex gap-3 rounded-lg border border-[#1A2840]/70 bg-[#060D18]/50 p-3">
                        <Icon size={16} className="text-amber-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="text-sm font-semibold text-white">{area.label}</div>
                          <p className="text-xs text-gray-500 leading-relaxed mt-0.5">{area.desc}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </Card>

              <Card className="p-5">
                <div className="text-xs font-mono text-gray-600 tracking-widest uppercase mb-3">StudioSix / VAF fit</div>
                <p className="text-sm text-gray-400 leading-relaxed">
                  This portal sits after architecture framing and before execution: it translates
                  decisions into mobilisation actions, governance checkpoints, artefact needs,
                  delivery risks, and executive reporting.
                </p>
              </Card>
            </aside>

            <Card className="p-5">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-5">
                <div>
                  <div className="text-xs font-mono text-amber-500 tracking-widest mb-2">MANDATE INTAKE</div>
                  <h2 className="text-3xl font-black text-white leading-none font-display">
                    Mobilise the engagement.
                  </h2>
                </div>
                <div className="text-xs text-gray-600 max-w-xs">
                  Enter only safe demo or non-confidential information in public deployments.
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <FieldInput label="Engagement Name *" value={mandate.engagementName} onChange={v => upd('engagementName', v)} placeholder="e.g. ERP Consolidation Program" />
                  <FieldInput label="Client / Organisation *" value={mandate.client} onChange={v => upd('client', v)} placeholder="e.g. Department of Finance" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <FieldSelect label="Type" value={mandate.type} onChange={v => upd('type', v)}
                    options={[['Project','Project'],['Program','Program'],['Portfolio','Portfolio Component']]} />
                  <FieldSelect label="Budget Scale" value={mandate.budget} onChange={v => upd('budget', v)}
                    options={[['','-- Select --'],['under100k','< $100K'],['100k_1m','$100K - $1M'],['1m_10m','$1M - $10M'],['10m_100m','$10M - $100M'],['100mplus','$100M+']]} />
                  <FieldSelect label="Duration" value={mandate.duration} onChange={v => upd('duration', v)}
                    options={[['','-- Select --'],['under1month','< 1 Month'],['1_6months','1-6 Months'],['6_12months','6-12 Months'],['1_3years','1-3 Years'],['3yrsplus','3+ Years']]} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <FieldSelect label="Sector" value={mandate.sector} onChange={v => upd('sector', v)}
                    options={[['','-- Select --'],['government','Government / Public'],['private','Private'],['nfp','Not-for-Profit'],['mixed','Mixed'],['defence','Defence'],['health','Health'],['finance','Financial Services'],['energy','Energy / Utilities']]} />
                  <FieldSelect label="Start" value={mandate.startType} onChange={v => upd('startType', v)}
                    options={[['Immediate','Immediate'],['Planned','Planned / Defined'],['TBD','TBD']]} />
                  <FieldInput label="Location (or Remote)" value={mandate.location} onChange={v => upd('location', v)} placeholder="City, State" />
                </div>

                <div>
                  <label className="block text-xs font-mono tracking-widest text-gray-600 uppercase mb-1.5">
                    Mandate Description * - paste or describe exactly what was given
                  </label>
                  <textarea
                    rows={8}
                    className="w-full bg-[#060D18] border border-[#1A2840] rounded px-3 py-2.5 text-sm text-white placeholder-gray-700 focus:outline-none focus:border-amber-500/40 transition-colors resize-none leading-relaxed"
                    placeholder="Describe the mandate, architecture intent, business outcome, scope, constraints, stakeholders, timeline, known risks, governance issues, and required delivery outputs."
                    value={mandate.mandate}
                    onChange={e => upd('mandate', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono tracking-widest text-gray-600 uppercase mb-1.5">
                    Additional Context (optional)
                  </label>
                  <textarea
                    rows={3}
                    className="w-full bg-[#060D18] border border-[#1A2840] rounded px-3 py-2.5 text-sm text-white placeholder-gray-700 focus:outline-none focus:border-amber-500/40 transition-colors resize-none leading-relaxed"
                    placeholder="Reporting structure, decision rights, delivery constraints, organisational maturity, architecture dependencies, vendor risks, or political context..."
                    value={mandate.additionalContext}
                    onChange={e => upd('additionalContext', e.target.value)}
                  />
                </div>

                {error && (
                  <div className="border border-red-500/30 rounded p-3 bg-red-500/10 text-xs font-mono text-red-400">
                    {error}
                  </div>
                )}

                <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-1">
                  <button
                    onClick={onAnalyze}
                    disabled={!canSubmit}
                    className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded text-sm font-semibold transition-all ${
                      canSubmit
                        ? 'bg-amber-500 text-black hover:bg-amber-400'
                        : 'bg-[#1A2840] text-gray-600 cursor-not-allowed'
                    }`}
                  >
                    Generate mobilisation brief <ArrowRight size={14} />
                  </button>
                  <button
                    onClick={onLoadDemo}
                    className="px-4 py-2.5 rounded text-sm text-gray-500 border border-[#1A2840] hover:border-amber-500/30 hover:text-amber-400 transition-all"
                  >
                    Load safe demo
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  {['PMBoK 7th Ed.', 'Programme governance', 'Risk and issue awareness', 'Decision traceability'].map(t => (
                    <Badge key={t} label={t} variant="gray" />
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </section>
      </main>
    </div>
  )
}
