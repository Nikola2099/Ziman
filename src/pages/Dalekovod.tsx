import { useState } from 'react';
import { Plus, Pencil, Trash2, Search, TramFront } from 'lucide-react';
import { useAssets } from '../context/AssetContext';
import { StatusBadge } from '../components/StatusBadge';
import { Modal } from '../components/Modal';
import { ConfirmDialog } from '../components/ConfirmDialog';
import type { Dalekovod as DalekovodType, AssetStatus } from '../types';
import { STATUS_LABELS } from '../types';

const EMPTY: Omit<DalekovodType, 'id'> = {
  name: '', voltage: 110, length: 0,
  from_point: '', to_point: '',
  conductor_type: 'Al/Fe 240/40 mm²',
  status: 'operational',
  installation_date: '', last_inspection: '',
  notes: '',
};

function DalekovodForm({ value, onChange }: { value: Omit<DalekovodType, 'id'>; onChange: (v: Omit<DalekovodType, 'id'>) => void }) {
  const set = (field: keyof Omit<DalekovodType, 'id'>, val: string | number) =>
    onChange({ ...value, [field]: val });

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="col-span-2">
        <label className="block text-sm font-medium text-slate-700 mb-1">Naziv *</label>
        <input className="input-field" value={value.name} onChange={e => set('name', e.target.value)} placeholder="DV 110 kV Ziman – Zrenjanin" />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Napon (kV)</label>
        <input type="number" className="input-field" value={value.voltage} onChange={e => set('voltage', parseInt(e.target.value))} />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Dužina (km)</label>
        <input type="number" step="0.1" className="input-field" value={value.length} onChange={e => set('length', parseFloat(e.target.value))} />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Iz (čvor od)</label>
        <input className="input-field" value={value.from_point} onChange={e => set('from_point', e.target.value)} placeholder="TS Ziman" />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Do (čvor do)</label>
        <input className="input-field" value={value.to_point} onChange={e => set('to_point', e.target.value)} placeholder="TS Zrenjanin 2" />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Tip provodnika</label>
        <input className="input-field" value={value.conductor_type} onChange={e => set('conductor_type', e.target.value)} placeholder="Al/Fe 240/40 mm²" />
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
      <div className="col-span-2">
        <label className="block text-sm font-medium text-slate-700 mb-1">Napomene</label>
        <textarea rows={2} className="input-field resize-none" value={value.notes} onChange={e => set('notes', e.target.value)} />
      </div>
    </div>
  );
}

export function DalekovodPage() {
  const { state, dispatch } = useAssets();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<AssetStatus | 'all'>('all');
  const [modal, setModal] = useState<null | 'add' | 'edit'>(null);
  const [editing, setEditing] = useState<DalekovodType | null>(null);
  const [form, setForm] = useState<Omit<DalekovodType, 'id'>>(EMPTY);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = state.dalekovodi.filter(d => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.from_point.toLowerCase().includes(search.toLowerCase()) ||
      d.to_point.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || d.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const openAdd = () => { setForm(EMPTY); setModal('add'); };
  const openEdit = (d: DalekovodType) => { setEditing(d); setForm({ ...d }); setModal('edit'); };
  const closeModal = () => { setModal(null); setEditing(null); };

  const handleSave = () => {
    if (!form.name.trim()) return;
    if (modal === 'add') {
      dispatch({ type: 'ADD_DALEKOVOD', payload: { ...form, id: `dl-${Date.now()}` } });
    } else if (editing) {
      dispatch({ type: 'UPDATE_DALEKOVOD', payload: { ...form, id: editing.id } });
    }
    closeModal();
  };

  const handleDelete = () => {
    if (deleteId) { dispatch({ type: 'DELETE_DALEKOVOD', payload: deleteId }); setDeleteId(null); }
  };

  const totalLength = state.dalekovodi.reduce((s, d) => s + d.length, 0);

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-sky-100 p-2">
            <TramFront className="h-6 w-6 text-sky-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Dalekovodi</h1>
            <p className="text-slate-500 text-sm">{state.dalekovodi.length} dalekovod · {totalLength.toFixed(1)} km ukupno</p>
          </div>
        </div>
        <button onClick={openAdd} className="btn-primary">
          <Plus className="h-4 w-4" /> Dodaj dalekovod
        </button>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            className="input-field pl-9"
            placeholder="Pretraži po nazivu, čvorovima..."
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
              {['Naziv', 'Napon (kV)', 'Dužina (km)', 'Od', 'Do', 'Tip provodnika', 'Status', 'Akcije'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.length === 0 ? (
              <tr><td colSpan={8} className="px-4 py-10 text-center text-slate-400">Nema rezultata</td></tr>
            ) : filtered.map(d => (
              <tr key={d.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 font-medium text-slate-900">{d.name}</td>
                <td className="px-4 py-3 text-slate-700 font-medium">{d.voltage}</td>
                <td className="px-4 py-3 text-slate-700">{d.length.toFixed(1)}</td>
                <td className="px-4 py-3 text-slate-600 max-w-[160px] truncate" title={d.from_point}>{d.from_point}</td>
                <td className="px-4 py-3 text-slate-600 max-w-[160px] truncate" title={d.to_point}>{d.to_point}</td>
                <td className="px-4 py-3 text-slate-600">{d.conductor_type}</td>
                <td className="px-4 py-3"><StatusBadge status={d.status} /></td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(d)} className="rounded-lg p-1.5 text-slate-400 hover:bg-sky-50 hover:text-sky-600 transition-colors">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button onClick={() => setDeleteId(d.id)} className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors">
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
        <Modal title={modal === 'add' ? 'Dodaj dalekovod' : `Uredi – ${editing?.name}`} onClose={closeModal}>
          <DalekovodForm value={form} onChange={setForm} />
          <div className="mt-6 flex justify-end gap-3">
            <button onClick={closeModal} className="btn-secondary">Otkaži</button>
            <button onClick={handleSave} className="btn-primary">Sačuvaj</button>
          </div>
        </Modal>
      )}

      {deleteId && (
        <ConfirmDialog
          message={`Da li ste sigurni da želite da obrišete ${state.dalekovodi.find(d => d.id === deleteId)?.name}?`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  );
}
