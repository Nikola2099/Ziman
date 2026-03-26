import type { LucideIcon } from 'lucide-react';

interface Props {
  title: string;
  value: string | number;
  sub?: string;
  icon: LucideIcon;
  color: 'sky' | 'emerald' | 'amber' | 'red' | 'slate' | 'violet';
}

const COLOR_MAP = {
  sky:     { bg: 'bg-sky-50',     icon: 'bg-sky-100 text-sky-600',     border: 'border-sky-200' },
  emerald: { bg: 'bg-emerald-50', icon: 'bg-emerald-100 text-emerald-600', border: 'border-emerald-200' },
  amber:   { bg: 'bg-amber-50',   icon: 'bg-amber-100 text-amber-600',   border: 'border-amber-200' },
  red:     { bg: 'bg-red-50',     icon: 'bg-red-100 text-red-600',       border: 'border-red-200' },
  slate:   { bg: 'bg-slate-50',   icon: 'bg-slate-100 text-slate-600',   border: 'border-slate-200' },
  violet:  { bg: 'bg-violet-50',  icon: 'bg-violet-100 text-violet-600', border: 'border-violet-200' },
};

export function StatsCard({ title, value, sub, icon: Icon, color }: Props) {
  const c = COLOR_MAP[color];
  return (
    <div className={`rounded-xl border ${c.border} ${c.bg} p-5 flex items-center gap-4`}>
      <div className={`flex-shrink-0 rounded-lg p-3 ${c.icon}`}>
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <p className="text-sm text-slate-500 font-medium">{title}</p>
        <p className="text-2xl font-bold text-slate-800 leading-tight">{value}</p>
        {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}
