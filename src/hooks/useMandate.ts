import { PMI_SYSTEM_PROMPT, BUDGET_MAP, DURATION_MAP } from '@/data/constants'
import type { MandateInput, MandateAnalysis } from '@/types'

export async function analyzeMandate(mandate: MandateInput): Promise<MandateAnalysis> {
  const userMessage = [
    `ENGAGEMENT MANDATE:`,
    `Name: ${mandate.engagementName}`,
    `Client: ${mandate.client}`,
    `Type: ${mandate.type}`,
    `Budget Scale: ${BUDGET_MAP[mandate.budget] || 'Not specified'}`,
    `Duration: ${DURATION_MAP[mandate.duration] || 'Not specified'}`,
    `Sector: ${mandate.sector || 'Not specified'}`,
    `Location: ${mandate.location || 'TBC'}`,
    `Start: ${mandate.startType}`,
    ``,
    `MANDATE:`,
    mandate.mandate,
    ``,
    `ADDITIONAL CONTEXT:`,
    mandate.additionalContext || 'None provided.',
  ].join('\n')

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': import.meta.env.VITE_ANTHROPIC_API_KEY as string,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 4096,
      system: PMI_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userMessage }],
    }),
  })

  if (!response.ok) {
    const body = await response.text()
    throw new Error(`API ${response.status}: ${body}`)
  }

  const data = await response.json()
  const text: string = data.content?.find((b: { type: string }) => b.type === 'text')?.text ?? ''

  const clean = text.replace(/```json|```/g, '').trim()
  try {
    return JSON.parse(clean) as MandateAnalysis
  } catch {
    throw new Error(`JSON parse failed. Raw response: ${clean.slice(0, 200)}`)
  }
}
