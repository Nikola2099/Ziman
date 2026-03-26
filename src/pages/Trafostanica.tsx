import { useState } from 'react';
import { Plus, Pencil, Trash2, Search, Zap } from 'lucide-react';
import { useAssets } from '../context/AssetContext';
import { StatusBadge } from '../components/StatusBadge';
import { Modal } from '../components/Modal';
import { ConfirmDialog } from '../components/ConfirmDialog';
import type { Trafostanica as TrafoType, AssetStatus } from '../types';
import { STATUS_LABELS } from '../types';

const EMPTY: Omit<TrafoType, 'id'> = {
  name: '', trafo_type: 'Transformator vetroparka',
  voltage_high: 35, voltage_low: 0.69, rated_power: 5,
  status: 'operational',
  installation_date: '', last_inspection: '', next_inspection: '',
  notes: '',
};

function TrafoForm({ value, onChange }: { value: Omit<TrafoType, 'id'>; onChange: (v: Omit<TrafoType, 'id'>) => void }) {
  const set = (field: keyof Omit<TrafoType, 'id'>, val: string | number) =>
    onChange({ ...value, [field]: val });

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="col-span-2">
        <label className="block text-sm font-medium text-slate-700 mb-1">Naziv *</label>
        <input className="input-field" value={value.name} onChange={e => set('name', e.target.value)} placeholder="TS Ziman 35/0.69 kV" />
      </div>
      <div className="col-span-2">
        <label className="block text-sm font-medium text-slate-700 mb-1">Tip trafostanice</label>
        <input className="input-field" value={value.trafo_type} onChange={e => set('trafo_type', e.target.value)} />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Napon – primarni (kV)</label>
        <input type="number" step="0.1" className="input-field" value={value.voltage_high} onChange={e => set('voltage_high', parseFloat(e.target.value))} />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Napon – sekundarni (kV)</label>
        <input type="number" step="0.01" className="input-field" value={value.voltage_low} onChange={e => set('voltage_low', parseFloat(e.target.value))} />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Nominalna snaga (MVA)</label>
        <input type="number" step="0.1" className="input-field" value={value.rated_power} onChange={e => set('rated_power', parseFloat(e.target.value))} />
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
        <label className="block text-sm font-medium text-slate-700 mb-1">Poslednja inspekcija</label>
        <input type="date" className="input-field" value={value.last_inspection} onChange={e => set('last_inspection', e.target.value)} />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Sledeća inspekcija</label>
        <input type="date" className="input-field" value={value.next_inspection} onChange={e => set('next_inspection', e.target.value)} />
      </div>
      <div className="col-span-2">
        <label className="block text-sm font-medium text-slate-700 mb-1">Napomene</label>
        <textarea rows={2} className="input-field resize-none" value={value.notes} onChange={e => set('notes', e.target.value)} />
      </div>
    </div>
  );
}

export function TrafostanicaPage() {
  const { state, dispatch } = useAssets();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<AssetStatus | 'all'>('all');
  const [modal, setModal] = useState<null | 'add' | 'edit'>(null);
  const [editing, setEditing] = useState<TrafoType | null>(null);
  const [form, setForm] = useState<Omit<TrafoType, 'id'>>(EMPTY);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = state.trafostanice.filter(t => {
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.trafo_type.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || t.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const openAdd = () => { setForm(EMPTY); setModal('add'); };
  const openEdit = (t: TrafoType) => { setEditing(t); setForm({ ...t }); setModal('edit'); };
  const closeModal = () => { setModal(null); setEditing(null); };

  const handleSave = () => {
    if (!form.name.trim()) return;
    if (modal === 'add') {
      dispatch({ type: 'ADD_TRAFOSTANICA', payload: { ...form, id: `ts-${Date.now()}` } });
    } else if (editing) {
      dispatch({ type: 'UPDATE_TRAFOSTANICA', payload: { ...form, id: editing.id } });
    }
    closeModal();
  };

  const handleDelete = () => {
    if (deleteId) { dispatch({ type: 'DELETE_TRAFOSTANICA', payload: deleteId }); setDeleteId(null); }
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-sky-100 p-2">
            <Zap className="h-6 w-6 text-sky-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Trafostanice</h1>
            <p className="text-slate-500 text-sm">{state.trafostanice.length} trafostanica na projektu</p>
          </div>
        </div>
        <button onClick={openAdd} className="btn-primary">
          <Plus className="h-4 w-4" /> Dodaj trafostandicu
        </button>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            className="input-field pl-9"
            placeholder="Pretraži po nazivu ili tipu..."
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

      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              {['Naziv', 'Tip', 'Napon VN/NN (kV)', 'Snaga (MVA)', 'Status', 'Sledeća inspekcija', 'Akcije'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-10 text-center text-slate-400">Nema rezultata</td></tr>
            ) : filtered.map(t => (
              <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 font-medium text-slate-900">{t.name}</td>
                <td className="px-4 py-3 text-slate-600">{t.trafo_type}</td>
                <td className="px-4 py-3 text-slate-700">{t.voltage_high} / {t.voltage_low} kV</td>
                <td className="px-4 py-3 text-slate-700 font-medium">{t.rated_power} MVA</td>
                <td className="px-4 py-3"><StatusBadge status={t.status} /></td>
                <td className="px-4 py-3 text-slate-600">{t.next_inspection || '–'}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(t)} className="rounded-lg p-1.5 text-slate-400 hover:bg-sky-50 hover:text-sky-600 transition-colors">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button onClick={() => setDeleteId(t.id)} className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors">
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
        <Modal title={modal === 'add' ? 'Dodaj trafostandicu' : `Uredi – ${editing?.name}`} onClose={closeModal}>
          <TrafoForm value={form} onChange={setForm} />
          <div className="mt-6 flex justify-end gap-3">
            <button onClick={closeModal} className="btn-secondary">Otkaži</button>
            <button onClick={handleSave} className="btn-primary">Sačuvaj</button>
          </div>
        </Modal>
      )}

      {deleteId && (
        <ConfirmDialog
          message={`Da li ste sigurni da želite da obrišete ${state.trafostanice.find(t => t.id === deleteId)?.name}?`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  );
}
