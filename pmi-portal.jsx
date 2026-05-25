import { useState, useEffect } from "react";
import {
  ArrowRight, RotateCcw, AlertTriangle, Clock, Users, Activity,
  Shield, BarChart2, Layers, FileText, Calendar, DollarSign,
  MessageSquare, Package, MapPin, Menu, BookOpen, Target, TrendingUp
} from "lucide-react";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

const PMI_PROMPT = `You are a senior PMI-certified Program and Project Manager holding PMP and PgMP credentials. You are the authority on PMBoK 7th Edition, The Standard for Program Management 4th Edition, and the full PMI Practice Guide suite.

Analyze the engagement mandate provided and return ONLY a raw JSON object. No markdown, no backticks, no preamble. Raw JSON only.

Required schema:
{
  "classification": "Project" | "Program" | "Portfolio Component",
  "complexityLevel": "Simple" | "Moderate" | "Complex" | "Highly Complex",
  "lifecycle": "Predictive" | "Adaptive" | "Hybrid",
  "summary": "2-3 sentence strategic assessment of what this engagement requires from a certified PM",
  "performanceDomains": [
    {"domain": "string", "priority": "High" | "Medium" | "Low"}
  ],
  "immediateActions": [
    {"timing": "Day 1" | "Day 2" | "Days 3-5" | "Week 1" | "Week 2", "action": "specific actionable task", "priority": "Critical" | "High" | "Medium", "basis": "PMI standard this derives from"}
  ],
  "requiredDocuments": [
    {"document": "document name", "due": "Day X or Week X", "priority": "Critical" | "High" | "Medium"}
  ],
  "governance": {
    "model": "governance model name",
    "decisionAuthority": "who decides what",
    "reporting": "reporting cadence description",
    "changeControl": "change control approach"
  },
  "riskCategories": ["category1", "category2"],
  "stakeholderGroups": [
    {"group": "group name", "strategy": "Manage Closely" | "Keep Satisfied" | "Keep Informed" | "Monitor"}
  ],
  "tailoring": "specific PMI tailoring guidance for this context",
  "programNotes": "Standard for Program Management 4th Ed. guidance if Program classification, otherwise null",
  "principles": ["relevant PMBoK 7th principle"]
}

Rules: All 8 PMBoK 7th performance domains must appear in performanceDomains (Stakeholders, Team, Development Approach & Life Cycle, Planning, Project Work, Delivery, Measurement, Uncertainty). Minimum 8 immediateActions. Minimum 8 requiredDocuments. Be specific and actionable — for a certified PM walking in on Day 1 of any engagement at any scale.`;

const VOLVO_DEMO = {
  engagementName: "Tri-Dealership Infrastructure Migration",
  client: "Volvo Car Corporation AU",
  type: "Project",
  budget: "under100k",
  duration: "under1month",
  sector: "Private",
  location: "Wacol, QLD",
  startType: "Immediate",
  mandate: `Client: Volvo Car Corporation AU. Location: Wacol, QLD — 5 days per week on-site. Immediate start required. Contract: 1 month. Rate: $1,000/day inc super.

Volvo has recently acquired 3 automotive dealerships across South-East Queensland. Each dealership runs independent legacy IT infrastructure (network, servers, endpoints) with no standardisation. The client requires a Project Manager to govern the full IT infrastructure migration across all 3 sites to align with Volvo corporate standards.

Key constraints: compressed 1-month timeline, no acceptable permanent data loss, agreed downtime windows per dealership, coordination of third-party network vendor and internal IT team, legacy system compatibility unknown.

Key concerns raised by IT Director: data integrity during migration, dealership operational continuity, and vendor delivery risk.`,
  additionalContext: "PM must produce weekly status reports for IT Director sponsor. Scope creep is a known risk — change control is essential. Full closure documentation required including lessons learned and handover package.",
};

const BUDGET_MAP = {
  under100k: "< $100K", "100k_1m": "$100K – $1M", "1m_10m": "$1M – $10M",
  "10m_100m": "$10M – $100M", "100mplus": "$100M+",
};
const DURATION_MAP = {
  under1month: "< 1 Month", "1_6months": "1–6 Months", "6_12months": "6–12 Months",
  "1_3years": "1–3 Years", "3yrsplus": "3+ Years",
};

// ─── SHARED UI ────────────────────────────────────────────────────────────────

