import { useState } from 'react'
import {
  ArrowRight, RotateCcw, AlertTriangle, Users, FileText,
  Calendar, DollarSign, MessageSquare, Package, MapPin,
  Menu, BookOpen, BarChart2, Shield, Layers, Activity,
} from 'lucide-react'
import { Badge, Card, SectionHead } from '@/components/ui'
import { BUDGET_MAP, DURATION_MAP } from '@/data/constants'
import type { MandateInput, MandateAnalysis } from '@/types'

const TIMING_ORDER = ['Day 1', 'Day 2', 'Days 3-5', 'Week 1', 'Week 2']
const PRIORITY_V: Record<string, 'red' | 'amber' | 'blue'> = { Critical: 'red', High: 'amber', Medium: 'blue' }
const STRAT_V: Record<string, 'red' | 'amber' | 'blue' | 'gray'> = {
  'Manage Closely': 'red', 'Keep Satisfied': 'amber', 'Keep Informed': 'blue', Monitor: 'gray',
}

// ─── WBriefing ────────────────────────────────────────────────────────────────

function WBriefing({ analysis, mandate }: { analysis: MandateAnalysis; mandate: MandateInput }) {
  const day12 = [...(analysis.immediateActions ?? [])]
    .sort((a, b) => TIMING_ORDER.indexOf(a.timing) - TIMING_ORDER.indexOf(b.timing))
    .filter(a => a.timing === 'Day 1' || a.timing === 'Day 2')

  return (
    <div className="space-y-4">
      <SectionHead>Mandate Briefing Summary</SectionHead>
      <Card accent className="p-5">
        <div className="flex flex-wrap gap-2 mb-3">
          <Badge label={analysis.classification} variant="amber" />
          <Badge label={analysis.complexityLevel} variant="gray" />
          <Badge label={`${analysis.lifecycle} Lifecycle`} variant="blue" />
        </div>
        <p className="text-sm text-gray-300 leading-relaxed">{analysis.summary}</p>
      </Card>
      <Card className="p-4">
        <SectionHead>Priority Day 1–2 Actions</SectionHead>
        <div className="space-y-2">
          {day12.map((a, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className={`text-xs font-mono px-2 py-0.5 rounded border flex-shrink-0 mt-0.5 ${
                a.timing === 'Day 1' ? 'border-red-500/40 text-red-400 bg-red-500/10' : 'border-amber-500/40 text-amber-400 bg-amber-500/10'
              }`}>{a.timing}</div>
              <div className="flex-1">
                <div className="text-xs text-gray-300 leading-tight">{a.action}</div>
                {a.basis && <div className="text-xs font-mono text-gray-700 mt-0.5">{a.basis}</div>}
              </div>
              <Badge label={a.priority} variant={PRIORITY_V[a.priority] ?? 'gray'} />
            </div>
          ))}
        </div>
      </Card>
      <Card className="p-4">
        <SectionHead>PMI Tailoring Guidance</SectionHead>
        <p className="text-sm text-gray-400 leading-relaxed">{analysis.tailoring}</p>
        {analysis.programNotes && (
          <div className="mt-4 pt-4 border-t border-[#1A2840]">
            <div className="text-xs font-mono text-amber-500 tracking-widest mb-2">Standard for Program Management — 4th Ed.</div>
            <p className="text-sm text-gray-400 leading-relaxed">{analysis.programNotes}</p>
          </div>
        )}
      </Card>
      {/* suppress unused var warning */}
      <div className="hidden">{mandate.client}</div>
    </div>
  )
}

// ─── WCharter ─────────────────────────────────────────────────────────────────

