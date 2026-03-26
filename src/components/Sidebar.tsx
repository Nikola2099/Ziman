import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Wind,
  Zap,
  TramFront,
  Cable,
  FileText,
} from 'lucide-react';

const NAV = [
  { to: '/',             label: 'Pregled',           icon: LayoutDashboard },
  { to: '/imovina',      label: 'Rešavanje imovine', icon: FileText },
  { to: '/wtgs',         label: 'Vetroagregati',     icon: Wind },
  { to: '/trafostanica', label: 'Trafostanica',      icon: Zap },
  { to: '/dalekovod',    label: 'Dalekovod',         icon: TramFront },
  { to: '/kablovi',      label: 'Kablovi',           icon: Cable },
];

export function Sidebar() {
  return (
    <aside className="flex h-screen w-60 flex-col bg-slate-900 text-white flex-shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-slate-700/60">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-500">
          <Wind className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="font-bold text-white leading-tight">Ziman</p>
          <p className="text-xs text-slate-400">Upravljanje imovinom</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-sky-500/20 text-sky-400'
                  : 'text-slate-400 hover:bg-slate-700/50 hover:text-white'
              }`
            }
          >
            <Icon className="h-4 w-4 flex-shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-slate-700/60 px-5 py-4">
        <p className="text-xs text-slate-500">VE Ziman · Vojvodina, Srbija</p>
      </div>
    </aside>
  );
}
