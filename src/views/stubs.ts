// ─── View Stubs ───────────────────────────────────────────────────────────────
// These are typed shells. Full implementation is in the pmi-portal.jsx artifact.
// Migration path: copy each view function from the artifact, add TypeScript types,
// replace with this typed export.

import type { MandateInput, MandateAnalysis } from '@/types'

interface IntakeProps {
  mandate:    MandateInput
  setMandate: (m: MandateInput) => void
  onAnalyze:  () => void
  onLoadDemo: () => void
  error:      string | null
}

interface AnalyzingProps {
  mandate: MandateInput
}

interface BriefingProps {
  mandate:           MandateInput
  analysis:          MandateAnalysis
  onEnterWorkspace:  () => void
  onReset:           () => void
}

interface WorkspaceProps {
  mandate:  MandateInput
  analysis: MandateAnalysis
  onReset:  () => void
}

// Placeholder renders — replace with real JSX once migrated from artifact.
export const IntakeScreen    = (_p: IntakeProps)    => null
export const AnalyzingScreen = (_p: AnalyzingProps)  => null
export const BriefingRoom    = (_p: BriefingProps)   => null
export const Workspace       = (_p: WorkspaceProps)  => null
