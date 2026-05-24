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
    <div className="min-h-screen bg-[#060D18] flex items-center justify-center">
      <div className="text-center max-w-sm px-6">
        <div className="text-xs font-mono text-amber-500 tracking-widest mb-4">BUILDING MOBILISATION BRIEF</div>
        <div className="text-2xl font-black text-white mb-1 font-display">
          {mandate.engagementName || 'Engagement'}
        </div>
        <div className="text-sm text-gray-600 mb-8">{mandate.client}</div>
        <div className="space-y-2 text-left mb-8">
          {STEPS.map((s, i) => (
            <div
              key={i}
              className={`flex items-center gap-3 text-xs font-mono ${i <= step ? 'text-gray-400' : 'text-gray-800'}`}
            >
              <div
                className={`w-1.5 h-1.5 rounded-full flex-shrink-0 transition-all ${
                  i < step ? 'bg-amber-500' : i === step ? 'bg-amber-500 animate-pulse' : 'bg-gray-800'
                }`}
              />
              {s}
            </div>
          ))}
        </div>
        <div className="text-xs font-mono text-gray-800">
          Architecture intent {'->'} governed delivery execution
        </div>
      </div>
    </div>
  )
}
