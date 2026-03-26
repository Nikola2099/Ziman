import type { AssetStatus } from '../types';
import { STATUS_LABELS } from '../types';

const STYLES: Record<AssetStatus, string> = {
  operational:   'bg-emerald-100 text-emerald-800 ring-1 ring-emerald-300',
  maintenance:   'bg-amber-100  text-amber-800  ring-1 ring-amber-300',
  fault:         'bg-red-100    text-red-800    ring-1 ring-red-300',
  stopped:       'bg-slate-100  text-slate-600  ring-1 ring-slate-300',
  commissioning: 'bg-sky-100    text-sky-800    ring-1 ring-sky-300',
};

export function StatusBadge({ status }: { status: AssetStatus }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STYLES[status]}`}>
      <span className={`mr-1.5 h-1.5 w-1.5 rounded-full ${
        status === 'operational'   ? 'bg-emerald-500' :
        status === 'maintenance'   ? 'bg-amber-500'   :
        status === 'fault'         ? 'bg-red-500'     :
        status === 'stopped'       ? 'bg-slate-400'   :
        'bg-sky-500'
      }`} />
      {STATUS_LABELS[status]}
    </span>
  );
}
