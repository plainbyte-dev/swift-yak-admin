'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import {
  Building2, Plus, Search, MoreHorizontal, Edit2, Trash2,
  CheckCircle, Clock, XCircle, Phone, Mail, MapPin, X,
  ChevronLeft, ChevronRight, Eye,
} from 'lucide-react';

interface Company {
  id: string;
  name: string;
  contact: string;
  email: string;
  phone: string;
  address: string;
  status: 'active' | 'pending' | 'suspended';
  shipments: number;
  joinedAt: string;
  plan: string;
}

const INITIAL_COMPANIES: Company[] = [
  { id: 'co-001', name: 'Meridian Logistics', contact: 'Marcus Adeyemi', email: 'marcus.adeyemi@meridianlogistics.com', phone: '+1 212-555-0100', address: '200 Park Ave, New York, NY', status: 'active', shipments: 1248, joinedAt: 'Jan 12, 2024', plan: 'Enterprise' },
  { id: 'co-002', name: 'Northgate Retail Ltd.', contact: 'Sarah Okonkwo', email: 'sarah@northgateretail.com', phone: '+1 212-555-0201', address: '88 Canal St, New York, NY', status: 'active', shipments: 543, joinedAt: 'Mar 5, 2024', plan: 'Business' },
  { id: 'co-003', name: 'Harborview Clinic', contact: 'Dr. James Patel', email: 'jpatel@harborviewclinic.com', phone: '+1 212-555-0302', address: '320 E 42nd St, New York, NY', status: 'active', shipments: 312, joinedAt: 'Feb 18, 2024', plan: 'Business' },
  { id: 'co-004', name: 'Apex Consulting', contact: 'Linda Zhao', email: 'linda.zhao@apexconsulting.com', phone: '+1 212-555-0403', address: '200 Park Ave, New York, NY', status: 'pending', shipments: 0, joinedAt: 'Jul 20, 2025', plan: 'Starter' },
  { id: 'co-005', name: 'Greenfield Foods', contact: 'Carlos Mendes', email: 'carlos@greenfieldfoods.com', phone: '+1 212-555-0504', address: '900 3rd Ave, New York, NY', status: 'active', shipments: 876, joinedAt: 'Nov 3, 2023', plan: 'Enterprise' },
  { id: 'co-006', name: 'Pacific Imports Co.', contact: 'Yuki Tanaka', email: 'yuki@pacificimports.com', phone: '+1 212-555-0605', address: '411 W 35th St, New York, NY', status: 'suspended', shipments: 89, joinedAt: 'Jun 14, 2024', plan: 'Starter' },
  { id: 'co-007', name: 'Metro Office Supplies', contact: 'Ben Adler', email: 'ben@metrooffice.com', phone: '+1 212-555-0706', address: '1251 6th Ave, New York, NY', status: 'active', shipments: 421, joinedAt: 'Apr 22, 2024', plan: 'Business' },
  { id: 'co-008', name: 'Sunrise Pharmacy', contact: 'Amara Diallo', email: 'amara@sunrisepharmacy.com', phone: '+1 212-555-0807', address: '500 7th Ave, New York, NY', status: 'active', shipments: 198, joinedAt: 'May 9, 2024', plan: 'Starter' },
];

const STATUS_CONFIG = {
  active: { label: 'Active', icon: CheckCircle, className: 'text-success bg-success/10' },
  pending: { label: 'Pending', icon: Clock, className: 'text-warning bg-warning/10' },
  suspended: { label: 'Suspended', icon: XCircle, className: 'text-destructive bg-destructive/10' },
};

const PLAN_COLORS: Record<string, string> = {
  Enterprise: 'text-primary bg-primary/10',
  Business: 'text-info bg-info/10',
  Starter: 'text-muted-foreground bg-muted',
};

