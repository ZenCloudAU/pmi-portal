import { useState, useEffect } from 'react'
import type { MandateInput } from '@/types'

const STEPS = [
  'Reading mandate context and architecture intent...',
  'Classifying delivery scale, complexity, and lifecycle...',
  'Mapping governance checkpoints and decision authority...',
  'Building mobilisation actions for Day 1 through Week 2...',
  'Identifying artefacts, risks, issues, and stakeholder groups...',
  'Preparing executive-readable delivery visibility...',
  'Structuring the execution workspace...',
]

export function AnalyzingScreen({ mandate }: { mandate: MandateInput }) {
  const [step, setStep] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setStep(s => (s + 1) % STEPS.length), 700)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-900">
      <div className="text-center max-w-sm px-6">
        <div className="text-xs font-mono text-sky-700 tracking-widest mb-4">BUILDING MOBILISATION BRIEF</div>
        <div className="text-2xl font-black text-slate-950 mb-1 font-display">
          {mandate.engagementName || 'Engagement'}
        </div>
        <div className="text-sm text-slate-500 mb-8">{mandate.client}</div>
        <div className="space-y-2 text-left mb-8">
          {STEPS.map((s, i) => (
            <div
              key={i}
              className={`flex items-center gap-3 text-xs font-mono ${i <= step ? 'text-slate-700' : 'text-slate-300'}`}
            >
              <div
                className={`w-1.5 h-1.5 rounded-full flex-shrink-0 transition-all ${
                  i < step ? 'bg-sky-600' : i === step ? 'bg-sky-600 animate-pulse' : 'bg-slate-300'
                }`}
              />
              {s}
            </div>
          ))}
        </div>
        <div className="text-xs font-mono text-slate-500">
          Architecture intent {'->'} governed delivery execution
        </div>
      </div>
    </div>
  )
}