function WCharter({ mandate, analysis }: { mandate: MandateInput; analysis: MandateAnalysis }) {
  const [fields, setFields] = useState({
    purpose: '', objectives: '', inScope: '', outScope: '',
    constraints: '', assumptions: '', risks: '', authority: '',
  })
  const upd = (k: string, v: string) => setFields(p => ({ ...p, [k]: v }))

  const sections = [
    { k: 'purpose', label: 'Purpose & Justification', ph: 'Why does this engagement exist? What business problem is being solved or value being delivered?' },
    { k: 'objectives', label: 'Objectives (SMART)', ph: 'List measurable objectives. Each must be Specific, Measurable, Achievable, Relevant, Time-bound.' },
    { k: 'inScope', label: 'In Scope', ph: 'What is explicitly within the scope of this engagement...' },
    { k: 'outScope', label: 'Out of Scope', ph: 'What is explicitly excluded from this engagement...' },
    { k: 'constraints', label: 'Constraints', ph: 'Budget, timeline, resource, regulatory, technical, and organisational constraints...' },
    { k: 'assumptions', label: 'Assumptions', ph: 'What is assumed to be true for this engagement to be viable...' },
    { k: 'risks', label: 'High-Level Risks (Summary)', ph: `Seed from mandate analysis: ${(analysis.riskCategories ?? []).slice(0, 4).join(', ')}...` },
    { k: 'authority', label: 'PM Authority', ph: 'What authority does the PM hold? What requires escalation? Who is the accountable sponsor?' },
  ]

  return (
    <div className="space-y-3">
      <SectionHead>Project / Program Charter — {mandate.client}</SectionHead>
      <div className="grid grid-cols-2 gap-3 mb-1">
        {[
          ['Client', mandate.client],
          ['Classification', `${analysis.classification} · ${analysis.complexityLevel}`],
          ['Lifecycle', analysis.lifecycle],
          ['Location', mandate.location || 'TBC'],
          ['Scale', BUDGET_MAP[mandate.budget] || 'TBC'],
          ['Duration', DURATION_MAP[mandate.duration] || 'TBC'],
        ].map(([l, v]) => (
          <div key={l} className="border border-[#1A2840] rounded p-3 bg-[#0A1523]/60">
            <div className="text-xs font-mono text-gray-700 mb-0.5">{l?.toUpperCase()}</div>
            <div className="text-xs text-gray-300">{v}</div>
          </div>
        ))}
      </div>
      {sections.map(s => (
        <div key={s.k} className="border border-[#1A2840] rounded-lg overflow-hidden bg-[#0A1523]/80">
          <div className="px-4 py-2 border-b border-[#1A2840] bg-[#1A2840]/30">
            <span className="text-xs font-mono text-amber-500 tracking-wider">{s.label.toUpperCase()}</span>
          </div>
          <textarea
            rows={4}
            className="w-full bg-transparent px-4 py-3 text-sm text-gray-300 placeholder-gray-700 focus:outline-none resize-none leading-relaxed"
            placeholder={s.ph}
            value={(fields as Record<string, string>)[s.k]}
            onChange={e => upd(s.k, e.target.value)}
          />
        </div>
      ))}
      <Card accent className="p-5">
        <SectionHead>Approval & Sign-Off</SectionHead>
        <div className="grid grid-cols-2 gap-6">
          {['Sponsor / Client Representative', `Project ${analysis.classification === 'Program' ? '/ Program ' : ''}Manager`].map(r => (
            <div key={r}>
              <div className="text-xs text-gray-600 mb-1">{r}</div>
              <div className="border-b border-dashed border-gray-700 h-8" />
              <div className="text-xs text-gray-800 mt-1">Signature · Date</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

// ─── WSchedule ────────────────────────────────────────────────────────────────

function WSchedule({ analysis }: { analysis: MandateAnalysis }) {
  const phases = [
    { phase: 'Initiating', color: '#E8A020' },
    { phase: 'Planning',   color: '#3B82F6' },
    { phase: 'Executing',  color: '#10B981' },
    { phase: 'M&C',        color: '#8B5CF6' },
    { phase: 'Closing',    color: '#EF4444' },
  ]
  const criticals = [...(analysis.immediateActions ?? [])]
    .sort((a, b) => TIMING_ORDER.indexOf(a.timing) - TIMING_ORDER.indexOf(b.timing))
    .filter(a => a.priority === 'Critical')

  return (
    <div className="space-y-4">
      <SectionHead>Schedule — PMBoK Planning Performance Domain</SectionHead>
      <Card className="p-4">
        <SectionHead>Process Group Framework — {analysis.lifecycle} Lifecycle</SectionHead>
        <div className="flex gap-1 mb-3">
          {phases.map(p => (
            <div key={p.phase} style={{ flex: 1, background: p.color + '20', borderColor: p.color + '50' }} className="border rounded p-2 text-center">
              <div className="text-xs font-mono font-bold" style={{ color: p.color }}>{p.phase}</div>
            </div>
          ))}
        </div>
        <div className="text-xs text-gray-600 leading-relaxed">
          Build the detailed schedule in your scheduling tool (MS Project, Smartsheet, P6) per the Planning Performance Domain.
          Apply {analysis.lifecycle === 'Predictive'
            ? 'work packages and activity decomposition (WBS → activities → schedule)'
            : analysis.lifecycle === 'Adaptive'
            ? 'sprint/iteration planning with a release roadmap'
            : 'phase-gate milestones with rolling wave planning within each phase'}.
        </div>
      </Card>
      <Card className="p-4">
        <SectionHead>Critical Milestones — Seed These First</SectionHead>
        <div className="space-y-2">
          {criticals.map((a, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
              <span className="text-xs text-gray-400 flex-1 leading-tight">{a.action}</span>
              <span className="text-xs font-mono text-gray-600">{a.timing}</span>
            </div>
          ))}
        </div>
      </Card>
      <Card className="p-4">
        <SectionHead>Required Document Schedule</SectionHead>
        <div className="space-y-1.5">
          {(analysis.requiredDocuments ?? []).map((d, i) => (
            <div key={i} className="flex items-center gap-3 border border-[#1A2840]/40 rounded p-2.5">
              <FileText size={10} className="text-gray-700 flex-shrink-0" />
              <span className="text-xs text-gray-400 flex-1">{d.document}</span>
              <span className="text-xs font-mono text-gray-600">{d.due}</span>
              <Badge label={d.priority} variant={PRIORITY_V[d.priority] ?? 'gray'} />
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

// ─── WStakeholders ────────────────────────────────────────────────────────────

function WStakeholders({ analysis }: { analysis: MandateAnalysis }) {
  const [rows, setRows] = useState(
    (analysis.stakeholderGroups ?? []).map((sg, i) => ({
      id: i + 1, name: '', group: sg.group, strategy: sg.strategy,
      influence: '', interest: '', engagement: '', notes: '',
    }))
  )
  const upd = (id: number, k: string, v: string) =>
    setRows(p => p.map(r => r.id === id ? { ...r, [k]: v } : r))

  const quadrants = [
    { label: 'HIGH INFLUENCE · HIGH INTEREST', strategy: 'Manage Closely' },
    { label: 'HIGH INFLUENCE · LOW INTEREST',  strategy: 'Keep Satisfied' },
    { label: 'LOW INFLUENCE · HIGH INTEREST',  strategy: 'Keep Informed' },
    { label: 'LOW INFLUENCE · LOW INTEREST',   strategy: 'Monitor' },
  ]

  return (
    <div className="space-y-4">
      <SectionHead>Stakeholder Register — PMBoK Stakeholders Performance Domain</SectionHead>
      <div className="grid grid-cols-2 gap-1 border border-[#1A2840] rounded-lg overflow-hidden bg-[#0A1523]/80">
        {quadrants.map(q => (
          <div key={q.label} className="border border-[#1A2840] p-3 bg-[#080F1A]/60">
            <div className="text-xs font-mono text-gray-600 mb-1">{q.label}</div>
            <div className="text-xs text-amber-400 mb-2">→ {q.strategy}</div>
            {rows.filter(r => r.strategy === q.strategy).map(r => (
              <div key={r.id} className="text-xs text-gray-500">{r.name || r.group}</div>
            ))}
          </div>
        ))}
      </div>
      {rows.map(r => (
        <Card key={r.id} className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Users size={12} className="text-gray-600" />
              <span className="text-xs font-mono text-blue-400">{r.group}</span>
            </div>
            <Badge label={r.strategy} variant={STRAT_V[r.strategy] ?? 'gray'} />
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              { k: 'name',       label: 'Name / Role',    ph: 'Person name or role title' },
              { k: 'influence',  label: 'Influence',       ph: 'High / Medium / Low' },
              { k: 'interest',   label: 'Interest',        ph: 'High / Medium / Low' },
              { k: 'engagement', label: 'Current Stance',  ph: 'Supportive / Neutral / Resistant' },
            ].map(f => (
              <div key={f.k}>
                <div className="text-xs font-mono text-gray-700 mb-1">{f.label.toUpperCase()}</div>
                <input
                  className="w-full bg-[#080F1A] border border-[#1A2840] rounded px-2 py-1.5 text-xs text-gray-300 focus:outline-none"
                  placeholder={f.ph}
                  value={(r as unknown as Record<string, string>)[f.k]}
                  onChange={e => upd(r.id, f.k, e.target.value)}
                />
              </div>
            ))}
          </div>
        </Card>
      ))}
      <button
        onClick={() => setRows(p => [...p, { id: Date.now(), name: '', group: 'New Stakeholder Group', strategy: 'Monitor', influence: '', interest: '', engagement: '', notes: '' }])}
        className="w-full border border-dashed border-[#1A2840] hover:border-blue-500/30 rounded p-3 text-xs font-mono text-gray-600 hover:text-blue-400 transition-all"
      >
        + Add Stakeholder Group
      </button>
    </div>
  )
}

// ─── WRisks ───────────────────────────────────────────────────────────────────

function WRisks({ analysis }: { analysis: MandateAnalysis }) {
  const [risks, setRisks] = useState(
    (analysis.riskCategories ?? []).map((cat, i) => ({
      id: i + 1, category: cat, description: '', probability: '',
      impact: '', score: '', mitigation: '', status: 'Open',
    }))
  )
  const upd = (id: number, k: string, v: string) =>
    setRisks(p => p.map(r => r.id === id ? { ...r, [k]: v } : r))

  const scoreColor: Record<string, string> = {
    Critical: '#EF4444', High: '#F97316', Medium: '#EAB308', Low: '#22C55E',
  }

  return (
    <div className="space-y-4">
      <SectionHead>Risk Register — PMBoK Uncertainty Performance Domain</SectionHead>
      <div className="grid grid-cols-4 gap-3">
        {['Critical', 'High', 'Medium', 'Low'].map(s => (
          <Card key={s} className="p-3 text-center">
            <div className="text-xs font-mono text-gray-700 mb-1">{s.toUpperCase()}</div>
            <div className="text-2xl font-bold font-mono" style={{ color: scoreColor[s] }}>
              {risks.filter(r => r.score === s).length}
            </div>
          </Card>
        ))}
      </div>
      {risks.map(r => (
        <Card key={r.id} className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={12} className="text-amber-500/60" />
            <span className="text-xs font-mono text-amber-500">{r.category}</span>
            {r.score && <Badge label={r.score} variant={{ Critical: 'red', High: 'amber', Medium: 'blue', Low: 'green' }[r.score] as 'red' | 'amber' | 'blue' | 'green' ?? 'gray'} />}
          </div>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <div className="text-xs font-mono text-gray-700 mb-1">RISK DESCRIPTION</div>
              <textarea rows={2} className="w-full bg-[#080F1A] border border-[#1A2840] rounded px-2 py-1.5 text-xs text-gray-300 focus:outline-none resize-none"
                placeholder="Specific risk event and impact..." value={r.description} onChange={e => upd(r.id, 'description', e.target.value)} />
            </div>
            <div>
              <div className="text-xs font-mono text-gray-700 mb-1">MITIGATION / RESPONSE</div>
              <textarea rows={2} className="w-full bg-[#080F1A] border border-[#1A2840] rounded px-2 py-1.5 text-xs text-gray-300 focus:outline-none resize-none"
                placeholder="Response strategy and owner..." value={r.mitigation} onChange={e => upd(r.id, 'mitigation', e.target.value)} />
            </div>
          </div>
          <div className="flex gap-2">
            {[
              { k: 'probability', opts: ['', 'Low', 'Medium', 'High'] },
              { k: 'impact',      opts: ['', 'Low', 'Medium', 'High'] },
              { k: 'score',       opts: ['', 'Low', 'Medium', 'High', 'Critical'] },
              { k: 'status',      opts: ['Open', 'In Progress', 'Closed'] },
            ].map(f => (
              <div key={f.k} className="flex-1">
                <div className="text-xs font-mono text-gray-700 mb-1">{f.k.toUpperCase()}</div>
                <select
                  className="w-full bg-[#080F1A] border border-[#1A2840] rounded px-2 py-1 text-xs text-gray-400 focus:outline-none"
                  value={(r as unknown as Record<string, string>)[f.k]}
                  onChange={e => upd(r.id, f.k, e.target.value)}
                >
                  {f.opts.map(o => <option key={o} value={o}>{o || '— Select'}</option>)}
                </select>
              </div>
            ))}
          </div>
        </Card>
      ))}
      <button
        onClick={() => setRisks(p => [...p, { id: Date.now(), category: 'New Risk Category', description: '', probability: '', impact: '', score: '', mitigation: '', status: 'Open' }])}
        className="w-full border border-dashed border-[#1A2840] hover:border-amber-500/30 rounded p-3 text-xs font-mono text-gray-600 hover:text-amber-500 transition-all"
      >
        + Add Risk
      </button>
    </div>
  )
}

// ─── WBudget ──────────────────────────────────────────────────────────────────

function WBudget({ mandate, analysis }: { mandate: MandateInput; analysis: MandateAnalysis }) {
  return (
    <div className="space-y-4">
      <SectionHead>Cost Management — PMBoK Planning Knowledge Area</SectionHead>
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Budget Scale', value: BUDGET_MAP[mandate.budget] || 'TBC' },
          { label: 'Duration',     value: DURATION_MAP[mandate.duration] || 'TBC' },
          { label: 'Lifecycle',    value: analysis.lifecycle },
        ].map(c => (
          <Card key={c.label} accent className="p-4">
            <div className="text-xs font-mono text-gray-600 mb-1">{c.label.toUpperCase()}</div>
            <div className="text-xl font-bold font-mono text-amber-400">{c.value}</div>
          </Card>
        ))}
      </div>
      <Card className="p-4">
        <SectionHead>Cost Management Approach</SectionHead>
        <div className="space-y-3 text-xs text-gray-400 leading-relaxed">
          <p><span className="text-gray-300 font-medium">Plan Cost Management:</span> Define methodology, units of measure, control thresholds, EVM rules, and reporting format. Document in Cost Management Plan.</p>
          <p><span className="text-gray-300 font-medium">Estimate Costs:</span> Apply {analysis.complexityLevel === 'Simple' ? 'analogous or parametric' : 'bottom-up'} estimation. Document assumptions and basis of estimate.</p>
          <p><span className="text-gray-300 font-medium">Determine Budget:</span> Aggregate cost estimates → cost baseline (PMB). Add management reserve above baseline. Establish change control thresholds per {analysis.governance?.model}.</p>
          <p><span className="text-gray-300 font-medium">Control Costs:</span> Apply {analysis.complexityLevel === 'Highly Complex' || analysis.complexityLevel === 'Complex' ? 'full Earned Value Management (SPI, CPI, EAC, ETC, VAC)' : 'budget vs actuals tracking with variance analysis'}. Report per {analysis.governance?.reporting}.</p>
        </div>
      </Card>
      <Card className="p-4">
        <SectionHead>Change Control — Cost Thresholds (Define on Day 1)</SectionHead>
        <div className="grid grid-cols-3 gap-3">
          {[
            { tier: 'PM Authority',    desc: 'Approve without escalation', ph: 'e.g. < 5% variance or < $X' },
            { tier: 'Sponsor Approval',desc: 'Requires sponsor sign-off',  ph: 'e.g. 5–15% variance' },
            { tier: 'Steering / Board',desc: 'Full governance review',      ph: 'e.g. > 15% or > $X' },
          ].map(t => (
            <div key={t.tier} className="border border-[#1A2840] rounded p-3">
              <div className="text-xs font-mono text-amber-500 mb-0.5">{t.tier.toUpperCase()}</div>
              <div className="text-xs text-gray-600 mb-2">{t.desc}</div>
              <input className="w-full bg-[#080F1A] border border-[#1A2840] rounded px-2 py-1 text-xs text-gray-400 focus:outline-none" placeholder={t.ph} />
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

// ─── WMeetings ────────────────────────────────────────────────────────────────

function WMeetings({ analysis }: { analysis: MandateAnalysis }) {
  const cadence = [
    { name: 'Kick-Off',             freq: 'Once — Week 1',                          desc: 'All stakeholders · Charter briefing · Mandate alignment · Governance establishment' },
    { name: 'Daily Standup',        freq: 'Daily · 08:00',                          desc: 'Core team · Status, blockers, decisions, actions' },
    { name: 'Sponsor Status Report',freq: analysis.governance?.reporting || 'Weekly',desc: `${analysis.governance?.model || 'Sponsor'} · Progress, risks, issues, decisions required` },
    { name: 'Risk Review',          freq: 'Fortnightly',                            desc: 'PM + leads · Risk register walk-through · Update scores and mitigations' },
    { name: analysis.classification === 'Program' ? 'Governance Board' : 'Steering Review', freq: analysis.classification === 'Program' ? 'Monthly' : 'As required', desc: `${analysis.governance?.model} · Escalation decisions · Change requests · Budget approvals` },
    { name: 'Go/No-Go Gate Reviews',freq: 'Per milestone',                          desc: 'PM + sponsor · Gate criteria met? · Proceed, pause, or re-plan' },
    { name: 'Lessons Learned',      freq: 'At closure',                             desc: 'All stakeholders · Knowledge capture · Continuous improvement register' },
  ]

  return (
    <div className="space-y-4">
      <SectionHead>Meeting Management — PMBoK Communications Performance Domain</SectionHead>
      <Card className="p-4">
        <SectionHead>Standing Cadence</SectionHead>
        <div className="space-y-2">
          {cadence.map((m, i) => (
            <div key={i} className="flex items-start gap-3 border border-[#1A2840]/50 rounded p-3 hover:bg-[#1A2840]/20 transition-colors">
              <MessageSquare size={12} className="text-amber-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="text-xs text-white font-medium">{m.name}</div>
                <div className="text-xs text-gray-600 leading-tight">{m.desc}</div>
              </div>
              <span className="text-xs font-mono text-gray-600 flex-shrink-0">{m.freq}</span>
            </div>
          ))}
        </div>
      </Card>
      <Card className="p-4">
        <SectionHead>Communications Matrix — Define Day 1</SectionHead>
        <div className="grid grid-cols-4 border-b border-[#1A2840] pb-2 mb-2 text-xs font-mono text-gray-600">
          {['Stakeholder / Group', 'Information Need', 'Method', 'Frequency'].map(h => <div key={h}>{h.toUpperCase()}</div>)}
        </div>
        {(analysis.stakeholderGroups ?? []).map((sg, i) => (
          <div key={i} className="grid grid-cols-4 gap-2 mb-2">
            <div className="text-xs text-gray-400">{sg.group}</div>
            <input className="bg-[#080F1A] border border-[#1A2840] rounded px-2 py-1 text-xs text-gray-400 focus:outline-none" placeholder="What they need..." />
            <input className="bg-[#080F1A] border border-[#1A2840] rounded px-2 py-1 text-xs text-gray-400 focus:outline-none" placeholder="Email / Meeting / Report..." />
            <input className="bg-[#080F1A] border border-[#1A2840] rounded px-2 py-1 text-xs text-gray-400 focus:outline-none" placeholder="Weekly / Monthly..." />
          </div>
        ))}
      </Card>
    </div>
  )
}

// ─── WDeliverables ────────────────────────────────────────────────────────────

function WDeliverables({ analysis }: { analysis: MandateAnalysis }) {
  const [rows, setRows] = useState(
    (analysis.requiredDocuments ?? []).map((d, i) => ({
      id: i + 1, name: d.document, due: d.due, priority: d.priority, owner: '', status: 'Not Started',
    }))
  )
  const upd = (id: number, k: string, v: string) =>
    setRows(p => p.map(r => r.id === id ? { ...r, [k]: v } : r))

  return (
    <div className="space-y-4">
      <SectionHead>Deliverables Register — {rows.length} Items</SectionHead>
      <Card className="overflow-hidden">
        <div className="grid grid-cols-5 border-b border-[#1A2840] bg-[#1A2840]/40 text-xs font-mono text-gray-600 tracking-wider">
          {['Document', 'Due', 'Owner', 'Priority', 'Status'].map(h => <div key={h} className="p-3">{h.toUpperCase()}</div>)}
        </div>
        {rows.map((r, i) => (
          <div key={r.id} className={`grid grid-cols-5 border-b border-[#1A2840]/40 hover:bg-[#1A2840]/20 transition-colors ${i % 2 ? 'bg-[#1A2840]/10' : ''}`}>
            <div className="p-3 text-xs text-gray-300 leading-tight">{r.name}</div>
            <div className="p-3 text-xs font-mono text-gray-600">{r.due}</div>
            <div className="p-3">
              <input className="w-full bg-transparent text-xs text-gray-400 focus:outline-none border-b border-[#1A2840] pb-0.5"
                placeholder="Assign..." value={r.owner} onChange={e => upd(r.id, 'owner', e.target.value)} />
            </div>
            <div className="p-3"><Badge label={r.priority} variant={PRIORITY_V[r.priority] ?? 'gray'} /></div>
            <div className="p-3">
              <select className="bg-transparent text-xs text-gray-500 focus:outline-none w-full"
                value={r.status} onChange={e => upd(r.id, 'status', e.target.value)}>
                {['Not Started', 'In Progress', 'In Review', 'Complete'].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        ))}
      </Card>
      <div className="flex justify-between text-xs font-mono text-gray-700 px-1">
        <span>Complete: {rows.filter(r => r.status === 'Complete').length} / {rows.length}</span>
        <span>In Progress: {rows.filter(r => r.status === 'In Progress').length}</span>
        <span>Not Started: {rows.filter(r => r.status === 'Not Started').length}</span>
      </div>
    </div>
  )
}

// ─── Domain icon helper ───────────────────────────────────────────────────────

function domainIcon(d = '') {
  if (d.includes('Stakeholder') || d.includes('Team')) return Users
  if (d.includes('Planning')) return Calendar
  if (d.includes('Delivery') || d.includes('Work')) return Package
  if (d.includes('Measurement')) return BarChart2
  if (d.includes('Uncertainty')) return Shield
  if (d.includes('Development')) return Layers
  return Activity
}

// suppress unused import warning
const _icons = { domainIcon }
void _icons

// ─── Workspace Shell ──────────────────────────────────────────────────────────

const VIEWS = [
  { id: 'briefing',      label: 'Briefing',      icon: BookOpen },
  { id: 'charter',       label: 'Charter',        icon: FileText },
  { id: 'schedule',      label: 'Schedule',       icon: Calendar },
  { id: 'stakeholders',  label: 'Stakeholders',   icon: Users },
  { id: 'risks',         label: 'Risk Register',  icon: AlertTriangle },
  { id: 'budget',        label: 'Cost & Budget',  icon: DollarSign },
  { id: 'meetings',      label: 'Meetings',       icon: MessageSquare },
  { id: 'deliverables',  label: 'Deliverables',   icon: Package },
]

interface WorkspaceProps {
  mandate:  MandateInput
  analysis: MandateAnalysis
  onReset:  () => void
}

export function Workspace({ mandate, analysis, onReset }: WorkspaceProps) {
  const [view, setView]       = useState('briefing')
  const [sidebar, setSidebar] = useState(true)
  const current = VIEWS.find(v => v.id === view)

  const renderView = () => {
    switch (view) {
      case 'briefing':     return <WBriefing analysis={analysis} mandate={mandate} />
      case 'charter':      return <WCharter mandate={mandate} analysis={analysis} />
      case 'schedule':     return <WSchedule analysis={analysis} />
      case 'stakeholders': return <WStakeholders analysis={analysis} />
      case 'risks':        return <WRisks analysis={analysis} />
      case 'budget':       return <WBudget mandate={mandate} analysis={analysis} />
      case 'meetings':     return <WMeetings analysis={analysis} />
      case 'deliverables': return <WDeliverables analysis={analysis} />
      default:             return null
    }
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#060D18] text-gray-300">
      {sidebar && (
        <aside className="w-52 flex-shrink-0 border-r border-[#1A2840] flex flex-col bg-[#060D18]">
          <div className="p-4 border-b border-[#1A2840]">
            <div className="text-xs font-mono text-amber-500 tracking-widest">ZENCLOUD</div>
            <div className="text-sm font-black text-white tracking-widest font-display">PM · PgM PORTAL</div>
          </div>
          <div className="p-3 border-b border-[#1A2840] bg-amber-500/5">
            <div className="text-xs font-mono text-amber-500 truncate">{mandate.client}</div>
            <div className="text-xs text-gray-500 truncate mt-0.5 leading-tight">{mandate.engagementName}</div>
            <div className="flex items-center gap-1.5 mt-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-xs font-mono text-amber-500">{analysis.classification}</span>
            </div>
          </div>
          <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
            {VIEWS.map(v => {
              const Icon = v.icon
              const active = view === v.id
              return (
                <button key={v.id} onClick={() => setView(v.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded text-left text-xs border transition-all ${
                    active ? 'bg-amber-500/15 text-amber-400 border-amber-500/25' : 'text-gray-500 hover:text-gray-300 hover:bg-[#1A2840]/50 border-transparent'
                  }`}>
                  <Icon size={13} /> {v.label}
                </button>
              )
            })}
          </nav>
          <div className="p-3 border-t border-[#1A2840]">
            <button onClick={onReset} className="text-xs font-mono text-gray-700 hover:text-gray-500 transition-colors flex items-center gap-1">
              <RotateCcw size={10} /> New Mandate
            </button>
          </div>
        </aside>
      )}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="flex items-center gap-3 px-4 py-2.5 border-b border-[#1A2840] flex-shrink-0">
          <button onClick={() => setSidebar(!sidebar)} className="text-gray-600 hover:text-gray-300 transition-colors">
            <Menu size={15} />
          </button>
          <span className="text-sm font-medium text-white flex-1">{current?.label}</span>
          <div className="flex items-center gap-2">
            {mandate.location && (
              <span className="text-xs font-mono text-gray-700">
                <MapPin size={10} className="inline mr-1" />{mandate.location}
              </span>
            )}
            <Badge label={analysis.classification} variant="amber" />
            <Badge label={analysis.complexityLevel} variant="gray" />
          </div>
          <button onClick={onReset} className="text-xs font-mono text-gray-700 hover:text-gray-400 transition-colors flex items-center gap-1">
            <ArrowRight size={10} className="rotate-180" /> Exit
          </button>
        </header>
        <main className="flex-1 overflow-y-auto p-4">{renderView()}</main>
      </div>
    </div>
  )
}
