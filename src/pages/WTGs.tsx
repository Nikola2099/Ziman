import { useState } from 'react';
import { Plus, Pencil, Trash2, Search, Wind } from 'lucide-react';
import { useAssets } from '../context/AssetContext';
import { StatusBadge } from '../components/StatusBadge';
import { Modal } from '../components/Modal';
import { ConfirmDialog } from '../components/ConfirmDialog';
import type { WTG, AssetStatus } from '../types';
import { STATUS_LABELS } from '../types';

const EMPTY: Omit<WTG, 'id'> = {
  name: '', manufacturer: 'Vestas', model: 'V150-4.5',
  rated_power: 4.5, hub_height: 105, rotor_diameter: 150,
  status: 'operational',
  installation_date: '', last_maintenance: '', next_maintenance: '',
  energy_produced: 0, availability: 0, notes: '',
};

function WTGForm({ value, onChange }: { value: Omit<WTG, 'id'>; onChange: (v: Omit<WTG, 'id'>) => void }) {
  const set = (field: keyof Omit<WTG, 'id'>, val: string | number) =>
    onChange({ ...value, [field]: val });

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="col-span-2">
        <label className="block text-sm font-medium text-slate-700 mb-1">Naziv *</label>
        <input className="input-field" value={value.name} onChange={e => set('name', e.target.value)} placeholder="Z-WTG-11" />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Proizvođač</label>
        <input className="input-field" value={value.manufacturer} onChange={e => set('manufacturer', e.target.value)} />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Model</label>
        <input className="input-field" value={value.model} onChange={e => set('model', e.target.value)} />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Nominalna snaga (MW)</label>
        <input type="number" step="0.1" className="input-field" value={value.rated_power} onChange={e => set('rated_power', parseFloat(e.target.value))} />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Visina haba (m)</label>
        <input type="number" className="input-field" value={value.hub_height} onChange={e => set('hub_height', parseInt(e.target.value))} />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Prečnik rotora (m)</label>
        <input type="number" className="input-field" value={value.rotor_diameter} onChange={e => set('rotor_diameter', parseInt(e.target.value))} />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
        <select className="input-field" value={value.status} onChange={e => set('status', e.target.value as AssetStatus)}>
          {(Object.keys(STATUS_LABELS) as AssetStatus[]).map(s => (
            <option key={s} value={s}>{STATUS_LABELS[s]}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Datum instalacije</label>
        <input type="date" className="input-field" value={value.installation_date} onChange={e => set('installation_date', e.target.value)} />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Poslednje održavanje</label>
        <input type="date" className="input-field" value={value.last_maintenance} onChange={e => set('last_maintenance', e.target.value)} />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Sledeće održavanje</label>
        <input type="date" className="input-field" value={value.next_maintenance} onChange={e => set('next_maintenance', e.target.value)} />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Dostupnost (%)</label>
        <input type="number" step="0.1" min="0" max="100" className="input-field" value={value.availability} onChange={e => set('availability', parseFloat(e.target.value))} />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Energija (MWh)</label>
        <input type="number" className="input-field" value={value.energy_produced} onChange={e => set('energy_produced', parseFloat(e.target.value))} />
      </div>
      <div className="col-span-2">
        <label className="block text-sm font-medium text-slate-700 mb-1">Napomene</label>
        <textarea rows={2} className="input-field resize-none" value={value.notes} onChange={e => set('notes', e.target.value)} />
      </div>
    </div>
  );
}

export function WTGs() {
  const { state, dispatch } = useAssets();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<AssetStatus | 'all'>('all');
  const [modal, setModal] = useState<null | 'add' | 'edit'>(null);
  const [editing, setEditing] = useState<WTG | null>(null);
  const [form, setForm] = useState<Omit<WTG, 'id'>>(EMPTY);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = state.wtgs.filter(w => {
    const matchSearch = w.name.toLowerCase().includes(search.toLowerCase()) ||
      w.model.toLowerCase().includes(search.toLowerCase()) ||
      w.manufacturer.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || w.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const openAdd = () => { setForm(EMPTY); setModal('add'); };
  const openEdit = (w: WTG) => { setEditing(w); setForm({ ...w }); setModal('edit'); };
  const closeModal = () => { setModal(null); setEditing(null); };

  const handleSave = () => {
    if (!form.name.trim()) return;
    if (modal === 'add') {
      dispatch({ type: 'ADD_WTG', payload: { ...form, id: `wtg-${Date.now()}` } });
    } else if (editing) {
      dispatch({ type: 'UPDATE_WTG', payload: { ...form, id: editing.id } });
    }
    closeModal();
  };

  const handleDelete = () => {
    if (deleteId) { dispatch({ type: 'DELETE_WTG', payload: deleteId }); setDeleteId(null); }
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-sky-100 p-2">
            <Wind className="h-6 w-6 text-sky-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Vetroagregati</h1>
            <p className="text-slate-500 text-sm">{state.wtgs.length} WTG · {(state.wtgs.reduce((s, w) => s + w.rated_power, 0)).toFixed(1)} MW instalirana snaga</p>
          </div>
        </div>
        <button onClick={openAdd} className="btn-primary">
          <Plus className="h-4 w-4" /> Dodaj WTG
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            className="input-field pl-9"
            placeholder="Pretraži po nazivu, modelu..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select className="input-field w-auto" value={filterStatus} onChange={e => setFilterStatus(e.target.value as AssetStatus | 'all')}>
          <option value="all">Svi statusi</option>
          {(Object.keys(STATUS_LABELS) as AssetStatus[]).map(s => (
            <option key={s} value={s}>{STATUS_LABELS[s]}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              {['Naziv', 'Proizvođač / Model', 'Snaga (MW)', 'Visina haba (m)', 'Status', 'Dostupnost', 'Sledeće održavanje', 'Akcije'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-slate-400">Nema rezultata</td>
              </tr>
            ) : filtered.map(w => (
              <tr key={w.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 font-medium text-slate-900">{w.name}</td>
                <td className="px-4 py-3 text-slate-600">{w.manufacturer} {w.model}</td>
                <td className="px-4 py-3 text-slate-700 font-medium">{w.rated_power}</td>
                <td className="px-4 py-3 text-slate-600">{w.hub_height} m</td>
                <td className="px-4 py-3"><StatusBadge status={w.status} /></td>
                <td className="px-4 py-3 text-slate-700">{w.availability.toFixed(1)}%</td>
                <td className="px-4 py-3 text-slate-600">{w.next_maintenance || '–'}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(w)} className="rounded-lg p-1.5 text-slate-400 hover:bg-sky-50 hover:text-sky-600 transition-colors">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button onClick={() => setDeleteId(w.id)} className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <Modal title={modal === 'add' ? 'Dodaj vetroagregat' : `Uredi – ${editing?.name}`} onClose={closeModal}>
          <WTGForm value={form} onChange={setForm} />
          <div className="mt-6 flex justify-end gap-3">
            <button onClick={closeModal} className="btn-secondary">Otkaži</button>
            <button onClick={handleSave} className="btn-primary">Sačuvaj</button>
          </div>
        </Modal>
      )}

      {deleteId && (
        <ConfirmDialog
          message={`Da li ste sigurni da želite da obrišete ${state.wtgs.find(w => w.id === deleteId)?.name}?`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  );
}
