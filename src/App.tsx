import { useState } from 'react'
import type { MandateInput, MandateAnalysis, AppScreen } from '@/types'
import { analyzeMandate } from '@/hooks/useMandate'
import { VOLVO_DEMO } from '@/data/demos'
import { IntakeScreen }   from '@/views/IntakeScreen'
import { AnalyzingScreen } from '@/views/AnalyzingScreen'
import { BriefingRoom }   from '@/views/BriefingRoom'
import { Workspace }      from '@/views/Workspace'

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
      <IntakeScreen
        mandate={mandate}
        setMandate={setMandate}
        onAnalyze={handleAnalyze}
        onLoadDemo={() => setMandate(VOLVO_DEMO)}
        error={error}
      />
    )
  }

  if (screen === 'analyzing') {
    return <AnalyzingScreen mandate={mandate} />
  }

  if (screen === 'briefing' && analysis) {
    return (
      <BriefingRoom
        mandate={mandate}
        analysis={analysis}
        onEnterWorkspace={() => setScreen('workspace')}
        onReset={handleReset}
      />
    )
  }

  if (screen === 'workspace' && analysis) {
    return (
      <Workspace
        mandate={mandate}
        analysis={analysis}
        onReset={handleReset}
      />
    )
  }

  return null
}
