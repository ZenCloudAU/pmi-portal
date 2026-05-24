import {
  ArrowRight, RotateCcw, AlertTriangle, Users, Activity,
  Shield, BarChart2, Layers, FileText, Calendar, Package, Target,
} from 'lucide-react'
import { Badge, Card, SectionHead } from '@/components/ui'
import type { MandateInput, MandateAnalysis } from '@/types'

const TIMING_ORDER = ['Day 1', 'Day 2', 'Days 3-5', 'Week 1', 'Week 2']

const COMPLEX_VARIANT: Record<string, 'green' | 'blue' | 'amber' | 'red'> = {
  Simple: 'green', Moderate: 'blue', Complex: 'amber', 'Highly Complex': 'red',
}
const LIFECYCLE_VARIANT: Record<string, 'blue' | 'green' | 'purple'> = {
  Predictive: 'blue', Adaptive: 'green', Hybrid: 'purple',
}
const PRIORITY_VARIANT: Record<string, 'red' | 'amber' | 'blue'> = {
  Critical: 'red', High: 'amber', Medium: 'blue',
}
const STRATEGY_VARIANT: Record<string, 'red' | 'amber' | 'blue' | 'gray'> = {
  'Manage Closely': 'red', 'Keep Satisfied': 'amber', 'Keep Informed': 'blue', Monitor: 'gray',
}

function domainIcon(d = '') {
  if (d.includes('Stakeholder') || d.includes('Team')) return Users
  if (d.includes('Planning')) return Calendar
  if (d.includes('Delivery') || d.includes('Work')) return Package
  if (d.includes('Measurement')) return BarChart2
  if (d.includes('Uncertainty')) return Shield
  if (d.includes('Development')) return Layers
  return Activity
}

interface BriefingProps {
  mandate:          MandateInput
  analysis:         MandateAnalysis
  onEnterWorkspace: () => void
  onReset:          () => void
}