function Badge({ label, variant = "gray" }) {
  const v = {
    amber: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    red: "bg-red-500/15 text-red-400 border-red-500/30",
    blue: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    green: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    purple: "bg-purple-500/15 text-purple-400 border-purple-500/30",
    gray: "bg-white/5 text-gray-500 border-white/10",
  };
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-mono border ${v[variant] || v.gray}`}>
      {label}
    </span>
  );
}

function SectionHead({ children }) {
  return <div className="text-xs font-mono tracking-widest text-gray-600 uppercase mb-3">{children}</div>;
}

function Card({ children, className = "", accent = false }) {
  return (
    <div className={`border rounded-lg ${accent ? "border-amber-500/25 bg-amber-500/5" : "border-[#1A2840] bg-[#0A1523]/80"} ${className}`}>
      {children}
    </div>
  );
}

function FieldInput({ label, value, onChange, placeholder, mono = false }) {
  return (
    <div>
      <label className="block text-xs font-mono tracking-widest text-gray-600 uppercase mb-1.5">{label}</label>
      <input
        className={`w-full bg-[#0A1523] border border-[#1A2840] rounded px-3 py-2 text-sm text-white placeholder-gray-700 focus:outline-none focus:border-amber-500/40 transition-colors ${mono ? "font-mono" : ""}`}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  );
}

function FieldSelect({ label, value, onChange, options }) {
  return (
    <div>
      <label className="block text-xs font-mono tracking-widest text-gray-600 uppercase mb-1.5">{label}</label>
      <select
        className="w-full bg-[#0A1523] border border-[#1A2840] rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500/40 transition-colors font-mono"
        value={value}
        onChange={e => onChange(e.target.value)}
      >
        {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
      </select>
    </div>
  );
}

// ─── SCREEN: INTAKE ───────────────────────────────────────────────────────────

function IntakeScreen({ mandate, setMandate, onAnalyze, onLoadDemo, error }) {
  const upd = (k, v) => setMandate(p => ({ ...p, [k]: v }));
  const canSubmit = mandate.engagementName.trim() && mandate.client.trim() && mandate.mandate.trim().length > 50;

  return (
    <div className="min-h-screen bg-[#060D18] flex flex-col">
      <header className="border-b border-[#1A2840] px-6 py-4 flex items-center justify-between">
        <div>
          <div className="text-xs font-mono text-amber-500 tracking-widest">ZENCLOUD CONSULTING</div>
          <div className="text-lg font-black text-white tracking-widest" style={{ fontFamily: "'Barlow Condensed',sans-serif" }}>
            PM · PgM PORTAL
          </div>
        </div>
        <div className="text-right text-xs font-mono text-gray-700 leading-relaxed">
          PMBoK 7th Edition<br />Standard for Program Management 4th Ed.
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-6 py-8 max-w-3xl mx-auto w-full">
        <div className="mb-8">
          <div className="text-xs font-mono text-amber-500 tracking-widest mb-2">DAY 1 MANDATE INTAKE</div>
          <h1 className="text-4xl font-black text-white leading-none mb-3" style={{ fontFamily: "'Barlow Condensed',sans-serif", letterSpacing: "0.02em" }}>
            Describe the mandate.<br />Get your exact playbook.
          </h1>
          <p className="text-sm text-gray-500 leading-relaxed max-w-xl">
            Any engagement — project, program, or portfolio component. Any scale — $10K to $500M.
            Input the mandate as given and receive a PMI-certified action plan: exactly what to do, 
            what to produce, and how to govern it from Day 1.
          </p>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <FieldInput label="Engagement Name *" value={mandate.engagementName} onChange={v => upd("engagementName", v)} placeholder="e.g. ERP Consolidation Program" />
            <FieldInput label="Client / Organisation *" value={mandate.client} onChange={v => upd("client", v)} placeholder="e.g. Department of Finance" />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <FieldSelect label="Type" value={mandate.type} onChange={v => upd("type", v)} options={[["Project","Project"],["Program","Program"],["Portfolio","Portfolio Component"]]} />
            <FieldSelect label="Budget Scale" value={mandate.budget} onChange={v => upd("budget", v)} options={[["","— Select —"],["under100k","< $100K"],["100k_1m","$100K – $1M"],["1m_10m","$1M – $10M"],["10m_100m","$10M – $100M"],["100mplus","$100M+"]]} />
            <FieldSelect label="Duration" value={mandate.duration} onChange={v => upd("duration", v)} options={[["","— Select —"],["under1month","< 1 Month"],["1_6months","1–6 Months"],["6_12months","6–12 Months"],["1_3years","1–3 Years"],["3yrsplus","3+ Years"]]} />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <FieldSelect label="Sector" value={mandate.sector} onChange={v => upd("sector", v)} options={[["","— Select —"],["government","Government / Public"],["private","Private"],["nfp","Not-for-Profit"],["mixed","Mixed"],["defence","Defence"],["health","Health"],["finance","Financial Services"],["energy","Energy / Utilities"]]} />
            <FieldSelect label="Start" value={mandate.startType} onChange={v => upd("startType", v)} options={[["Immediate","Immediate"],["Planned","Planned / Defined"],["TBD","TBD"]]} />
            <FieldInput label="Location (or Remote)" value={mandate.location} onChange={v => upd("location", v)} placeholder="City, State" />
          </div>

          <div>
            <label className="block text-xs font-mono tracking-widest text-gray-600 uppercase mb-1.5">
              Mandate Description * — paste or describe exactly what you were given
            </label>
            <textarea
              rows={8}
              className="w-full bg-[#0A1523] border border-[#1A2840] rounded px-3 py-2.5 text-sm text-white placeholder-gray-700 focus:outline-none focus:border-amber-500/40 transition-colors resize-none leading-relaxed"
              placeholder="Describe the mandate as it was given to you. Include: what the client needs, scope, known constraints, timeline, key stakeholders, red flags, and any specific concerns raised. The more context, the more precise the playbook."
              value={mandate.mandate}
              onChange={e => upd("mandate", e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-mono tracking-widest text-gray-600 uppercase mb-1.5">Additional Context (optional)</label>
            <textarea
              rows={3}
              className="w-full bg-[#0A1523] border border-[#1A2840] rounded px-3 py-2.5 text-sm text-white placeholder-gray-700 focus:outline-none focus:border-amber-500/40 transition-colors resize-none leading-relaxed"
              placeholder="Reporting structure, known politics, technical constraints, prior PM history, organisational maturity, delivery environment..."
              value={mandate.additionalContext}
              onChange={e => upd("additionalContext", e.target.value)}
            />
          </div>

          {error && (
            <div className="border border-red-500/30 rounded p-3 bg-red-500/10 text-xs font-mono text-red-400">{error}</div>
          )}

          <div className="flex items-center gap-3 pt-1">
            <button
              onClick={onAnalyze}
              disabled={!canSubmit}
              className={`flex items-center gap-2 px-5 py-2.5 rounded text-sm font-semibold transition-all ${
                canSubmit ? "bg-amber-500 text-black hover:bg-amber-400" : "bg-[#1A2840] text-gray-600 cursor-not-allowed"
              }`}
            >
              Analyze Mandate <ArrowRight size={14} />
            </button>
            <button
              onClick={onLoadDemo}
              className="px-4 py-2.5 rounded text-sm text-gray-500 border border-[#1A2840] hover:border-amber-500/30 hover:text-amber-400 transition-all"
            >
              Load Demo — Volvo
            </button>
          </div>

          <div className="border border-[#1A2840]/60 rounded p-3 bg-[#080F1A]">
            <div className="text-xs font-mono text-gray-700">
              Framework alignment: PMBoK 7th Ed. (12 Principles · 8 Performance Domains) · Standard for Program Management 4th Ed. · PMI Practice Guides (Agile, Risk, Benefits Realisation, Scheduling) · PMI Code of Ethics and Professional Conduct
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── SCREEN: ANALYZING ────────────────────────────────────────────────────────

function AnalyzingScreen({ mandate }) {
  const [step, setStep] = useState(0);
  const steps = [
    "Classifying engagement type and complexity...",
    "Mapping to PMBoK 7th Edition performance domains...",
    "Applying Standard for Program Management 4th Ed...",
    "Generating Day 1 action sequence...",
    "Structuring governance framework...",
    "Determining required document suite...",
    "Seeding risk category register...",
    "Mapping stakeholder engagement strategy...",
    "Tailoring PMI approach to this context...",
  ];
  useEffect(() => {
    const t = setInterval(() => setStep(s => (s + 1) % steps.length), 700);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-screen bg-[#060D18] flex items-center justify-center">
      <div className="text-center max-w-sm px-6">
        <div className="text-xs font-mono text-amber-500 tracking-widest mb-4">ANALYZING MANDATE</div>
        <div className="text-2xl font-black text-white mb-1" style={{ fontFamily: "'Barlow Condensed',sans-serif" }}>
          {mandate.engagementName || "Engagement"}
        </div>
        <div className="text-sm text-gray-600 mb-8">{mandate.client}</div>
        <div className="space-y-2 text-left mb-8">
          {steps.map((s, i) => (
            <div key={i} className={`flex items-center gap-3 text-xs font-mono ${i <= step ? "text-gray-400" : "text-gray-800"}`}>
              <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 transition-all ${i < step ? "bg-amber-500" : i === step ? "bg-amber-500 animate-pulse" : "bg-gray-800"}`} />
              {s}
            </div>
          ))}
        </div>
        <div className="text-xs font-mono text-gray-800">PMBoK 7th Ed. · Standard for Program Management 4th Ed.</div>
      </div>
    </div>
  );
}

// ─── SCREEN: BRIEFING ROOM ────────────────────────────────────────────────────

function BriefingRoom({ mandate, analysis, onEnterWorkspace, onReset }) {
  if (!analysis) return null;

  const complexV = { Simple: "green", Moderate: "blue", Complex: "amber", "Highly Complex": "red" };
  const lifecycleV = { Predictive: "blue", Adaptive: "green", Hybrid: "purple" };
  const priorityV = { Critical: "red", High: "amber", Medium: "blue" };
  const strategyV = { "Manage Closely": "red", "Keep Satisfied": "amber", "Keep Informed": "blue", Monitor: "gray" };
  const timingOrder = ["Day 1", "Day 2", "Days 3-5", "Week 1", "Week 2"];
  const sorted = [...(analysis.immediateActions || [])].sort((a, b) => timingOrder.indexOf(a.timing) - timingOrder.indexOf(b.timing));

  const domainIcon = (d = "") => {
    if (d.includes("Stakeholder") || d.includes("Team")) return Users;
    if (d.includes("Planning")) return Calendar;
    if (d.includes("Delivery") || d.includes("Work")) return Package;
    if (d.includes("Measurement")) return BarChart2;
    if (d.includes("Uncertainty")) return Shield;
    if (d.includes("Development")) return Layers;
    return Activity;
  };

  return (
    <div className="min-h-screen bg-[#060D18] flex flex-col">
      <header className="border-b border-[#1A2840] px-6 py-3.5 flex items-center gap-4 flex-shrink-0">
        <div className="flex-1">
          <div className="text-xs font-mono text-amber-500 tracking-widest">PMI MANDATE BRIEFING</div>
          <div className="text-sm font-bold text-white" style={{ fontFamily: "'Barlow Condensed',sans-serif", letterSpacing: "0.04em" }}>{mandate.engagementName}</div>
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
              <div className="text-xs font-mono text-amber-500 tracking-widest mb-1">{mandate.client} · {mandate.location || "Location TBC"}</div>
              <div className="text-xl font-black text-white leading-none" style={{ fontFamily: "'Barlow Condensed',sans-serif" }}>
                {analysis.classification?.toUpperCase()} — {analysis.complexityLevel?.toUpperCase()} COMPLEXITY
              </div>
            </div>
            <div className="flex flex-wrap gap-2 flex-shrink-0">
              <Badge label={analysis.classification} variant="amber" />
              <Badge label={analysis.complexityLevel} variant={complexV[analysis.complexityLevel] || "gray"} />
              <Badge label={`${analysis.lifecycle} Lifecycle`} variant={lifecycleV[analysis.lifecycle] || "blue"} />
            </div>
          </div>
          <p className="text-sm text-gray-300 leading-relaxed">{analysis.summary}</p>
        </Card>

        {/* Day 1 Action Plan — HERO */}
        <Card>
          <div className="px-5 py-3 border-b border-[#1A2840] flex items-center gap-2">
            <Target size={13} className="text-amber-500" />
            <div className="text-xs font-mono text-amber-500 tracking-widest">DAY 1 ACTION PLAN — YOUR PMI-CERTIFIED MANDATE</div>
          </div>
          <div className="divide-y divide-[#1A2840]/50">
            {sorted.map((a, i) => (
              <div key={i} className="flex items-start gap-4 px-5 py-3.5 hover:bg-[#1A2840]/20 transition-colors">
                <div className={`text-xs font-mono px-2 py-0.5 rounded border flex-shrink-0 mt-0.5 ${
                  a.timing === "Day 1" ? "border-red-500/40 text-red-400 bg-red-500/10" :
                  a.timing === "Day 2" ? "border-amber-500/40 text-amber-400 bg-amber-500/10" :
                  "border-blue-500/30 text-blue-400 bg-blue-500/10"
                }`}>
                  {a.timing}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-white leading-snug">{a.action}</div>
                  {a.basis && <div className="text-xs font-mono text-gray-700 mt-0.5">{a.basis}</div>}
                </div>
                <Badge label={a.priority} variant={priorityV[a.priority] || "gray"} />
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
              {(analysis.performanceDomains || []).map((pd, i) => {
                const Icon = domainIcon(pd.domain);
                return (
                  <div key={i} className="flex items-center gap-3">
                    <Icon size={11} className={pd.priority === "High" ? "text-amber-400" : pd.priority === "Medium" ? "text-blue-400" : "text-gray-700"} />
                    <span className={`text-xs flex-1 ${pd.priority === "High" ? "text-gray-200" : pd.priority === "Medium" ? "text-gray-400" : "text-gray-600"}`}>{pd.domain}</span>
                    <Badge label={pd.priority} variant={pd.priority === "High" ? "amber" : pd.priority === "Medium" ? "blue" : "gray"} />
                  </div>
                );
              })}
            </div>
          </Card>

          <Card>
            <div className="px-4 py-3 border-b border-[#1A2840]">
              <div className="text-xs font-mono text-gray-600 tracking-widest">REQUIRED DOCUMENTS</div>
            </div>
            <div className="divide-y divide-[#1A2840]/40">
              {(analysis.requiredDocuments || []).map((d, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-2.5">
                  <FileText size={10} className="text-gray-700 flex-shrink-0" />
                  <span className="text-xs text-gray-300 flex-1 leading-tight">{d.document}</span>
                  <span className="text-xs font-mono text-gray-600 flex-shrink-0">{d.due}</span>
                  <Badge label={d.priority} variant={priorityV[d.priority] || "gray"} />
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
                ["Decision Authority", analysis.governance.decisionAuthority],
                ["Reporting Cadence", analysis.governance.reporting],
                ["Change Control", analysis.governance.changeControl],
                ["Model", analysis.governance.model],
              ].map(([k, v]) => (
                <div key={k}>
                  <div className="text-xs font-mono text-gray-700 mb-0.5">{k.toUpperCase()}</div>
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
              {(analysis.stakeholderGroups || []).map((sg, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Users size={10} className="text-gray-700 flex-shrink-0" />
                  <span className="text-xs text-gray-300 flex-1">{sg.group}</span>
                  <Badge label={sg.strategy} variant={strategyV[sg.strategy] || "gray"} />
                </div>
              ))}
            </div>
          </Card>
          <Card className="p-4">
            <SectionHead>Risk Categories — Seed These Immediately</SectionHead>
            <div className="space-y-1.5">
              {(analysis.riskCategories || []).map((r, i) => (
                <div key={i} className="flex items-center gap-2">
                  <AlertTriangle size={10} className="text-amber-500/50 flex-shrink-0" />
                  <span className="text-xs text-gray-400">{r}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Tailoring + Program Notes */}
        <Card className="p-5">
          <SectionHead>PMI Tailoring Guidance</SectionHead>
          <p className="text-sm text-gray-300 leading-relaxed">{analysis.tailoring}</p>
          {analysis.programNotes && (
            <div className="mt-4 border-t border-[#1A2840] pt-4">
              <div className="text-xs font-mono text-amber-500 tracking-widest mb-2">Standard for Program Management — 4th Ed.</div>
              <p className="text-sm text-gray-300 leading-relaxed">{analysis.programNotes}</p>
            </div>
          )}
        </Card>

        {/* Principles */}
        {(analysis.principles?.length > 0) && (
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
  );
}

// ─── WORKSPACE VIEWS ──────────────────────────────────────────────────────────

function WBriefing({ analysis, mandate }) {
  const priorityV = { Critical: "red", High: "amber", Medium: "blue" };
  const timingOrder = ["Day 1", "Day 2", "Days 3-5", "Week 1", "Week 2"];
  const day12 = [...(analysis.immediateActions || [])]
    .sort((a, b) => timingOrder.indexOf(a.timing) - timingOrder.indexOf(b.timing))
    .filter(a => a.timing === "Day 1" || a.timing === "Day 2");
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
              <div className={`text-xs font-mono px-2 py-0.5 rounded border flex-shrink-0 mt-0.5 ${a.timing === "Day 1" ? "border-red-500/40 text-red-400 bg-red-500/10" : "border-amber-500/40 text-amber-400 bg-amber-500/10"}`}>{a.timing}</div>
              <div className="flex-1">
                <div className="text-xs text-gray-300 leading-tight">{a.action}</div>
                {a.basis && <div className="text-xs font-mono text-gray-700 mt-0.5">{a.basis}</div>}
              </div>
              <Badge label={a.priority} variant={priorityV[a.priority] || "gray"} />
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
    </div>
  );
}

function WCharter({ mandate, analysis }) {
  const [fields, setFields] = useState({ purpose: "", objectives: "", inScope: "", outScope: "", constraints: "", assumptions: "", risks: "", authority: "" });
  const upd = (k, v) => setFields(p => ({ ...p, [k]: v }));
  const sections = [
    { k: "purpose", label: "Purpose & Justification", ph: "Why does this engagement exist? What business problem is being solved or value being delivered?" },
    { k: "objectives", label: "Objectives (SMART)", ph: "List measurable objectives. Each must be Specific, Measurable, Achievable, Relevant, Time-bound." },
    { k: "inScope", label: "In Scope", ph: "What is explicitly within the scope of this engagement..." },
    { k: "outScope", label: "Out of Scope", ph: "What is explicitly excluded from this engagement..." },
    { k: "constraints", label: "Constraints", ph: "Budget, timeline, resource, regulatory, technical, and organisational constraints..." },
    { k: "assumptions", label: "Assumptions", ph: "What is assumed to be true for this engagement to be viable..." },
    { k: "risks", label: "High-Level Risks (Summary)", ph: `Seed from mandate analysis: ${(analysis.riskCategories || []).slice(0, 4).join(", ")}...` },
    { k: "authority", label: "PM Authority", ph: "What authority does the PM hold? What requires escalation? Who is the accountable sponsor?" },
  ];
  return (
    <div className="space-y-3">
      <SectionHead>Project / Program Charter — {mandate.client}</SectionHead>
      <div className="grid grid-cols-2 gap-3 mb-1">
        {[
          ["Client", mandate.client], ["Classification", `${analysis.classification} · ${analysis.complexityLevel}`],
          ["Lifecycle", analysis.lifecycle], ["Location", mandate.location || "TBC"],
          ["Scale", BUDGET_MAP[mandate.budget] || "TBC"], ["Duration", DURATION_MAP[mandate.duration] || "TBC"],
        ].map(([l, v]) => (
          <div key={l} className="border border-[#1A2840] rounded p-3 bg-[#0A1523]/60">
            <div className="text-xs font-mono text-gray-700 mb-0.5">{l.toUpperCase()}</div>
            <div className="text-xs text-gray-300">{v}</div>
          </div>
        ))}
      </div>
      {sections.map(s => (
        <div key={s.k} className="border border-[#1A2840] rounded-lg overflow-hidden bg-[#0A1523]/80">
          <div className="px-4 py-2 border-b border-[#1A2840] bg-[#1A2840]/30">
            <span className="text-xs font-mono text-amber-500 tracking-wider">{s.label.toUpperCase()}</span>
          </div>
          <textarea rows={4} className="w-full bg-transparent px-4 py-3 text-sm text-gray-300 placeholder-gray-700 focus:outline-none resize-none leading-relaxed"
            placeholder={s.ph} value={fields[s.k]} onChange={e => upd(s.k, e.target.value)} />
        </div>
      ))}
      <Card accent className="p-5">
        <SectionHead>Approval & Sign-Off</SectionHead>
        <div className="grid grid-cols-2 gap-6">
          {["Sponsor / Client Representative", `Project ${analysis.classification === "Program" ? "/ Program " : ""}Manager`].map(r => (
            <div key={r}>
              <div className="text-xs text-gray-600 mb-1">{r}</div>
              <div className="border-b border-dashed border-gray-700 h-8" />
              <div className="text-xs text-gray-800 mt-1">Signature · Date</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function WSchedule({ analysis }) {
  const phases = [
    { phase: "Initiating", color: "#E8A020" },
    { phase: "Planning", color: "#3B82F6" },
    { phase: "Executing", color: "#10B981" },
    { phase: "M&C", color: "#8B5CF6" },
    { phase: "Closing", color: "#EF4444" },
  ];
  const timingOrder = ["Day 1", "Day 2", "Days 3-5", "Week 1", "Week 2"];
  const criticals = [...(analysis.immediateActions || [])]
    .sort((a, b) => timingOrder.indexOf(a.timing) - timingOrder.indexOf(b.timing))
    .filter(a => a.priority === "Critical");
  return (
    <div className="space-y-4">
      <SectionHead>Schedule — PMBoK Planning Performance Domain</SectionHead>
      <Card className="p-4">
        <SectionHead>Process Group Framework — {analysis.lifecycle} Lifecycle</SectionHead>
        <div className="flex gap-1 mb-3">
          {phases.map(p => (
            <div key={p.phase} style={{ flex: 1, background: p.color + "20", borderColor: p.color + "50" }} className="border rounded p-2 text-center">
              <div className="text-xs font-mono font-bold" style={{ color: p.color }}>{p.phase}</div>
            </div>
          ))}
        </div>
        <div className="text-xs text-gray-600 leading-relaxed">
          Build the detailed schedule in your scheduling tool (MS Project, Smartsheet, P6) per the Planning Performance Domain. 
          Apply {analysis.lifecycle === "Predictive" ? "work packages and activity decomposition (WBS → activities → schedule)" :
            analysis.lifecycle === "Adaptive" ? "sprint/iteration planning with a release roadmap" :
            "phase-gate milestones with rolling wave planning within each phase"}.
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
          {(analysis.requiredDocuments || []).map((d, i) => (
            <div key={i} className="flex items-center gap-3 border border-[#1A2840]/40 rounded p-2.5">
              <FileText size={10} className="text-gray-700 flex-shrink-0" />
              <span className="text-xs text-gray-400 flex-1">{d.document}</span>
              <span className="text-xs font-mono text-gray-600">{d.due}</span>
              <Badge label={d.priority} variant={{ Critical: "red", High: "amber", Medium: "blue" }[d.priority] || "gray"} />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function WStakeholders({ analysis }) {
  const [rows, setRows] = useState(
    (analysis.stakeholderGroups || []).map((sg, i) => ({
      id: i + 1, name: "", group: sg.group, strategy: sg.strategy, influence: "", interest: "", engagement: "", notes: ""
    }))
  );
  const upd = (id, k, v) => setRows(p => p.map(r => r.id === id ? { ...r, [k]: v } : r));
  const stratV = { "Manage Closely": "red", "Keep Satisfied": "amber", "Keep Informed": "blue", Monitor: "gray" };
  return (
    <div className="space-y-4">
      <SectionHead>Stakeholder Register — PMBoK Stakeholders Performance Domain</SectionHead>
      <div className="grid grid-cols-2 gap-1 border border-[#1A2840] rounded-lg overflow-hidden bg-[#0A1523]/80">
        {[
          { label: "HIGH INFLUENCE · HIGH INTEREST", strategy: "Manage Closely", items: rows.filter(r => r.strategy === "Manage Closely") },
          { label: "HIGH INFLUENCE · LOW INTEREST", strategy: "Keep Satisfied", items: rows.filter(r => r.strategy === "Keep Satisfied") },
          { label: "LOW INFLUENCE · HIGH INTEREST", strategy: "Keep Informed", items: rows.filter(r => r.strategy === "Keep Informed") },
          { label: "LOW INFLUENCE · LOW INTEREST", strategy: "Monitor", items: rows.filter(r => r.strategy === "Monitor") },
        ].map(q => (
          <div key={q.label} className="border border-[#1A2840] p-3 bg-[#080F1A]/60">
            <div className="text-xs font-mono text-gray-600 mb-1">{q.label}</div>
            <div className="text-xs text-amber-400 mb-2">→ {q.strategy}</div>
            {q.items.map(r => <div key={r.id} className="text-xs text-gray-500">{r.name || r.group}</div>)}
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
            <Badge label={r.strategy} variant={stratV[r.strategy] || "gray"} />
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              { k: "name", label: "Name / Role", ph: "Person name or role title" },
              { k: "influence", label: "Influence", ph: "High / Medium / Low" },
              { k: "interest", label: "Interest", ph: "High / Medium / Low" },
              { k: "engagement", label: "Current Stance", ph: "Supportive / Neutral / Resistant" },
            ].map(f => (
              <div key={f.k}>
                <div className="text-xs font-mono text-gray-700 mb-1">{f.label.toUpperCase()}</div>
                <input className="w-full bg-[#080F1A] border border-[#1A2840] rounded px-2 py-1.5 text-xs text-gray-300 focus:outline-none"
                  placeholder={f.ph} value={r[f.k]} onChange={e => upd(r.id, f.k, e.target.value)} />
              </div>
            ))}
          </div>
        </Card>
      ))}
      <button onClick={() => setRows(p => [...p, { id: Date.now(), name: "", group: "New Stakeholder Group", strategy: "Monitor", influence: "", interest: "", engagement: "", notes: "" }])}
        className="w-full border border-dashed border-[#1A2840] hover:border-blue-500/30 rounded p-3 text-xs font-mono text-gray-600 hover:text-blue-400 transition-all">
        + Add Stakeholder Group
      </button>
    </div>
  );
}

function WRisks({ analysis }) {
  const [risks, setRisks] = useState(
    (analysis.riskCategories || []).map((cat, i) => ({
      id: i + 1, category: cat, description: "", probability: "", impact: "", score: "", mitigation: "", status: "Open"
    }))
  );
  const upd = (id, k, v) => setRisks(p => p.map(r => r.id === id ? { ...r, [k]: v } : r));
  const scoreColor = { Critical: "#EF4444", High: "#F97316", Medium: "#EAB308", Low: "#22C55E" };
  return (
    <div className="space-y-4">
      <SectionHead>Risk Register — PMBoK Uncertainty Performance Domain</SectionHead>
      <div className="grid grid-cols-4 gap-3">
        {["Critical", "High", "Medium", "Low"].map(s => (
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
            {r.score && <Badge label={r.score} variant={{ Critical: "red", High: "amber", Medium: "blue", Low: "green" }[r.score] || "gray"} />}
          </div>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <div className="text-xs font-mono text-gray-700 mb-1">RISK DESCRIPTION</div>
              <textarea rows={2} className="w-full bg-[#080F1A] border border-[#1A2840] rounded px-2 py-1.5 text-xs text-gray-300 focus:outline-none resize-none"
                placeholder="Specific risk event and impact..." value={r.description} onChange={e => upd(r.id, "description", e.target.value)} />
            </div>
            <div>
              <div className="text-xs font-mono text-gray-700 mb-1">MITIGATION / RESPONSE</div>
              <textarea rows={2} className="w-full bg-[#080F1A] border border-[#1A2840] rounded px-2 py-1.5 text-xs text-gray-300 focus:outline-none resize-none"
                placeholder="Response strategy and owner..." value={r.mitigation} onChange={e => upd(r.id, "mitigation", e.target.value)} />
            </div>
          </div>
          <div className="flex gap-2">
            {[
              { k: "probability", opts: ["", "Low", "Medium", "High"] },
              { k: "impact", opts: ["", "Low", "Medium", "High"] },
              { k: "score", opts: ["", "Low", "Medium", "High", "Critical"] },
              { k: "status", opts: ["Open", "In Progress", "Closed"] },
            ].map(f => (
              <div key={f.k} className="flex-1">
                <div className="text-xs font-mono text-gray-700 mb-1">{f.k.toUpperCase()}</div>
                <select className="w-full bg-[#080F1A] border border-[#1A2840] rounded px-2 py-1 text-xs text-gray-400 focus:outline-none"
                  value={r[f.k]} onChange={e => upd(r.id, f.k, e.target.value)}>
                  {f.opts.map(o => <option key={o} value={o}>{o || "— Select"}</option>)}
                </select>
              </div>
            ))}
          </div>
        </Card>
      ))}
      <button onClick={() => setRisks(p => [...p, { id: Date.now(), category: "New Risk Category", description: "", probability: "", impact: "", score: "", mitigation: "", status: "Open" }])}
        className="w-full border border-dashed border-[#1A2840] hover:border-amber-500/30 rounded p-3 text-xs font-mono text-gray-600 hover:text-amber-500 transition-all">
        + Add Risk
      </button>
    </div>
  );
}

function WBudget({ mandate, analysis }) {
  return (
    <div className="space-y-4">
      <SectionHead>Cost Management — PMBoK Planning Knowledge Area</SectionHead>
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Budget Scale", value: BUDGET_MAP[mandate.budget] || "TBC" },
          { label: "Duration", value: DURATION_MAP[mandate.duration] || "TBC" },
          { label: "Lifecycle", value: analysis.lifecycle },
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
          <p><span className="text-gray-300 font-medium">Estimate Costs:</span> Apply {analysis.complexityLevel === "Simple" ? "analogous or parametric" : "bottom-up"} estimation. Document assumptions and basis of estimate.</p>
          <p><span className="text-gray-300 font-medium">Determine Budget:</span> Aggregate cost estimates → cost baseline (PMB). Add management reserve above baseline. Establish change control thresholds per {analysis.governance?.model}.</p>
          <p><span className="text-gray-300 font-medium">Control Costs:</span> Apply {analysis.complexityLevel === "Highly Complex" || analysis.complexityLevel === "Complex" ? "full Earned Value Management (SPI, CPI, EAC, ETC, VAC)" : "budget vs actuals tracking with variance analysis"}. Report per {analysis.governance?.reporting}.</p>
        </div>
      </Card>
      <Card className="p-4">
        <SectionHead>Change Control — Cost Thresholds (Define on Day 1)</SectionHead>
        <div className="grid grid-cols-3 gap-3">
          {[
            { tier: "PM Authority", desc: "Approve without escalation", ph: "e.g. < 5% variance or < $X" },
            { tier: "Sponsor Approval", desc: "Requires sponsor sign-off", ph: "e.g. 5–15% variance" },
            { tier: "Steering / Board", desc: "Full governance review", ph: "e.g. > 15% or > $X" },
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
  );
}

function WMeetings({ analysis }) {
  const base = [
    { name: "Kick-Off", freq: "Once — Week 1", desc: "All stakeholders · Charter briefing · Mandate alignment · Governance establishment" },
    { name: "Daily Standup", freq: "Daily · 08:00", desc: "Core team · Status, blockers, decisions, actions" },
    { name: `Sponsor Status Report`, freq: analysis.governance?.reporting || "Weekly", desc: `${analysis.governance?.model || "Sponsor"} · Progress, risks, issues, decisions required` },
    { name: "Risk Review", freq: "Fortnightly", desc: "PM + leads · Risk register walk-through · Update scores and mitigations" },
    { name: analysis.classification === "Program" ? "Governance Board" : "Steering Review", freq: analysis.classification === "Program" ? "Monthly" : "As required", desc: `${analysis.governance?.model} · Escalation decisions · Change requests · Budget approvals` },
    { name: "Go/No-Go Gate Reviews", freq: "Per milestone", desc: "PM + sponsor · Gate criteria met? · Proceed, pause, or re-plan" },
    { name: "Lessons Learned", freq: "At closure", desc: "All stakeholders · Knowledge capture · Continuous improvement register" },
  ];
  return (
    <div className="space-y-4">
      <SectionHead>Meeting Management — PMBoK Communications Performance Domain</SectionHead>
      <Card className="p-4">
        <SectionHead>Standing Cadence</SectionHead>
        <div className="space-y-2">
          {base.map((m, i) => (
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
          {["Stakeholder / Group", "Information Need", "Method", "Frequency"].map(h => <div key={h}>{h.toUpperCase()}</div>)}
        </div>
        {(analysis.stakeholderGroups || []).map((sg, i) => (
          <div key={i} className="grid grid-cols-4 gap-2 mb-2">
            <div className="text-xs text-gray-400">{sg.group}</div>
            <input className="bg-[#080F1A] border border-[#1A2840] rounded px-2 py-1 text-xs text-gray-400 focus:outline-none col-span-1" placeholder="What they need..." />
            <input className="bg-[#080F1A] border border-[#1A2840] rounded px-2 py-1 text-xs text-gray-400 focus:outline-none col-span-1" placeholder="Email / Meeting / Report..." />
            <input className="bg-[#080F1A] border border-[#1A2840] rounded px-2 py-1 text-xs text-gray-400 focus:outline-none col-span-1" placeholder="Weekly / Monthly..." />
          </div>
        ))}
      </Card>
    </div>
  );
}

function WDeliverables({ analysis }) {
  const [rows, setRows] = useState(
    (analysis.requiredDocuments || []).map((d, i) => ({
      id: i + 1, name: d.document, due: d.due, priority: d.priority, owner: "", status: "Not Started"
    }))
  );
  const upd = (id, k, v) => setRows(p => p.map(r => r.id === id ? { ...r, [k]: v } : r));
  const priorityV = { Critical: "red", High: "amber", Medium: "blue" };
  return (
    <div className="space-y-4">
      <SectionHead>Deliverables Register — {rows.length} Items</SectionHead>
      <Card className="overflow-hidden">
        <div className="grid grid-cols-5 border-b border-[#1A2840] bg-[#1A2840]/40 text-xs font-mono text-gray-600 tracking-wider">
          {["Document", "Due", "Owner", "Priority", "Status"].map(h => <div key={h} className="p-3">{h.toUpperCase()}</div>)}
        </div>
        {rows.map((r, i) => (
          <div key={r.id} className={`grid grid-cols-5 border-b border-[#1A2840]/40 hover:bg-[#1A2840]/20 transition-colors ${i % 2 ? "bg-[#1A2840]/10" : ""}`}>
            <div className="p-3 text-xs text-gray-300 leading-tight">{r.name}</div>
            <div className="p-3 text-xs font-mono text-gray-600">{r.due}</div>
            <div className="p-3">
              <input className="w-full bg-transparent text-xs text-gray-400 focus:outline-none border-b border-[#1A2840] pb-0.5"
                placeholder="Assign..." value={r.owner} onChange={e => upd(r.id, "owner", e.target.value)} />
            </div>
            <div className="p-3"><Badge label={r.priority} variant={priorityV[r.priority] || "gray"} /></div>
            <div className="p-3">
              <select className="bg-transparent text-xs text-gray-500 focus:outline-none w-full" value={r.status}
                onChange={e => upd(r.id, "status", e.target.value)}>
                {["Not Started", "In Progress", "In Review", "Complete"].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        ))}
      </Card>
      <div className="flex justify-between text-xs font-mono text-gray-700 px-1">
        <span>Complete: {rows.filter(r => r.status === "Complete").length} / {rows.length}</span>
        <span>In Progress: {rows.filter(r => r.status === "In Progress").length}</span>
        <span>Not Started: {rows.filter(r => r.status === "Not Started").length}</span>
      </div>
    </div>
  );
}

// ─── WORKSPACE SHELL ──────────────────────────────────────────────────────────

const VIEWS = [
  { id: "briefing", label: "Briefing", icon: BookOpen },
  { id: "charter", label: "Charter", icon: FileText },
  { id: "schedule", label: "Schedule", icon: Calendar },
  { id: "stakeholders", label: "Stakeholders", icon: Users },
  { id: "risks", label: "Risk Register", icon: AlertTriangle },
  { id: "budget", label: "Cost & Budget", icon: DollarSign },
  { id: "meetings", label: "Meetings", icon: MessageSquare },
  { id: "deliverables", label: "Deliverables", icon: Package },
];

function Workspace({ mandate, analysis, onReset }) {
  const [view, setView] = useState("briefing");
  const [sidebar, setSidebar] = useState(true);
  const current = VIEWS.find(v => v.id === view);

  const renderView = () => {
    switch (view) {
      case "briefing": return <WBriefing analysis={analysis} mandate={mandate} />;
      case "charter": return <WCharter mandate={mandate} analysis={analysis} />;
      case "schedule": return <WSchedule analysis={analysis} />;
      case "stakeholders": return <WStakeholders analysis={analysis} />;
      case "risks": return <WRisks analysis={analysis} />;
      case "budget": return <WBudget mandate={mandate} analysis={analysis} />;
      case "meetings": return <WMeetings analysis={analysis} />;
      case "deliverables": return <WDeliverables analysis={analysis} />;
      default: return null;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#060D18] text-gray-300">
      {sidebar && (
        <aside className="w-52 flex-shrink-0 border-r border-[#1A2840] flex flex-col bg-[#060D18]">
          <div className="p-4 border-b border-[#1A2840]">
            <div className="text-xs font-mono text-amber-500 tracking-widest">ZENCLOUD</div>
            <div className="text-sm font-black text-white tracking-widest" style={{ fontFamily: "'Barlow Condensed',sans-serif" }}>PM · PgM PORTAL</div>
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
              const Icon = v.icon;
              const active = view === v.id;
              return (
                <button key={v.id} onClick={() => setView(v.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded text-left text-xs border transition-all ${
                    active ? "bg-amber-500/15 text-amber-400 border-amber-500/25" : "text-gray-500 hover:text-gray-300 hover:bg-[#1A2840]/50 border-transparent"
                  }`}>
                  <Icon size={13} /> {v.label}
                </button>
              );
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
          <button onClick={() => setSidebar(!sidebar)} className="text-gray-600 hover:text-gray-300 transition-colors"><Menu size={15} /></button>
          <span className="text-sm font-medium text-white flex-1">{current?.label}</span>
          <div className="flex items-center gap-2">
            {mandate.location && <span className="text-xs font-mono text-gray-700"><MapPin size={10} className="inline mr-1" />{mandate.location}</span>}
            <Badge label={analysis.classification} variant="amber" />
            <Badge label={analysis.complexityLevel} variant="gray" />
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4">{renderView()}</main>
      </div>
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [appState, setAppState] = useState("intake");
  const [mandate, setMandate] = useState({
    engagementName: "", client: "", type: "Project", budget: "", duration: "",
    sector: "", location: "", startType: "Immediate", mandate: "", additionalContext: "",
  });
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Barlow+Condensed:wght@700;900&family=JetBrains+Mono:wght@400;500&display=swap');
      * { font-family: 'DM Sans', sans-serif; box-sizing: border-box; }
      .font-mono, .font-mono * { font-family: 'JetBrains Mono', monospace !important; }
      ::-webkit-scrollbar { width: 3px; height: 3px; }
      ::-webkit-scrollbar-thumb { background: #1A2840; border-radius: 2px; }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const handleAnalyze = async () => {
    setAppState("analyzing");
    setError(null);
    const msg = `ENGAGEMENT MANDATE:\nName: ${mandate.engagementName}\nClient: ${mandate.client}\nType: ${mandate.type}\nBudget: ${BUDGET_MAP[mandate.budget] || "Not specified"}\nDuration: ${DURATION_MAP[mandate.duration] || "Not specified"}\nSector: ${mandate.sector || "Not specified"}\nLocation: ${mandate.location || "TBC"}\nStart: ${mandate.startType}\n\nMANDATE:\n${mandate.mandate}\n\nADDITIONAL CONTEXT:\n${mandate.additionalContext || "None."}`;
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: PMI_PROMPT,
          messages: [{ role: "user", content: msg }],
        }),
      });
      const data = await res.json();
      const text = data.content?.find(b => b.type === "text")?.text || "";
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setAnalysis(parsed);
      setAppState("briefing");
    } catch (err) {
      setError("Analysis failed — check API connection and retry.");
      setAppState("intake");
    }
  };

  const reset = () => { setAppState("intake"); setAnalysis(null); setError(null); };

  if (appState === "intake") return <IntakeScreen mandate={mandate} setMandate={setMandate} onAnalyze={handleAnalyze} onLoadDemo={() => setMandate(VOLVO_DEMO)} error={error} />;
  if (appState === "analyzing") return <AnalyzingScreen mandate={mandate} />;
  if (appState === "briefing") return <BriefingRoom mandate={mandate} analysis={analysis} onEnterWorkspace={() => setAppState("workspace")} onReset={reset} />;
  if (appState === "workspace") return <Workspace mandate={mandate} analysis={analysis} onReset={reset} />;
  return null;
}
