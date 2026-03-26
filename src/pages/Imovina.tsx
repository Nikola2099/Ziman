import { useState, useMemo } from 'react';
import { Plus, Pencil, Trash2, Search, FileText, ChevronDown, ChevronRight } from 'lucide-react';
import { useAssets } from '../context/AssetContext';
import { Modal } from '../components/Modal';
import { ConfirmDialog } from '../components/ConfirmDialog';
import type { Parcela, ImovinaStatus } from '../types';
import { IMOVINA_STATUS_LABELS } from '../types';

// ── Status badge ─────────────────────────────────────────────────────────────

const STATUS_STYLES: Record<ImovinaStatus, string> = {
  nije_kontaktirano: 'bg-slate-100 text-slate-600 ring-1 ring-slate-300',
  u_pregovorima:     'bg-amber-100  text-amber-800  ring-1 ring-amber-300',
  usmeno:            'bg-sky-100    text-sky-800    ring-1 ring-sky-300',
  ugovoreno:         'bg-emerald-100 text-emerald-800 ring-1 ring-emerald-300',
  overeno:           'bg-green-100  text-green-900  ring-1 ring-green-400',
  odbijeno:          'bg-red-100    text-red-800    ring-1 ring-red-300',
};

const STATUS_DOT: Record<ImovinaStatus, string> = {
  nije_kontaktirano: 'bg-slate-400',
  u_pregovorima:     'bg-amber-500',
  usmeno:            'bg-sky-500',
  ugovoreno:         'bg-emerald-500',
  overeno:           'bg-green-600',
  odbijeno:          'bg-red-500',
};

