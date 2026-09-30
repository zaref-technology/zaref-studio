'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc, updateDoc, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Lead } from '@/types';
import AdminTopBar from '@/components/admin/AdminTopBar';
import { Search, Trash2, X, AlertTriangle, CheckCircle, ChevronDown, Mail, Phone, Building, Calendar } from 'lucide-react';

const STATUSES = ['new', 'contacted', 'in-progress', 'converted', 'closed'] as const;
type Status = typeof STATUSES[number];

const STATUS_STYLES: Record<Status, string> = {
  new: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  contacted: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  'in-progress': 'bg-blue-600/10 text-blue-400 border-blue-600/20',
  converted: 'bg-green-500/10 text-green-400 border-green-500/20',
  closed: 'bg-white/[0.05] text-white/30 border-white/10',
};

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filtered, setFiltered] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [serviceFilter, setServiceFilter] = useState('all');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchLeads = async () => {
    try {
      const q = query(collection(db, 'leads'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as Lead));
      setLeads(data);
      setFiltered(data);
    } catch { } finally { setLoading(false); }
  };

  useEffect(() => { fetchLeads(); }, []);

  useEffect(() => {
    let result = leads;
    if (search) result = result.filter(l =>
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.email?.toLowerCase().includes(search.toLowerCase()) ||
      l.businessName?.toLowerCase().includes(search.toLowerCase())
    );
    if (statusFilter !== 'all') result = result.filter(l => l.status === statusFilter);
    if (serviceFilter !== 'all') result = result.filter(l => l.serviceRequired === serviceFilter);
    setFiltered(result);
  }, [search, statusFilter, serviceFilter, leads]);

  const updateStatus = async (lead: Lead, status: Status) => {
    try {
      await updateDoc(doc(db, 'leads', lead.id!), { status });
      setLeads(prev => prev.map(l => l.id === lead.id ? { ...l, status } : l));
      if (selectedLead?.id === lead.id) setSelectedLead(prev => prev ? { ...prev, status } : null);
      showToast('success', 'Status updated.');
    } catch { showToast('error', 'Update failed.'); }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'leads', id));
      setLeads(prev => prev.filter(l => l.id !== id));
      if (selectedLead?.id === id) setSelectedLead(null);
      showToast('success', 'Lead deleted.');
    } catch { showToast('error', 'Delete failed.'); }
    setDeleteId(null);
  };

  const services = [...new Set(leads.map(l => l.serviceRequired).filter(Boolean))];

  const formatDate = (ts: any) => {
    if (!ts) return '—';
    try { return new Date(ts.toDate()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }); }
    catch { return '—'; }
  };

  return (
    <>
      <AdminTopBar title="Leads" />
      <main className="flex-1 p-6 overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-black text-white">Leads</h2>
            <p className="text-xs text-white/30">{filtered.length} of {leads.length} leads</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            {STATUSES.map(s => (
              <span key={s} className={`text-[10px] px-2 py-1 rounded-full font-medium border ${STATUS_STYLES[s]}`}>
                {leads.filter(l => l.status === s).length} {s}
              </span>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-5">
          <div className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.06] rounded-lg px-3 py-2 flex-1 min-w-48">
            <Search size={14} className="text-white/30" />
            <input
              type="text"
              placeholder="Search leads..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-transparent text-sm text-white/70 placeholder-white/20 outline-none flex-1"
              id="leads-search"
            />
          </div>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="input-dark text-sm py-2 px-3 w-40 appearance-none"
            id="leads-status-filter"
          >
            <option value="all">All Status</option>
            {STATUSES.map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
          </select>
          {services.length > 0 && (
            <select
              value={serviceFilter}
              onChange={e => setServiceFilter(e.target.value)}
              className="input-dark text-sm py-2 px-3 w-48 appearance-none"
            >
              <option value="all">All Services</option>
              {services.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          )}
        </div>

        {/* Table */}
        {loading ? (
          <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-14 rounded-lg shimmer" />)}</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-white/30">
            <p className="text-lg font-bold mb-2">No leads found</p>
            <p className="text-sm">Leads from the contact form will appear here.</p>
          </div>
        ) : (
          <div className="bg-[#111] border border-white/[0.07] rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.05]">
                  <th className="text-left text-[11px] font-semibold text-white/30 uppercase tracking-wider px-5 py-3">Name</th>
                  <th className="text-left text-[11px] font-semibold text-white/30 uppercase tracking-wider px-4 py-3 hidden md:table-cell">Service</th>
                  <th className="text-left text-[11px] font-semibold text-white/30 uppercase tracking-wider px-4 py-3 hidden lg:table-cell">Budget</th>
                  <th className="text-left text-[11px] font-semibold text-white/30 uppercase tracking-wider px-4 py-3">Status</th>
                  <th className="text-left text-[11px] font-semibold text-white/30 uppercase tracking-wider px-4 py-3 hidden lg:table-cell">Date</th>
                  <th className="text-right text-[11px] font-semibold text-white/30 uppercase tracking-wider px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {filtered.map(lead => (
                  <tr
                    key={lead.id}
                    className="hover:bg-white/[0.02] transition-colors cursor-pointer"
                    onClick={() => setSelectedLead(lead)}
                  >
                    <td className="px-5 py-3.5">
                      <div className="text-sm font-medium text-white">{lead.name}</div>
                      <div className="text-xs text-white/30">{lead.email}</div>
                    </td>
                    <td className="px-4 py-3.5 hidden md:table-cell">
                      <span className="text-xs text-white/50 line-clamp-1 max-w-32">{lead.serviceRequired || '—'}</span>
                    </td>
                    <td className="px-4 py-3.5 hidden lg:table-cell">
                      <span className="text-xs text-white/40">{lead.budget || '—'}</span>
                    </td>
                    <td className="px-4 py-3.5" onClick={e => e.stopPropagation()}>
                      <select
                        value={lead.status || 'new'}
                        onChange={e => updateStatus(lead, e.target.value as Status)}
                        className={`text-xs px-2 py-1 rounded-full font-medium border cursor-pointer bg-transparent outline-none ${STATUS_STYLES[lead.status as Status] || STATUS_STYLES.new}`}
                      >
                        {STATUSES.map(s => <option key={s} value={s} className="bg-[#111] text-white capitalize">{s}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-3.5 hidden lg:table-cell">
                      <span className="text-xs text-white/30">{formatDate(lead.createdAt)}</span>
                    </td>
                    <td className="px-5 py-3.5" onClick={e => e.stopPropagation()}>
                      <button
                        onClick={() => setDeleteId(lead.id!)}
                        className="p-1.5 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-500/[0.08] transition-all ml-auto flex"
                        title="Delete lead"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {toast && (
          <div className={`toast flex items-center gap-2 px-4 py-3 rounded-xl text-sm ${toast.type === 'success' ? 'bg-green-500/15 border border-green-500/30 text-green-400' : 'bg-red-500/15 border border-red-500/30 text-red-400'}`}>
            {toast.type === 'success' ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
            {toast.message}
          </div>
        )}
      </main>

      {/* Lead Detail Drawer */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedLead(null)} />
          <div className="relative w-full max-w-md bg-[#111] border-l border-white/[0.07] h-full overflow-auto">
            <div className="flex items-center justify-between p-5 border-b border-white/[0.06]">
              <h3 className="text-base font-bold text-white">Lead Details</h3>
              <button onClick={() => setSelectedLead(null)} className="text-white/30 hover:text-white"><X size={18} /></button>
            </div>
            <div className="p-5 space-y-5">
              <div>
                <h4 className="text-lg font-bold text-white">{selectedLead.name}</h4>
                {selectedLead.businessName && <p className="text-sm text-white/40">{selectedLead.businessName}</p>}
              </div>
              <div className="space-y-3">
                {selectedLead.email && (
                  <div className="flex items-center gap-3 text-sm">
                    <Mail size={14} className="text-blue-400 flex-shrink-0" />
                    <a href={`mailto:${selectedLead.email}`} className="text-white/70 hover:text-white">{selectedLead.email}</a>
                  </div>
                )}
                {selectedLead.phone && (
                  <div className="flex items-center gap-3 text-sm">
                    <Phone size={14} className="text-blue-400 flex-shrink-0" />
                    <a href={`tel:${selectedLead.phone}`} className="text-white/70 hover:text-white">{selectedLead.phone}</a>
                  </div>
                )}
                {selectedLead.businessName && (
                  <div className="flex items-center gap-3 text-sm">
                    <Building size={14} className="text-blue-400 flex-shrink-0" />
                    <span className="text-white/70">{selectedLead.businessName}</span>
                  </div>
                )}
                <div className="flex items-center gap-3 text-sm">
                  <Calendar size={14} className="text-blue-400 flex-shrink-0" />
                  <span className="text-white/70">{formatDate(selectedLead.createdAt)}</span>
                </div>
              </div>

              <div className="border-t border-white/[0.05] pt-5 space-y-3">
                {selectedLead.serviceRequired && (
                  <div>
                    <div className="text-xs text-white/30 mb-1">Service Required</div>
                    <div className="text-sm text-white">{selectedLead.serviceRequired}</div>
                  </div>
                )}
                {selectedLead.budget && (
                  <div>
                    <div className="text-xs text-white/30 mb-1">Budget</div>
                    <div className="text-sm text-white">{selectedLead.budget}</div>
                  </div>
                )}
                {selectedLead.message && (
                  <div>
                    <div className="text-xs text-white/30 mb-1">Message</div>
                    <div className="text-sm text-white/70 leading-relaxed bg-white/[0.03] rounded-lg p-3">{selectedLead.message}</div>
                  </div>
                )}
              </div>

              <div className="border-t border-white/[0.05] pt-5">
                <div className="text-xs text-white/30 mb-2">Update Status</div>
                <div className="flex flex-wrap gap-2">
                  {STATUSES.map(s => (
                    <button
                      key={s}
                      onClick={() => updateStatus(selectedLead, s)}
                      className={`text-xs px-3 py-1.5 rounded-full font-medium border transition-all capitalize ${
                        selectedLead.status === s ? STATUS_STYLES[s] : 'border-white/10 text-white/30 hover:border-white/20'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-white/[0.05] pt-5 flex gap-3">
                <a href={`mailto:${selectedLead.email}`} className="btn-orange flex-1 justify-center text-sm py-2.5">
                  <Mail size={14} /> Email Lead
                </a>
                <button
                  onClick={() => setDeleteId(selectedLead.id!)}
                  className="px-4 py-2.5 rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 text-sm font-medium transition-colors flex items-center gap-2"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setDeleteId(null)} />
          <div className="relative glass rounded-2xl p-6 w-full max-w-sm border border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center"><AlertTriangle size={18} className="text-red-400" /></div>
              <div><h3 className="text-base font-bold text-white">Delete Lead</h3><p className="text-xs text-white/40">This cannot be undone.</p></div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="btn-ghost flex-1 justify-center text-sm py-2.5">Cancel</button>
              <button onClick={() => handleDelete(deleteId)} className="flex-1 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2" id="confirm-delete-lead">
                <Trash2 size={14} />Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
