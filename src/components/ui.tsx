import type { ReactNode } from 'react'

// ─── Badge ─────────────────────────────────────────────────────────────────────

type BadgeVariant = 'amber' | 'red' | 'blue' | 'green' | 'purple' | 'gray'

const BADGE_STYLES: Record<BadgeVariant, string> = {
  amber:  'bg-orange-50 text-orange-700 border-orange-200',
  red:    'bg-red-50 text-red-700 border-red-200',
  blue:   'bg-sky-50 text-sky-700 border-sky-200',
  green:  'bg-emerald-50 text-emerald-700 border-emerald-200',
  purple: 'bg-violet-50 text-violet-700 border-violet-200',
  gray:   'bg-slate-50 text-slate-600 border-slate-200',
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
    <div className="text-xs font-mono tracking-widest text-slate-500 uppercase mb-3">
      {children}
    </div>
  )
}

// ─── Card ──────────────────────────────────────────────────────────────────────

export function Card({
  children,
  className = '',
  accent = false,
  id,
}: {
  children: ReactNode
  className?: string
  accent?: boolean
  id?: string
}) {
  return (
    <div
      id={id}
      className={`border rounded-lg ${
        accent
          ? 'border-orange-200 bg-orange-50/80'
          : 'border-slate-200 bg-white shadow-sm'
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
      <label className="block text-xs font-mono tracking-widest text-slate-500 uppercase mb-1.5">
        {label}
      </label>
      <input
        className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-colors"
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
      <label className="block text-xs font-mono tracking-widest text-slate-500 uppercase mb-1.5">
        {label}
      </label>
      <select
        className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-colors"
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
