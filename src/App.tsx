import { useState, type ReactNode } from 'react'
import type { MandateInput, MandateAnalysis, AppScreen } from '@/types'
import { analyzeMandate } from '@/hooks/useMandate'
import { VOLVO_DEMO } from '@/data/demos'
import { IntakeScreen }   from '@/views/IntakeScreen'
import { AnalyzingScreen } from '@/views/AnalyzingScreen'
import { BriefingRoom }   from '@/views/BriefingRoom'
import { Workspace }      from '@/views/Workspace'

function EcosystemBar() {
  return (
    <div style={{ background: '#0F172A', borderBottom: '1px solid #1E293B', padding: '0.375rem 1.5rem' }}>
      <div style={{ maxWidth: '1500px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <a href="https://zencloudau.github.io/vsf-match/" style={{ color: '#E8630A', fontFamily: 'DM Mono, Courier New, monospace', fontSize: '0.7rem', letterSpacing: '0.05em', textDecoration: 'none' }}>
          ← VSF Framework Home
        </a>
        <span style={{ color: '#475569', fontFamily: 'DM Mono, Courier New, monospace', fontSize: '0.7rem', letterSpacing: '0.05em' }}>
          Velocity Success Factor™ · ZenCloud · StudioSix
        </span>
      </div>
    </div>
  )
}

function Shell({ children }: { children: ReactNode }) {
  return (
    <div>
      <EcosystemBar />
      {children}
    </div>
  )
}

const EMPTY_MANDATE: MandateInput = {
  engagementName:    '',
  client:            '',
  type:              'Project',
  budget:            '',
  duration:          '',
  sector:            '',
  location:          '',
  startType:         'Immediate',
  mandate:           '',
  additionalContext: '',
}

export default function App() {
  const [screen,   setScreen]   = useState<AppScreen>('intake')
  const [mandate,  setMandate]  = useState<MandateInput>(EMPTY_MANDATE)
  const [analysis, setAnalysis] = useState<MandateAnalysis | null>(null)
  const [error,    setError]    = useState<string | null>(null)

  const handleAnalyze = async () => {
    setScreen('analyzing')
    setError(null)
    try {
      const result = await analyzeMandate(mandate)
      setAnalysis(result)
      setScreen('briefing')
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      console.error('analyzeMandate failed:', msg)
      setError(`Analysis failed: ${msg}`)
      setScreen('intake')
    }
  }

  const handleReset = () => {
    setScreen('intake')
    setAnalysis(null)
    setError(null)
    setMandate(EMPTY_MANDATE)
  }

  if (screen === 'intake') {
    return (
      <Shell>
        <IntakeScreen
          mandate={mandate}
          setMandate={setMandate}
          onAnalyze={handleAnalyze}
          onLoadDemo={() => setMandate(VOLVO_DEMO)}
          error={error}
        />
      </Shell>
    )
  }

  if (screen === 'analyzing') {
    return <Shell><AnalyzingScreen mandate={mandate} /></Shell>
  }

  if (screen === 'briefing' && analysis) {
    return (
      <Shell>
        <BriefingRoom
          mandate={mandate}
          analysis={analysis}
          onEnterWorkspace={() => setScreen('workspace')}
          onReset={handleReset}
        />
      </Shell>
    )
  }

  if (screen === 'workspace' && analysis) {
    return (
      <Shell>
        <Workspace
          mandate={mandate}
          analysis={analysis}
          onReset={handleReset}
        />
      </Shell>
    )
  }

  return null
}