function ImovinaStatusBadge({ status }: { status: ImovinaStatus }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap ${STATUS_STYLES[status]}`}>
      <span className={`mr-1.5 h-1.5 w-1.5 rounded-full flex-shrink-0 ${STATUS_DOT[status]}`} />
      {IMOVINA_STATUS_LABELS[status]}
    </span>
  );
}

// ── Form ─────────────────────────────────────────────────────────────────────

const EMPTY: Omit<Parcela, 'id'> = {
  turbina: '',
  parcela_broj: '',
  povrsina_parcele: 0,
  vrsta_zemljista: 'Poljoprivredno zemljište',
  katastarska_opstina: '',
  kultura: '',
  vlasnik: '',
  povrsina_zauzeca: 0,
  opcija1_jednokratno: 0,
  opcija1_godisnje: 0,
  komentar: '',
  status: 'nije_kontaktirano',
  naredni_koraci: '',
  rokovi: '',
};

const VRSTE_ZEMLJISTA = [
  'Poljoprivredno zemljište',
  'Šumsko zemljište',
  'Građevinsko zemljište',
  'Ostalo',
];

function ParcelaForm({
  value,
  onChange,
  wtgNames,
}: {
  value: Omit<Parcela, 'id'>;
  onChange: (v: Omit<Parcela, 'id'>) => void;
  wtgNames: string[];
}) {
  const set = (field: keyof Omit<Parcela, 'id'>, val: string | number) =>
    onChange({ ...value, [field]: val });

  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Turbina *</label>
        <select className="input-field" value={value.turbina} onChange={e => set('turbina', e.target.value)}>
          <option value="">– odaberi –</option>
          {wtgNames.map(n => <option key={n} value={n}>{n}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Parcela broj *</label>
        <input className="input-field" value={value.parcela_broj} onChange={e => set('parcela_broj', e.target.value)} placeholder="3861" />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">K.O. (katastarska opština)</label>
        <input className="input-field" value={value.katastarska_opstina} onChange={e => set('katastarska_opstina', e.target.value)} placeholder="Gložane" />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Vrsta zemljišta</label>
        <select className="input-field" value={value.vrsta_zemljista} onChange={e => set('vrsta_zemljista', e.target.value)}>
          {VRSTE_ZEMLJISTA.map(v => <option key={v} value={v}>{v}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Kultura</label>
        <input className="input-field" value={value.kultura} onChange={e => set('kultura', e.target.value)} placeholder="Njiva 6. klase" />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Površina parcele (m²)</label>
        <input type="number" className="input-field" value={value.povrsina_parcele} onChange={e => set('povrsina_parcele', parseFloat(e.target.value) || 0)} />
      </div>
      <div className="col-span-2">
        <label className="block text-sm font-medium text-slate-700 mb-1">Vlasnik zemljišta</label>
        <textarea rows={2} className="input-field resize-none" value={value.vlasnik} onChange={e => set('vlasnik', e.target.value)} placeholder="Ime i prezime (svaki vlasnik u novom redu)" />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Površina zauzeća (m²)</label>
        <input type="number" className="input-field" value={value.povrsina_zauzeca} onChange={e => set('povrsina_zauzeca', parseFloat(e.target.value) || 0)} />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
        <select className="input-field" value={value.status} onChange={e => set('status', e.target.value as ImovinaStatus)}>
          {(Object.keys(IMOVINA_STATUS_LABELS) as ImovinaStatus[]).map(s => (
            <option key={s} value={s}>{IMOVINA_STATUS_LABELS[s]}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Opcija 1 – jednokratno (€)</label>
        <input type="number" step="0.01" className="input-field" value={value.opcija1_jednokratno} onChange={e => set('opcija1_jednokratno', parseFloat(e.target.value) || 0)} />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Opcija 1 – godišnje (€)</label>
        <input type="number" step="0.01" className="input-field" value={value.opcija1_godisnje} onChange={e => set('opcija1_godisnje', parseFloat(e.target.value) || 0)} />
      </div>
      <div className="col-span-2">
        <label className="block text-sm font-medium text-slate-700 mb-1">Komentar</label>
        <input className="input-field" value={value.komentar} onChange={e => set('komentar', e.target.value)} />
      </div>
      <div className="col-span-2">
        <label className="block text-sm font-medium text-slate-700 mb-1">Naredni koraci</label>
        <textarea rows={4} className="input-field resize-none font-mono text-xs" value={value.naredni_koraci} onChange={e => set('naredni_koraci', e.target.value)} placeholder="1. Priprema ugovora&#10;2. Overa ugovora&#10;..." />
      </div>
      <div className="col-span-2">
        <label className="block text-sm font-medium text-slate-700 mb-1">Rokovi</label>
        <textarea rows={4} className="input-field resize-none font-mono text-xs" value={value.rokovi} onChange={e => set('rokovi', e.target.value)} placeholder="1. 21.01.2026.&#10;2. 31.03.2026.&#10;..." />
      </div>
    </div>
  );
}

// ── Stats bar ─────────────────────────────────────────────────────────────────

function StatsRow({ parcele }: { parcele: Parcela[] }) {
  const total = parcele.length;
  const byStatus = parcele.reduce<Record<ImovinaStatus, number>>((acc, p) => {
    acc[p.status] = (acc[p.status] || 0) + 1;
    return acc;
  }, {} as Record<ImovinaStatus, number>);

  const totalZauzece = parcele.reduce((s, p) => s + p.povrsina_zauzeca, 0);
  const totalJednokratno = parcele.reduce((s, p) => s + p.opcija1_jednokratno, 0);
  const totalGodisnje = parcele.reduce((s, p) => s + p.opcija1_godisnje, 0);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <p className="text-xs text-slate-500 font-medium">Ukupno parcela</p>
        <p className="text-2xl font-bold text-slate-800">{total}</p>
      </div>
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
        <p className="text-xs text-slate-500 font-medium">Overeno / Ugovoreno</p>
        <p className="text-2xl font-bold text-emerald-700">{(byStatus.overeno || 0) + (byStatus.ugovoreno || 0)}</p>
      </div>
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
        <p className="text-xs text-slate-500 font-medium">U pregovorima / Usmeno</p>
        <p className="text-2xl font-bold text-amber-700">{(byStatus.u_pregovorima || 0) + (byStatus.usmeno || 0)}</p>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <p className="text-xs text-slate-500 font-medium">Ukupna površina zauzeća</p>
        <p className="text-2xl font-bold text-slate-800">{totalZauzece.toLocaleString()} m²</p>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <p className="text-xs text-slate-500 font-medium">Ukupno godišnje (€)</p>
        <p className="text-2xl font-bold text-slate-800">{totalGodisnje.toLocaleString('sr-RS', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} €</p>
        <p className="text-xs text-slate-400">Jednokratno: {totalJednokratno.toLocaleString('sr-RS', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} €</p>
      </div>
    </div>
  );
}

// ── Grouped rows per turbina ──────────────────────────────────────────────────

function TurbinaGroup({
  turbina,
  parcele,
  onEdit,
  onDelete,
}: {
  turbina: string;
  parcele: Parcela[];
  onEdit: (p: Parcela) => void;
  onDelete: (id: string) => void;
}) {
  const [open, setOpen] = useState(true);
  const totalZauzece = parcele.reduce((s, p) => s + p.povrsina_zauzeca, 0);

  return (
    <>
      {/* Group header */}
      <tr
        className="bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors"
        onClick={() => setOpen(o => !o)}
      >
        <td colSpan={14} className="px-4 py-2">
          <div className="flex items-center gap-3">
            {open ? <ChevronDown className="h-4 w-4 text-slate-400" /> : <ChevronRight className="h-4 w-4 text-slate-400" />}
            <span className="font-semibold text-slate-700">{turbina}</span>
            <span className="text-xs text-slate-400">{parcele.length} parcela · {totalZauzece.toLocaleString()} m² zauzeće</span>
            <div className="flex gap-1.5 ml-2">
              {parcele.map(p => (
                <ImovinaStatusBadge key={p.id} status={p.status} />
              ))}
            </div>
          </div>
        </td>
      </tr>
      {/* Parcela rows */}
      {open && parcele.map((p, idx) => (
        <tr key={p.id} className={`hover:bg-sky-50/40 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}`}>
          <td className="px-4 py-3 text-slate-500 text-xs pl-10">{p.turbina}</td>
          <td className="px-4 py-3 font-mono font-medium text-slate-800">{p.parcela_broj}</td>
          <td className="px-4 py-3 text-slate-600 text-right">{p.povrsina_parcele.toLocaleString()}</td>
          <td className="px-4 py-3 text-slate-600">{p.vrsta_zemljista}</td>
          <td className="px-4 py-3 text-slate-600">{p.katastarska_opstina}</td>
          <td className="px-4 py-3 text-slate-600">{p.kultura}</td>
          <td className="px-4 py-3 text-slate-700 max-w-[160px]">
            <div className="whitespace-pre-line text-xs leading-relaxed">{p.vlasnik || '–'}</div>
          </td>
          <td className="px-4 py-3 text-slate-700 text-right font-medium">{p.povrsina_zauzeca.toLocaleString()}</td>
          <td className="px-4 py-3 text-slate-700 text-right">{p.opcija1_jednokratno ? `${p.opcija1_jednokratno.toLocaleString('sr-RS', { minimumFractionDigits: 1 })} €` : '–'}</td>
          <td className="px-4 py-3 text-slate-700 text-right">{p.opcija1_godisnje ? `${p.opcija1_godisnje.toLocaleString('sr-RS', { minimumFractionDigits: 1 })} €` : '–'}</td>
          <td className="px-4 py-3 text-slate-500 text-xs max-w-[120px] truncate" title={p.komentar}>{p.komentar || '–'}</td>
          <td className="px-4 py-3"><ImovinaStatusBadge status={p.status} /></td>
          <td className="px-4 py-3 text-xs text-slate-600 max-w-[200px]">
            <div className="whitespace-pre-line leading-relaxed">{p.naredni_koraci || '–'}</div>
          </td>
          <td className="px-4 py-3 text-xs text-slate-500 whitespace-pre-line">{p.rokovi || '–'}</td>
          <td className="px-4 py-3">
            <div className="flex gap-2">
              <button onClick={() => onEdit(p)} className="rounded-lg p-1.5 text-slate-400 hover:bg-sky-50 hover:text-sky-600 transition-colors">
                <Pencil className="h-4 w-4" />
              </button>
              <button onClick={() => onDelete(p.id)} className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </td>
        </tr>
      ))}
    </>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export function ImovinaPage() {
  const { state, dispatch } = useAssets();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<ImovinaStatus | 'all'>('all');
  const [filterTurbina, setFilterTurbina] = useState('all');
  const [modal, setModal] = useState<null | 'add' | 'edit'>(null);
  const [editing, setEditing] = useState<Parcela | null>(null);
  const [form, setForm] = useState<Omit<Parcela, 'id'>>(EMPTY);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const wtgNames = state.wtgs.map(w => w.name).sort();

  const filtered = useMemo(() => state.parcele.filter(p => {
    const q = search.toLowerCase();
    const matchSearch = !q ||
      p.parcela_broj.toLowerCase().includes(q) ||
      p.vlasnik.toLowerCase().includes(q) ||
      p.katastarska_opstina.toLowerCase().includes(q) ||
      p.kultura.toLowerCase().includes(q) ||
      p.turbina.toLowerCase().includes(q);
    const matchStatus = filterStatus === 'all' || p.status === filterStatus;
    const matchTurbina = filterTurbina === 'all' || p.turbina === filterTurbina;
    return matchSearch && matchStatus && matchTurbina;
  }), [state.parcele, search, filterStatus, filterTurbina]);

  const grouped = useMemo(() => {
    const map = new Map<string, Parcela[]>();
    for (const p of filtered) {
      if (!map.has(p.turbina)) map.set(p.turbina, []);
      map.get(p.turbina)!.push(p);
    }
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [filtered]);

  const openAdd = () => { setForm(EMPTY); setModal('add'); };
  const openEdit = (p: Parcela) => { setEditing(p); setForm({ ...p }); setModal('edit'); };
  const closeModal = () => { setModal(null); setEditing(null); };

  const handleSave = () => {
    if (!form.turbina || !form.parcela_broj) return;
    if (modal === 'add') {
      dispatch({ type: 'ADD_PARCELA', payload: { ...form, id: `par-${Date.now()}` } });
    } else if (editing) {
      dispatch({ type: 'UPDATE_PARCELA', payload: { ...form, id: editing.id } });
    }
    closeModal();
  };

  const handleDelete = () => {
    if (deleteId) { dispatch({ type: 'DELETE_PARCELA', payload: deleteId }); setDeleteId(null); }
  };

  const deletingParcela = state.parcele.find(p => p.id === deleteId);

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-sky-100 p-2">
            <FileText className="h-6 w-6 text-sky-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Rešavanje imovine</h1>
            <p className="text-slate-500 text-sm">{state.parcele.length} parcela · {new Set(state.parcele.map(p => p.turbina)).size} turbine</p>
          </div>
        </div>
        <button onClick={openAdd} className="btn-primary">
          <Plus className="h-4 w-4" /> Dodaj parcelu
        </button>
      </div>

      {/* Summary stats */}
      <StatsRow parcele={state.parcele} />

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            className="input-field pl-9"
            placeholder="Pretraži po parceli, vlasniku, K.O., turbini..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select className="input-field w-auto" value={filterTurbina} onChange={e => setFilterTurbina(e.target.value)}>
          <option value="all">Sve turbine</option>
          {wtgNames.map(n => <option key={n} value={n}>{n}</option>)}
        </select>
        <select className="input-field w-auto" value={filterStatus} onChange={e => setFilterStatus(e.target.value as ImovinaStatus | 'all')}>
          <option value="all">Svi statusi</option>
          {(Object.keys(IMOVINA_STATUS_LABELS) as ImovinaStatus[]).map(s => (
            <option key={s} value={s}>{IMOVINA_STATUS_LABELS[s]}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[1400px]">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                {[
                  'Turbina', 'Parcela br.', 'Površina parcele (m²)', 'Vrsta zemljišta',
                  'K.O.', 'Kultura', 'Vlasnik', 'Zauzeće (m²)',
                  'Jednokratno (€)', 'Godišnje (€)', 'Komentar', 'Status',
                  'Naredni koraci', 'Rokovi', 'Akcije',
                ].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {grouped.length === 0 ? (
                <tr>
                  <td colSpan={15} className="px-4 py-10 text-center text-slate-400">Nema rezultata</td>
                </tr>
              ) : grouped.map(([turbina, parcele]) => (
                <TurbinaGroup
                  key={turbina}
                  turbina={turbina}
                  parcele={parcele}
                  onEdit={openEdit}
                  onDelete={setDeleteId}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <Modal
          title={modal === 'add' ? 'Dodaj parcelu' : `Uredi parcelu ${editing?.parcela_broj}`}
          onClose={closeModal}
        >
          <ParcelaForm value={form} onChange={setForm} wtgNames={wtgNames} />
          <div className="mt-6 flex justify-end gap-3">
            <button onClick={closeModal} className="btn-secondary">Otkaži</button>
            <button onClick={handleSave} className="btn-primary">Sačuvaj</button>
          </div>
        </Modal>
      )}

      {deleteId && (
        <ConfirmDialog
          message={`Obriši parcelu ${deletingParcela?.parcela_broj} (${deletingParcela?.turbina})?`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  );
}
