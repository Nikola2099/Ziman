import { Wind, Zap, TramFront, Cable, AlertTriangle, CheckCircle, WrenchIcon, PowerOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAssets } from '../context/AssetContext';
import { StatsCard } from '../components/StatsCard';
import type { AssetStatus } from '../types';
import { STATUS_LABELS } from '../types';

const STATUS_BAR_COLORS: Record<AssetStatus, string> = {
  operational:   'bg-emerald-500',
  maintenance:   'bg-amber-400',
  fault:         'bg-red-500',
  stopped:       'bg-slate-400',
  commissioning: 'bg-sky-400',
};

function StatusBar({ items }: { items: { status: AssetStatus }[] }) {
  const total = items.length;
  if (total === 0) return <p className="text-sm text-slate-400">Nema unosa</p>;

  const counts = items.reduce<Record<AssetStatus, number>>((acc, i) => {
    acc[i.status] = (acc[i.status] || 0) + 1;
    return acc;
  }, {} as Record<AssetStatus, number>);

  const order: AssetStatus[] = ['operational', 'maintenance', 'fault', 'stopped', 'commissioning'];

  return (
    <div className="space-y-2">
      <div className="flex h-3 w-full overflow-hidden rounded-full bg-slate-100">
        {order.map(s =>
          counts[s] ? (
            <div
              key={s}
              className={`${STATUS_BAR_COLORS[s]} transition-all`}
              style={{ width: `${(counts[s] / total) * 100}%` }}
              title={`${STATUS_LABELS[s]}: ${counts[s]}`}
            />
          ) : null
        )}
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1">
        {order.map(s =>
          counts[s] ? (
            <span key={s} className="flex items-center gap-1.5 text-xs text-slate-500">
              <span className={`h-2 w-2 rounded-full ${STATUS_BAR_COLORS[s]}`} />
              {STATUS_LABELS[s]}: <strong className="text-slate-700">{counts[s]}</strong>
            </span>
          ) : null
        )}
      </div>
    </div>
  );
}

interface CategoryCardProps {
  title: string;
  to: string;
  icon: React.ElementType;
  items: { status: AssetStatus }[];
}

function CategoryCard({ title, to, icon: Icon, items }: CategoryCardProps) {
  const faults = items.filter(i => i.status === 'fault').length;
  return (
    <Link
      to={to}
      className="block rounded-xl border border-slate-200 bg-white p-5 hover:border-sky-300 hover:shadow-md transition-all group"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-slate-100 p-2 group-hover:bg-sky-50 transition-colors">
            <Icon className="h-5 w-5 text-slate-600 group-hover:text-sky-600" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800">{title}</h3>
            <p className="text-sm text-slate-500">{items.length} ukupno</p>
          </div>
        </div>
        {faults > 0 && (
          <span className="flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-1 text-xs font-medium text-red-700">
            <AlertTriangle className="h-3 w-3" />
            {faults} kvar{faults > 1 ? 'a' : ''}
          </span>
        )}
      </div>
      <StatusBar items={items} />
    </Link>
  );
}

export function Dashboard() {
  const { state } = useAssets();
  const { wtgs, trafostanice, dalekovodi, kablovi } = state;

  const allAssets = [...wtgs, ...trafostanice, ...dalekovodi, ...kablovi];
  const operational = allAssets.filter(a => a.status === 'operational').length;
  const faults      = allAssets.filter(a => a.status === 'fault').length;
  const maintenance = allAssets.filter(a => a.status === 'maintenance').length;
  const stopped     = allAssets.filter(a => a.status === 'stopped').length;

  const totalPowerMW = wtgs.reduce((s, w) => s + w.rated_power, 0);
  const avgAvailability = wtgs.length
    ? (wtgs.reduce((s, w) => s + w.availability, 0) / wtgs.length).toFixed(1)
    : '–';

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Pregled projekta</h1>
        <p className="text-slate-500 mt-1">Vetroelektrana Ziman – Vojvodina, Srbija</p>
      </div>

      {/* Top stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Ukupno imovine"
          value={allAssets.length}
          sub={`${wtgs.length} WTG · ${trafostanice.length} TS · ${dalekovodi.length} DV · ${kablovi.length} KB`}
          icon={CheckCircle}
          color="sky"
        />
        <StatsCard
          title="Operativni"
          value={operational}
          sub={`${((operational / allAssets.length) * 100).toFixed(0)}% od ukupnog broja`}
          icon={CheckCircle}
          color="emerald"
        />
        <StatsCard
          title="Kvarovi"
          value={faults}
          sub={maintenance > 0 ? `+ ${maintenance} na održavanju` : 'Nema planiranih'}
          icon={AlertTriangle}
          color={faults > 0 ? 'red' : 'slate'}
        />
        <StatsCard
          title="Isključeni"
          value={stopped}
          sub="Ručno ili automatski"
          icon={PowerOff}
          color="slate"
        />
      </div>

      {/* WTG specific stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Instalirana snaga"
          value={`${totalPowerMW} MW`}
          sub={`${wtgs.length} × ${wtgs[0]?.rated_power ?? 0} MW`}
          icon={Wind}
          color="violet"
        />
        <StatsCard
          title="Prosečna dostupnost WTG"
          value={`${avgAvailability}%`}
          sub="Kumulativno od puštanja u rad"
          icon={Wind}
          color="emerald"
        />
        <StatsCard
          title="Na održavanju"
          value={maintenance}
          sub="WTG + TS + ostalo"
          icon={WrenchIcon}
          color="amber"
        />
        <StatsCard
          title="Kablovi s kvarom"
          value={kablovi.filter(k => k.status === 'fault').length}
          sub={`od ${kablovi.length} ukupno`}
          icon={Cable}
          color={kablovi.filter(k => k.status === 'fault').length > 0 ? 'red' : 'slate'}
        />
      </div>

      {/* Category cards */}
      <div>
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Status po kategorijama</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CategoryCard title="Vetroagregati (WTG)" to="/wtgs"         icon={Wind}     items={wtgs} />
          <CategoryCard title="Trafostanice"         to="/trafostanica" icon={Zap}      items={trafostanice} />
          <CategoryCard title="Dalekovodi"           to="/dalekovod"    icon={TramFront} items={dalekovodi} />
          <CategoryCard title="Kablovi"              to="/kablovi"      icon={Cable}    items={kablovi} />
        </div>
      </div>
    </div>
  );
}