const EMPTY_FORM: Omit<Company, 'id' | 'shipments' | 'joinedAt'> = {
  name: '', contact: '', email: '', phone: '', address: '', status: 'pending', plan: 'Starter',
};

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>(INITIAL_COMPANIES);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Company | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [viewTarget, setViewTarget] = useState<Company | null>(null);
  const [page, setPage] = useState(1);
  const PER_PAGE = 6;

  const filtered = companies.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.contact.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const openAdd = () => { setEditTarget(null); setForm(EMPTY_FORM); setModalOpen(true); };
  const openEdit = (c: Company) => { setEditTarget(c); setForm({ name: c.name, contact: c.contact, email: c.email, phone: c.phone, address: c.address, status: c.status, plan: c.plan }); setModalOpen(true); setMenuOpen(null); };

  const handleSave = () => {
    if (!form.name.trim()) return;
    if (editTarget) {
      setCompanies((prev) => prev.map((c) => c.id === editTarget.id ? { ...c, ...form } : c));
    } else {
      const newCo: Company = { ...form, id: `co-${Date.now()}`, shipments: 0, joinedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) };
      setCompanies((prev) => [newCo, ...prev]);
    }
    setModalOpen(false);
  };

  const handleDelete = (id: string) => { setCompanies((prev) => prev.filter((c) => c.id !== id)); setMenuOpen(null); };

  const toggleStatus = (id: string) => {
    setCompanies((prev) => prev.map((c) => c.id === id ? { ...c, status: c.status === 'active' ? 'suspended' : 'active' } : c));
    setMenuOpen(null);
  };

  return (
    <AppLayout activePath="/companies">
      <div className="max-w-screen-xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-700 text-foreground">Companies</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Manage partner companies and their access</p>
          </div>
          <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-600 hover:bg-primary/90 transition-colors">
            <Plus size={16} /> Add Company
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search companies..."
              className="w-full pl-9 pr-4 py-2 text-sm bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div className="flex gap-2">
            {['all', 'active', 'pending', 'suspended'].map((s) => (
              <button
                key={s}
                onClick={() => { setStatusFilter(s); setPage(1); }}
                className={`px-3 py-2 text-xs font-600 rounded-lg capitalize transition-colors ${statusFilter === s ? 'bg-primary text-white' : 'bg-card border border-border text-muted-foreground hover:bg-muted'}`}
              >
                {s === 'all' ? 'All' : s}
              </button>
            ))}
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total Companies', value: companies.length, color: 'text-foreground' },
            { label: 'Active', value: companies.filter((c) => c.status === 'active').length, color: 'text-success' },
            { label: 'Pending', value: companies.filter((c) => c.status === 'pending').length, color: 'text-warning' },
            { label: 'Suspended', value: companies.filter((c) => c.status === 'suspended').length, color: 'text-destructive' },
          ].map((stat) => (
            <div key={stat.label} className="bg-card border border-border rounded-xl p-4">
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <p className={`text-2xl font-700 mt-1 ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="text-left px-5 py-3 text-xs font-600 text-muted-foreground uppercase tracking-wide">Company</th>
                  <th className="text-left px-5 py-3 text-xs font-600 text-muted-foreground uppercase tracking-wide">Contact</th>
                  <th className="text-left px-5 py-3 text-xs font-600 text-muted-foreground uppercase tracking-wide">Status</th>
                  <th className="text-left px-5 py-3 text-xs font-600 text-muted-foreground uppercase tracking-wide">Plan</th>
                  <th className="text-left px-5 py-3 text-xs font-600 text-muted-foreground uppercase tracking-wide">Shipments</th>
                  <th className="text-left px-5 py-3 text-xs font-600 text-muted-foreground uppercase tracking-wide">Joined</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {paginated.map((company) => {
                  const sc = STATUS_CONFIG[company.status];
                  const StatusIcon = sc.icon;
                  return (
                    <tr key={company.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                            <Building2 size={16} className="text-primary" />
                          </div>
                          <div>
                            <p className="font-600 text-foreground">{company.name}</p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5"><MapPin size={10} />{company.address}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <p className="font-500 text-foreground">{company.contact}</p>
                        <div className="flex items-center gap-3 mt-0.5">
                          <span className="text-xs text-muted-foreground flex items-center gap-1"><Mail size={10} />{company.email}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-600 ${sc.className}`}>
                          <StatusIcon size={11} />{sc.label}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-600 ${PLAN_COLORS[company.plan]}`}>{company.plan}</span>
                      </td>
                      <td className="px-5 py-3.5 font-600 text-foreground">{company.shipments.toLocaleString()}</td>
                      <td className="px-5 py-3.5 text-muted-foreground text-xs">{company.joinedAt}</td>
                      <td className="px-5 py-3.5">
                        <div className="relative flex items-center gap-1 justify-end">
                          <button onClick={() => setViewTarget(company)} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"><Eye size={15} /></button>
                          <button onClick={() => setMenuOpen(menuOpen === company.id ? null : company.id)} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"><MoreHorizontal size={15} /></button>
                          {menuOpen === company.id && (
                            <div className="absolute right-0 top-8 z-20 bg-card border border-border rounded-xl shadow-lg py-1 min-w-[160px]">
                              <button onClick={() => openEdit(company)} className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-muted text-foreground"><Edit2 size={14} />Edit</button>
                              <button onClick={() => toggleStatus(company.id)} className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-muted text-foreground">{company.status === 'active' ? <><XCircle size={14} />Suspend</> : <><CheckCircle size={14} />Activate</>}</button>
                              <button onClick={() => handleDelete(company.id)} className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-muted text-destructive"><Trash2 size={14} />Delete</button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {paginated.length === 0 && (
                  <tr><td colSpan={7} className="px-5 py-12 text-center text-muted-foreground text-sm">No companies found</td></tr>
                )}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          <div className="flex items-center justify-between px-5 py-3 border-t border-border">
            <p className="text-xs text-muted-foreground">{filtered.length} companies</p>
            <div className="flex items-center gap-2">
              <button disabled={page === 1} onClick={() => setPage((p) => p - 1)} className="p-1.5 rounded-lg border border-border disabled:opacity-40 hover:bg-muted transition-colors"><ChevronLeft size={14} /></button>
              <span className="text-xs font-600">{page} / {totalPages}</span>
              <button disabled={page === totalPages} onClick={() => setPage((p) => p + 1)} className="p-1.5 rounded-lg border border-border disabled:opacity-40 hover:bg-muted transition-colors"><ChevronRight size={14} /></button>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-2xl shadow-xl w-full max-w-lg">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="text-base font-700 text-foreground">{editTarget ? 'Edit Company' : 'Add Company'}</h2>
              <button onClick={() => setModalOpen(false)} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground"><X size={16} /></button>
            </div>
            <div className="px-6 py-5 space-y-4">
              {[
                { label: 'Company Name', key: 'name', placeholder: 'e.g. Meridian Logistics' },
                { label: 'Contact Person', key: 'contact', placeholder: 'Full name' },
                { label: 'Email', key: 'email', placeholder: 'contact@company.com' },
                { label: 'Phone', key: 'phone', placeholder: '+1 212-555-0000' },
                { label: 'Address', key: 'address', placeholder: '123 Main St, City, State' },
              ].map(({ label, key, placeholder }) => (
                <div key={key}>
                  <label className="block text-xs font-600 text-muted-foreground mb-1.5">{label}</label>
                  <input
                    value={(form as Record<string, string>)[key]}
                    onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                    placeholder={placeholder}
                    className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
              ))}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-600 text-muted-foreground mb-1.5">Status</label>
                  <select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as Company['status'] }))} className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30">
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-600 text-muted-foreground mb-1.5">Plan</label>
                  <select value={form.plan} onChange={(e) => setForm((f) => ({ ...f, plan: e.target.value }))} className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30">
                    <option>Starter</option>
                    <option>Business</option>
                    <option>Enterprise</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border">
              <button onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm font-600 text-muted-foreground hover:text-foreground transition-colors">Cancel</button>
              <button onClick={handleSave} className="px-5 py-2 text-sm font-600 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">{editTarget ? 'Save Changes' : 'Add Company'}</button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-2xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="text-base font-700 text-foreground">Company Details</h2>
              <button onClick={() => setViewTarget(null)} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground"><X size={16} /></button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Building2 size={24} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-700 text-foreground text-lg">{viewTarget.name}</h3>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-600 ${STATUS_CONFIG[viewTarget.status].className}`}>
                    {viewTarget.status}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: <Mail size={14} />, label: 'Email', value: viewTarget.email },
                  { icon: <Phone size={14} />, label: 'Phone', value: viewTarget.phone },
                  { icon: <MapPin size={14} />, label: 'Address', value: viewTarget.address },
                  { icon: <Building2 size={14} />, label: 'Plan', value: viewTarget.plan },
                  { icon: <CheckCircle size={14} />, label: 'Shipments', value: viewTarget.shipments.toLocaleString() },
                  { icon: <Clock size={14} />, label: 'Joined', value: viewTarget.joinedAt },
                ].map(({ icon, label, value }) => (
                  <div key={label} className="bg-muted/40 rounded-lg p-3">
                    <div className="flex items-center gap-1.5 text-muted-foreground mb-1">{icon}<span className="text-xs">{label}</span></div>
                    <p className="text-sm font-600 text-foreground">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Backdrop for menu close */}
      {menuOpen && <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(null)} />}
    </AppLayout>
  );
}
