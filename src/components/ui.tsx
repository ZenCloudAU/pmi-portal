import type { ReactNode } from 'react'

// ─── Badge ─────────────────────────────────────────────────────────────────────

type BadgeVariant = 'amber' | 'red' | 'blue' | 'green' | 'purple' | 'gray'

const BADGE_STYLES: Record<BadgeVariant, string> = {
  amber:  'bg-amber-500/15 text-amber-400 border-amber-500/30',
  red:    'bg-red-500/15 text-red-400 border-red-500/30',
  blue:   'bg-blue-500/15 text-blue-400 border-blue-500/30',
  green:  'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  purple: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
  gray:   'bg-white/5 text-gray-500 border-white/10',
}

export function Badge({ label, variant = 'gray' }: { label: string; variant?: BadgeVariant }) {
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-mono border ${BADGE_STYLES[variant]}`}>
      {label}
    </span>
  )
}

// ─── SectionHead ───────────────────────────────────────────────────────────────

export function SectionHead({ children }: { children: ReactNode }) {
  return (
    <div className="text-xs font-mono tracking-widest text-gray-600 uppercase mb-3">
      {children}
    </div>
  )
}

// ─── Card ──────────────────────────────────────────────────────────────────────

export function Card({
  children,
  className = '',
  accent = false,
}: {
  children: ReactNode
  className?: string
  accent?: boolean
}) {
  return (
    <div
      className={`border rounded-lg ${
        accent
          ? 'border-amber-500/25 bg-amber-500/5'
          : 'border-[#1A2840] bg-[#0A1523]/80'
      } ${className}`}
    >
      {children}
    </div>
  )
}

// ─── FieldInput ────────────────────────────────────────────────────────────────

export function FieldInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label:       string
  value:       string
  onChange:    (v: string) => void
  placeholder: string
}) {
  return (
    <div>
      <label className="block text-xs font-mono tracking-widest text-gray-600 uppercase mb-1.5">
        {label}
      </label>
      <input
        className="w-full bg-[#0A1523] border border-[#1A2840] rounded px-3 py-2 text-sm text-white placeholder-gray-700 focus:outline-none focus:border-amber-500/40 transition-colors"
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  )
}

// ─── FieldSelect ───────────────────────────────────────────────────────────────

export function FieldSelect({
  label,
  value,
  onChange,
  options,
}: {
  label:   string
  value:   string
  onChange: (v: string) => void
  options:  [string, string][]
}) {
  return (
    <div>
      <label className="block text-xs font-mono tracking-widest text-gray-600 uppercase mb-1.5">
        {label}
      </label>
      <select
        className="w-full bg-[#0A1523] border border-[#1A2840] rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500/40 transition-colors font-mono"
        value={value}
        onChange={e => onChange(e.target.value)}
      >
        {options.map(([v, l]) => (
          <option key={v} value={v}>
            {l}
          </option>
        ))}
      </select>
    </div>
  )
}
