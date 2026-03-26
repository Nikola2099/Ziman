import { useState } from 'react';
import { Plus, Pencil, Trash2, Search, Cable } from 'lucide-react';
import { useAssets } from '../context/AssetContext';
import { StatusBadge } from '../components/StatusBadge';
import { Modal } from '../components/Modal';
import { ConfirmDialog } from '../components/ConfirmDialog';
import type { Kabel, AssetStatus } from '../types';
import { STATUS_LABELS } from '../types';

const EMPTY: Omit<Kabel, 'id'> = {
  name: '', voltage: 35, cross_section: 185, length: 0,
  from_point: '', to_point: '',
  cable_type: 'XLPE',
  status: 'operational',
  installation_date: '', notes: '',
};

function KabelForm({ value, onChange }: { value: Omit<Kabel, 'id'>; onChange: (v: Omit<Kabel, 'id'>) => void }) {
  const set = (field: keyof Omit<Kabel, 'id'>, val: string | number) =>
    onChange({ ...value, [field]: val });

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="col-span-2">
        <label className="block text-sm font-medium text-slate-700 mb-1">Naziv *</label>
        <input className="input-field" value={value.name} onChange={e => set('name', e.target.value)} placeholder="KB-35kV-A1" />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Napon (kV)</label>
        <input type="number" step="0.1" className="input-field" value={value.voltage} onChange={e => set('voltage', parseFloat(e.target.value))} />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Presek provodnika (mm²)</label>
        <input type="number" className="input-field" value={value.cross_section} onChange={e => set('cross_section', parseInt(e.target.value))} />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Dužina (m)</label>
        <input type="number" className="input-field" value={value.length} onChange={e => set('length', parseFloat(e.target.value))} />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Tip kabla</label>
        <input className="input-field" value={value.cable_type} onChange={e => set('cable_type', e.target.value)} placeholder="XLPE" />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Iz (čvor od)</label>
        <input className="input-field" value={value.from_point} onChange={e => set('from_point', e.target.value)} placeholder="TS Blok A" />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Do (čvor do)</label>
        <input className="input-field" value={value.to_point} onChange={e => set('to_point', e.target.value)} placeholder="Z-WTG-01" />
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
      <div className="col-span-2">
        <label className="block text-sm font-medium text-slate-700 mb-1">Napomene</label>
        <textarea rows={2} className="input-field resize-none" value={value.notes} onChange={e => set('notes', e.target.value)} />
      </div>
    </div>
  );
}

export function KabloviPage() {
  const { state, dispatch } = useAssets();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<AssetStatus | 'all'>('all');
  const [modal, setModal] = useState<null | 'add' | 'edit'>(null);
  const [editing, setEditing] = useState<Kabel | null>(null);
  const [form, setForm] = useState<Omit<Kabel, 'id'>>(EMPTY);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = state.kablovi.filter(k => {
    const matchSearch = k.name.toLowerCase().includes(search.toLowerCase()) ||
      k.from_point.toLowerCase().includes(search.toLowerCase()) ||
      k.to_point.toLowerCase().includes(search.toLowerCase()) ||
      k.cable_type.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || k.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const openAdd = () => { setForm(EMPTY); setModal('add'); };
  const openEdit = (k: Kabel) => { setEditing(k); setForm({ ...k }); setModal('edit'); };
  const closeModal = () => { setModal(null); setEditing(null); };

  const handleSave = () => {
    if (!form.name.trim()) return;
    if (modal === 'add') {
      dispatch({ type: 'ADD_KABEL', payload: { ...form, id: `kb-${Date.now()}` } });
    } else if (editing) {
      dispatch({ type: 'UPDATE_KABEL', payload: { ...form, id: editing.id } });
    }
    closeModal();
  };

  const handleDelete = () => {
    if (deleteId) { dispatch({ type: 'DELETE_KABEL', payload: deleteId }); setDeleteId(null); }
  };

  const totalLength = state.kablovi.reduce((s, k) => s + k.length, 0);

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-sky-100 p-2">
            <Cable className="h-6 w-6 text-sky-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Kablovi</h1>
            <p className="text-slate-500 text-sm">{state.kablovi.length} kablovskih veza · {(totalLength / 1000).toFixed(2)} km ukupno</p>
          </div>
        </div>
        <button onClick={openAdd} className="btn-primary">
          <Plus className="h-4 w-4" /> Dodaj kabl
        </button>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            className="input-field pl-9"
            placeholder="Pretraži po nazivu, tipu, čvorovima..."
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
              {['Naziv', 'Tip', 'Napon (kV)', 'Presek (mm²)', 'Dužina (m)', 'Od', 'Do', 'Status', 'Akcije'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.length === 0 ? (
              <tr><td colSpan={9} className="px-4 py-10 text-center text-slate-400">Nema rezultata</td></tr>
            ) : filtered.map(k => (
              <tr key={k.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 font-medium text-slate-900">{k.name}</td>
                <td className="px-4 py-3 text-slate-600">{k.cable_type}</td>
                <td className="px-4 py-3 text-slate-700 font-medium">{k.voltage}</td>
                <td className="px-4 py-3 text-slate-700">{k.cross_section}</td>
                <td className="px-4 py-3 text-slate-700">{k.length.toLocaleString()}</td>
                <td className="px-4 py-3 text-slate-600 max-w-[140px] truncate" title={k.from_point}>{k.from_point}</td>
                <td className="px-4 py-3 text-slate-600 max-w-[140px] truncate" title={k.to_point}>{k.to_point}</td>
                <td className="px-4 py-3"><StatusBadge status={k.status} /></td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(k)} className="rounded-lg p-1.5 text-slate-400 hover:bg-sky-50 hover:text-sky-600 transition-colors">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button onClick={() => setDeleteId(k.id)} className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors">
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
        <Modal title={modal === 'add' ? 'Dodaj kabl' : `Uredi – ${editing?.name}`} onClose={closeModal}>
          <KabelForm value={form} onChange={setForm} />
          <div className="mt-6 flex justify-end gap-3">
            <button onClick={closeModal} className="btn-secondary">Otkaži</button>
            <button onClick={handleSave} className="btn-primary">Sačuvaj</button>
          </div>
        </Modal>
      )}

      {deleteId && (
        <ConfirmDialog
          message={`Da li ste sigurni da želite da obrišete ${state.kablovi.find(k => k.id === deleteId)?.name}?`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  );
}
