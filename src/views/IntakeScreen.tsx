import type { Dispatch, SetStateAction } from 'react'
import { ArrowRight } from 'lucide-react'
import { Badge, Card, FieldInput, FieldSelect } from '@/components/ui'
import type { MandateInput } from '@/types'

interface IntakeProps {
  mandate:    MandateInput
  setMandate: Dispatch<SetStateAction<MandateInput>>
  onAnalyze:  () => void
  onLoadDemo: () => void
  error:      string | null
}

export function IntakeScreen({ mandate, setMandate, onAnalyze, onLoadDemo, error }: IntakeProps) {
  const upd = (k: keyof MandateInput, v: string) =>
    setMandate(p => ({ ...p, [k]: v }))

  const canSubmit =
    mandate.engagementName.trim() &&
    mandate.client.trim() &&
    mandate.mandate.trim().length > 50

  return (
    <div className="min-h-screen bg-[#060D18] flex flex-col">
      <header className="border-b border-[#1A2840] px-6 py-4 flex items-center justify-between">
        <div>
          <div className="text-xs font-mono text-amber-500 tracking-widest">ZENCLOUD CONSULTING</div>
          <div className="text-lg font-black text-white tracking-widest font-display">
            PM · PgM PORTAL
          </div>
        </div>
        <div className="text-right text-xs font-mono text-gray-700 leading-relaxed">
          PMBoK 7th Edition<br />Standard for Program Management 4th Ed.
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-6 py-8 max-w-3xl mx-auto w-full">
        <div className="mb-8">
          <div className="text-xs font-mono text-amber-500 tracking-widest mb-2">DAY 1 MANDATE INTAKE</div>
          <h1 className="text-4xl font-black text-white leading-none mb-3 font-display" style={{ letterSpacing: '0.02em' }}>
            Describe the mandate.<br />Get your exact playbook.
          </h1>
          <p className="text-sm text-gray-500 leading-relaxed max-w-xl">
            Any engagement — project, program, or portfolio component. Any scale — $10K to $500M.
            Input the mandate as given and receive a PMI-certified action plan: exactly what to do,
            what to produce, and how to govern it from Day 1.
          </p>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <FieldInput label="Engagement Name *" value={mandate.engagementName} onChange={v => upd('engagementName', v)} placeholder="e.g. ERP Consolidation Program" />
            <FieldInput label="Client / Organisation *" value={mandate.client} onChange={v => upd('client', v)} placeholder="e.g. Department of Finance" />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <FieldSelect label="Type" value={mandate.type} onChange={v => upd('type', v)}
              options={[['Project','Project'],['Program','Program'],['Portfolio','Portfolio Component']]} />
            <FieldSelect label="Budget Scale" value={mandate.budget} onChange={v => upd('budget', v)}
              options={[['','— Select —'],['under100k','< $100K'],['100k_1m','$100K – $1M'],['1m_10m','$1M – $10M'],['10m_100m','$10M – $100M'],['100mplus','$100M+']]} />
            <FieldSelect label="Duration" value={mandate.duration} onChange={v => upd('duration', v)}
              options={[['','— Select —'],['under1month','< 1 Month'],['1_6months','1–6 Months'],['6_12months','6–12 Months'],['1_3years','1–3 Years'],['3yrsplus','3+ Years']]} />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <FieldSelect label="Sector" value={mandate.sector} onChange={v => upd('sector', v)}
              options={[['','— Select —'],['government','Government / Public'],['private','Private'],['nfp','Not-for-Profit'],['mixed','Mixed'],['defence','Defence'],['health','Health'],['finance','Financial Services'],['energy','Energy / Utilities']]} />
            <FieldSelect label="Start" value={mandate.startType} onChange={v => upd('startType', v)}
              options={[['Immediate','Immediate'],['Planned','Planned / Defined'],['TBD','TBD']]} />
            <FieldInput label="Location (or Remote)" value={mandate.location} onChange={v => upd('location', v)} placeholder="City, State" />
          </div>

          <div>
            <label className="block text-xs font-mono tracking-widest text-gray-600 uppercase mb-1.5">
              Mandate Description * — paste or describe exactly what you were given
            </label>
            <textarea
              rows={8}
              className="w-full bg-[#0A1523] border border-[#1A2840] rounded px-3 py-2.5 text-sm text-white placeholder-gray-700 focus:outline-none focus:border-amber-500/40 transition-colors resize-none leading-relaxed"
              placeholder="Describe the mandate as it was given to you. Include: what the client needs, scope, known constraints, timeline, key stakeholders, red flags, and any specific concerns raised. The more context, the more precise the playbook."
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
              className="w-full bg-[#0A1523] border border-[#1A2840] rounded px-3 py-2.5 text-sm text-white placeholder-gray-700 focus:outline-none focus:border-amber-500/40 transition-colors resize-none leading-relaxed"
              placeholder="Reporting structure, known politics, technical constraints, prior PM history, organisational maturity, delivery environment..."
              value={mandate.additionalContext}
              onChange={e => upd('additionalContext', e.target.value)}
            />
          </div>

          {error && (
            <div className="border border-red-500/30 rounded p-3 bg-red-500/10 text-xs font-mono text-red-400">
              {error}
            </div>
          )}

          <div className="flex items-center gap-3 pt-1">
            <button
              onClick={onAnalyze}
              disabled={!canSubmit}
              className={`flex items-center gap-2 px-5 py-2.5 rounded text-sm font-semibold transition-all ${
                canSubmit
                  ? 'bg-amber-500 text-black hover:bg-amber-400'
                  : 'bg-[#1A2840] text-gray-600 cursor-not-allowed'
              }`}
            >
              Analyze Mandate <ArrowRight size={14} />
            </button>
            <button
              onClick={onLoadDemo}
              className="px-4 py-2.5 rounded text-sm text-gray-500 border border-[#1A2840] hover:border-amber-500/30 hover:text-amber-400 transition-all"
            >
              Load Demo — Volvo
            </button>
          </div>

          <Card className="p-3">
            <div className="text-xs font-mono text-gray-700">
              Framework alignment: PMBoK 7th Ed. (12 Principles · 8 Performance Domains) · Standard for Program Management 4th Ed. · PMI Practice Guides (Agile, Risk, Benefits Realisation, Scheduling) · PMI Code of Ethics and Professional Conduct
            </div>
          </Card>

          <div className="flex flex-wrap gap-2">
            {['PMBoK 7th Ed.', 'Standard for Program Management 4th Ed.', 'PMP · PgMP Framework', 'PMI Practice Guides'].map(t => (
              <Badge key={t} label={t} variant="gray" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