export function BriefingRoom({ mandate, analysis, onEnterWorkspace, onReset }: BriefingProps) {
  const sorted = [...(analysis.immediateActions ?? [])].sort(
    (a, b) => TIMING_ORDER.indexOf(a.timing) - TIMING_ORDER.indexOf(b.timing)
  )

  return (
    <div className="min-h-screen bg-[#060D18] flex flex-col">
      <header className="border-b border-[#1A2840] px-6 py-3.5 flex items-center gap-4 flex-shrink-0">
        <div className="flex-1">
          <div className="text-xs font-mono text-amber-500 tracking-widest">DELIVERY MOBILISATION BRIEF</div>
          <div className="text-sm font-bold text-white font-display" style={{ letterSpacing: '0.04em' }}>
            {mandate.engagementName}
          </div>
        </div>
        <button onClick={onReset} className="text-xs font-mono text-gray-700 hover:text-gray-400 transition-colors flex items-center gap-1">
          <RotateCcw size={10} /> New Mandate
        </button>
        <button onClick={onEnterWorkspace} className="flex items-center gap-2 px-4 py-2 rounded text-sm font-semibold bg-amber-500 text-black hover:bg-amber-400 transition-all">
          Open Workspace <ArrowRight size={13} />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto px-6 py-6 max-w-4xl mx-auto w-full space-y-4">

        {/* Classification */}
        <Card accent className="p-5">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div>
              <div className="text-xs font-mono text-amber-500 tracking-widest mb-1">
                {mandate.client} · {mandate.location || 'Location TBC'}
              </div>
              <div className="text-xl font-black text-white leading-none font-display">
                {analysis.classification?.toUpperCase()} — {analysis.complexityLevel?.toUpperCase()} COMPLEXITY
              </div>
            </div>
            <div className="flex flex-wrap gap-2 flex-shrink-0">
              <Badge label={analysis.classification} variant="amber" />
              <Badge label={analysis.complexityLevel} variant={COMPLEX_VARIANT[analysis.complexityLevel] ?? 'gray'} />
              <Badge label={`${analysis.lifecycle} Lifecycle`} variant={LIFECYCLE_VARIANT[analysis.lifecycle] ?? 'blue'} />
            </div>
          </div>
          <p className="text-sm text-gray-300 leading-relaxed">{analysis.summary}</p>
        </Card>

        {/* Day 1 Action Plan */}
        <Card>
          <div className="px-5 py-3 border-b border-[#1A2840] flex items-center gap-2">
            <Target size={13} className="text-amber-500" />
              <div className="text-xs font-mono text-amber-500 tracking-widest">MOBILISATION ACTION PLAN — DAY 1 TO WEEK 2</div>
          </div>
          <div className="divide-y divide-[#1A2840]/50">
            {sorted.map((a, i) => (
              <div key={i} className="flex items-start gap-4 px-5 py-3.5 hover:bg-[#1A2840]/20 transition-colors">
                <div className={`text-xs font-mono px-2 py-0.5 rounded border flex-shrink-0 mt-0.5 ${
                  a.timing === 'Day 1' ? 'border-red-500/40 text-red-400 bg-red-500/10' :
                  a.timing === 'Day 2' ? 'border-amber-500/40 text-amber-400 bg-amber-500/10' :
                  'border-blue-500/30 text-blue-400 bg-blue-500/10'
                }`}>
                  {a.timing}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-white leading-snug">{a.action}</div>
                  {a.basis && <div className="text-xs font-mono text-gray-700 mt-0.5">{a.basis}</div>}
                </div>
                <Badge label={a.priority} variant={PRIORITY_VARIANT[a.priority] ?? 'gray'} />
              </div>
            ))}
          </div>
        </Card>

        {/* Domains + Documents */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <div className="px-4 py-3 border-b border-[#1A2840]">
              <div className="text-xs font-mono text-gray-600 tracking-widest">PMBoK 7th — PERFORMANCE DOMAINS</div>
            </div>
            <div className="p-4 space-y-2">
              {(analysis.performanceDomains ?? []).map((pd, i) => {
                const Icon = domainIcon(pd.domain)
                return (
                  <div key={i} className="flex items-center gap-3">
                    <Icon size={11} className={pd.priority === 'High' ? 'text-amber-400' : pd.priority === 'Medium' ? 'text-blue-400' : 'text-gray-700'} />
                    <span className={`text-xs flex-1 ${pd.priority === 'High' ? 'text-gray-200' : pd.priority === 'Medium' ? 'text-gray-400' : 'text-gray-600'}`}>
                      {pd.domain}
                    </span>
                    <Badge label={pd.priority} variant={pd.priority === 'High' ? 'amber' : pd.priority === 'Medium' ? 'blue' : 'gray'} />
                  </div>
                )
              })}
            </div>
          </Card>

          <Card>
            <div className="px-4 py-3 border-b border-[#1A2840]">
              <div className="text-xs font-mono text-gray-600 tracking-widest">REQUIRED DOCUMENTS</div>
            </div>
            <div className="divide-y divide-[#1A2840]/40">
              {(analysis.requiredDocuments ?? []).map((d, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-2.5">
                  <FileText size={10} className="text-gray-700 flex-shrink-0" />
                  <span className="text-xs text-gray-300 flex-1 leading-tight">{d.document}</span>
                  <span className="text-xs font-mono text-gray-600 flex-shrink-0">{d.due}</span>
                  <Badge label={d.priority} variant={PRIORITY_VARIANT[d.priority] ?? 'gray'} />
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Governance */}
        {analysis.governance && (
          <Card className="p-5">
            <SectionHead>Governance Framework — {analysis.governance.model}</SectionHead>
            <div className="grid grid-cols-2 gap-4">
              {[
                ['Decision Authority', analysis.governance.decisionAuthority],
                ['Reporting Cadence', analysis.governance.reporting],
                ['Change Control', analysis.governance.changeControl],
                ['Model', analysis.governance.model],
              ].map(([k, v]) => (
                <div key={k}>
                  <div className="text-xs font-mono text-gray-700 mb-0.5">{k?.toUpperCase()}</div>
                  <div className="text-xs text-gray-300 leading-relaxed">{v}</div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Stakeholders + Risks */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-4">
            <SectionHead>Stakeholder Engagement Map</SectionHead>
            <div className="space-y-2">
              {(analysis.stakeholderGroups ?? []).map((sg, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Users size={10} className="text-gray-700 flex-shrink-0" />
                  <span className="text-xs text-gray-300 flex-1">{sg.group}</span>
                  <Badge label={sg.strategy} variant={STRATEGY_VARIANT[sg.strategy] ?? 'gray'} />
                </div>
              ))}
            </div>
          </Card>
          <Card className="p-4">
            <SectionHead>Risk Categories — Seed These Immediately</SectionHead>
            <div className="space-y-1.5">
              {(analysis.riskCategories ?? []).map((r, i) => (
                <div key={i} className="flex items-center gap-2">
                  <AlertTriangle size={10} className="text-amber-500/50 flex-shrink-0" />
                  <span className="text-xs text-gray-400">{r}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Tailoring */}
        <Card className="p-5">
          <SectionHead>Delivery Tailoring Guidance</SectionHead>
          <p className="text-sm text-gray-300 leading-relaxed">{analysis.tailoring}</p>
          {analysis.programNotes && (
            <div className="mt-4 border-t border-[#1A2840] pt-4">
              <div className="text-xs font-mono text-amber-500 tracking-widest mb-2">Programme Governance Notes</div>
              <p className="text-sm text-gray-300 leading-relaxed">{analysis.programNotes}</p>
            </div>
          )}
        </Card>

        {/* Principles */}
        {(analysis.principles?.length ?? 0) > 0 && (
          <Card className="p-4">
            <SectionHead>PMBoK 7th — Active Principles</SectionHead>
            <div className="flex flex-wrap gap-2">
              {analysis.principles.map((p, i) => (
                <span key={i} className="text-xs px-2.5 py-1 rounded border border-[#1A2840] text-gray-500">{p}</span>
              ))}
            </div>
          </Card>
        )}

        {/* CTA */}
        <Card accent className="p-5 flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold text-white">Ready to build the working environment?</div>
            <div className="text-xs text-gray-500 mt-0.5">Charter · Schedule · Stakeholders · Risk Register · Cost · Meetings · Deliverables</div>
          </div>
          <button onClick={onEnterWorkspace} className="flex items-center gap-2 px-5 py-2.5 rounded text-sm font-semibold bg-amber-500 text-black hover:bg-amber-400 transition-all flex-shrink-0">
            Open Workspace <ArrowRight size={14} />
          </button>
        </Card>
      </div>
    </div>
  )
}
