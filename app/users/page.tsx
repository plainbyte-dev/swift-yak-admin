'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import {
  Users, Plus, Search, MoreHorizontal, Edit2, Trash2,
  CheckCircle, XCircle, Mail, X, ChevronLeft, ChevronRight,
  Shield, UserCheck, User, Truck, Eye,
} from 'lucide-react';

type UserRole = 'super-admin' | 'company-admin' | 'company-staff' | 'courier';
type UserStatus = 'active' | 'inactive' | 'invited';

interface AppUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  company: string;
  status: UserStatus;
  lastActive: string;
  avatar: string;
}

const ROLE_CONFIG: Record<UserRole, { label: string; icon: React.ReactNode; className: string }> = {
  'super-admin': { label: 'Super Admin', icon: <Shield size={11} />, className: 'text-primary bg-primary/10' },
  'company-admin': { label: 'Company Admin', icon: <UserCheck size={11} />, className: 'text-info bg-info/10' },
  'company-staff': { label: 'Staff', icon: <User size={11} />, className: 'text-muted-foreground bg-muted' },
  'courier': { label: 'Courier', icon: <Truck size={11} />, className: 'text-warning bg-warning/10' },
};

const STATUS_CONFIG: Record<UserStatus, { label: string; className: string }> = {
  active: { label: 'Active', className: 'text-success bg-success/10' },
  inactive: { label: 'Inactive', className: 'text-muted-foreground bg-muted' },
  invited: { label: 'Invited', className: 'text-warning bg-warning/10' },
};

const INITIAL_USERS: AppUser[] = [
  { id: 'u-001', name: 'Elena Vasquez', email: 'elena.vasquez@courierdesk.io', role: 'super-admin', company: 'CourierDesk', status: 'active', lastActive: '2 min ago', avatar: 'EV' },
  { id: 'u-002', name: 'Marcus Adeyemi', email: 'marcus.adeyemi@meridianlogistics.com', role: 'company-admin', company: 'Meridian Logistics', status: 'active', lastActive: '15 min ago', avatar: 'MA' },
  { id: 'u-003', name: 'Nina Kowalski', email: 'nina.kowalski@meridianlogistics.com', role: 'company-staff', company: 'Meridian Logistics', status: 'active', lastActive: '1 hr ago', avatar: 'NK' },
  { id: 'u-004', name: 'Jamal Okafor', email: 'jamal.okafor@courierdesk.io', role: 'courier', company: 'CourierDesk', status: 'active', lastActive: '5 min ago', avatar: 'JO' },
  { id: 'u-005', name: 'Fatima Al-Hassan', email: 'fatima.alhassan@courierdesk.io', role: 'courier', company: 'CourierDesk', status: 'active', lastActive: '8 min ago', avatar: 'FA' },
  { id: 'u-006', name: 'Sarah Okonkwo', email: 'sarah@northgateretail.com', role: 'company-admin', company: 'Northgate Retail Ltd.', status: 'active', lastActive: '3 hr ago', avatar: 'SO' },
  { id: 'u-007', name: 'Priya Sharma', email: 'priya.sharma@courierdesk.io', role: 'courier', company: 'CourierDesk', status: 'active', lastActive: '12 min ago', avatar: 'PS' },
  { id: 'u-008', name: 'Linda Zhao', email: 'linda.zhao@apexconsulting.com', role: 'company-admin', company: 'Apex Consulting', status: 'invited', lastActive: 'Never', avatar: 'LZ' },
  { id: 'u-009', name: 'Ben Adler', email: 'ben@metrooffice.com', role: 'company-staff', company: 'Metro Office Supplies', status: 'active', lastActive: '2 days ago', avatar: 'BA' },
  { id: 'u-010', name: 'Wei Chen', email: 'wei.chen@courierdesk.io', role: 'courier', company: 'CourierDesk', status: 'inactive', lastActive: '5 days ago', avatar: 'WC' },
];

const AVATAR_COLORS = ['bg-primary', 'bg-info', 'bg-success', 'bg-warning', 'bg-destructive'];

const EMPTY_FORM = { name: '', email: '', role: 'company-staff' as UserRole, company: '', status: 'invited' as UserStatus };

export default function UsersPage() {
  const [users, setUsers] = useState<AppUser[]>(INITIAL_USERS);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<AppUser | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [viewTarget, setViewTarget] = useState<AppUser | null>(null);
  const [page, setPage] = useState(1);
  const PER_PAGE = 7;

  const filtered = users.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.company.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const openAdd = () => { setEditTarget(null); setForm(EMPTY_FORM); setModalOpen(true); };
  const openEdit = (u: AppUser) => { setEditTarget(u); setForm({ name: u.name, email: u.email, role: u.role, company: u.company, status: u.status }); setModalOpen(true); setMenuOpen(null); };

  const handleSave = () => {
    if (!form.name.trim() || !form.email.trim()) return;
    if (editTarget) {
      setUsers((prev) => prev.map((u) => u.id === editTarget.id ? { ...u, ...form } : u));
    } else {
      const initials = form.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
      setUsers((prev) => [{ ...form, id: `u-${Date.now()}`, lastActive: 'Never', avatar: initials }, ...prev]);
    }
    setModalOpen(false);
  };

  const handleDelete = (id: string) => { setUsers((prev) => prev.filter((u) => u.id !== id)); setMenuOpen(null); };
  const toggleStatus = (id: string) => {
    setUsers((prev) => prev.map((u) => u.id === id ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u));
    setMenuOpen(null);
  };

  return (
    <AppLayout activePath="/users">
      <div className="max-w-screen-xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-700 text-foreground">Users</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Manage staff, admins, and couriers across all companies</p>
          </div>
          <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-600 hover:bg-primary/90 transition-colors">
            <Plus size={16} /> Invite User
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total Users', value: users.length, color: 'text-foreground' },
            { label: 'Active', value: users.filter((u) => u.status === 'active').length, color: 'text-success' },
            { label: 'Couriers', value: users.filter((u) => u.role === 'courier').length, color: 'text-warning' },
            { label: 'Admins', value: users.filter((u) => u.role === 'company-admin' || u.role === 'super-admin').length, color: 'text-primary' },
          ].map((stat) => (
            <div key={stat.label} className="bg-card border border-border rounded-xl p-4">
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <p className={`text-2xl font-700 mt-1 ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search users..."
              className="w-full pl-9 pr-4 py-2 text-sm bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'all', label: 'All Roles' },
              { key: 'super-admin', label: 'Super Admin' },
              { key: 'company-admin', label: 'Admin' },
              { key: 'company-staff', label: 'Staff' },
              { key: 'courier', label: 'Courier' },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => { setRoleFilter(key); setPage(1); }}
                className={`px-3 py-2 text-xs font-600 rounded-lg transition-colors ${roleFilter === key ? 'bg-primary text-white' : 'bg-card border border-border text-muted-foreground hover:bg-muted'}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="text-left px-5 py-3 text-xs font-600 text-muted-foreground uppercase tracking-wide">User</th>
                  <th className="text-left px-5 py-3 text-xs font-600 text-muted-foreground uppercase tracking-wide">Role</th>
                  <th className="text-left px-5 py-3 text-xs font-600 text-muted-foreground uppercase tracking-wide">Company</th>
                  <th className="text-left px-5 py-3 text-xs font-600 text-muted-foreground uppercase tracking-wide">Status</th>
                  <th className="text-left px-5 py-3 text-xs font-600 text-muted-foreground uppercase tracking-wide">Last Active</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {paginated.map((user, idx) => {
                  const rc = ROLE_CONFIG[user.role];
                  const sc = STATUS_CONFIG[user.status];
                  const avatarColor = AVATAR_COLORS[idx % AVATAR_COLORS.length];
                  return (
                    <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className={`h-9 w-9 rounded-full ${avatarColor} flex items-center justify-center text-white text-xs font-700 shrink-0`}>
                            {user.avatar}
                          </div>
                          <div>
                            <p className="font-600 text-foreground">{user.name}</p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1"><Mail size={10} />{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-600 ${rc.className}`}>
                          {rc.icon}{rc.label}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-foreground">{user.company}</td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-600 ${sc.className}`}>{sc.label}</span>
                      </td>
                      <td className="px-5 py-3.5 text-xs text-muted-foreground">{user.lastActive}</td>
                      <td className="px-5 py-3.5">
                        <div className="relative flex items-center gap-1 justify-end">
                          <button onClick={() => setViewTarget(user)} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"><Eye size={15} /></button>
                          <button onClick={() => setMenuOpen(menuOpen === user.id ? null : user.id)} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"><MoreHorizontal size={15} /></button>
                          {menuOpen === user.id && (
                            <div className="absolute right-0 top-8 z-20 bg-card border border-border rounded-xl shadow-lg py-1 min-w-[160px]">
                              <button onClick={() => openEdit(user)} className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-muted text-foreground"><Edit2 size={14} />Edit</button>
                              <button onClick={() => toggleStatus(user.id)} className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-muted text-foreground">{user.status === 'active' ? <><XCircle size={14} />Deactivate</> : <><CheckCircle size={14} />Activate</>}</button>
                              <button onClick={() => handleDelete(user.id)} className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-muted text-destructive"><Trash2 size={14} />Remove</button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {paginated.length === 0 && (
                  <tr><td colSpan={6} className="px-5 py-12 text-center text-muted-foreground text-sm">No users found</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between px-5 py-3 border-t border-border">
            <p className="text-xs text-muted-foreground">{filtered.length} users</p>
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
          <div className="bg-card border border-border rounded-2xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="text-base font-700 text-foreground">{editTarget ? 'Edit User' : 'Invite User'}</h2>
              <button onClick={() => setModalOpen(false)} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground"><X size={16} /></button>
            </div>
            <div className="px-6 py-5 space-y-4">
              {[
                { label: 'Full Name', key: 'name', placeholder: 'e.g. John Smith' },
                { label: 'Email Address', key: 'email', placeholder: 'john@company.com' },
                { label: 'Company', key: 'company', placeholder: 'Company name' },
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
                  <label className="block text-xs font-600 text-muted-foreground mb-1.5">Role</label>
                  <select value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value as UserRole }))} className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30">
                    <option value="company-admin">Company Admin</option>
                    <option value="company-staff">Staff</option>
                    <option value="courier">Courier</option>
                    <option value="super-admin">Super Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-600 text-muted-foreground mb-1.5">Status</label>
                  <select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as UserStatus }))} className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30">
                    <option value="invited">Invited</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border">
              <button onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm font-600 text-muted-foreground hover:text-foreground transition-colors">Cancel</button>
              <button onClick={handleSave} className="px-5 py-2 text-sm font-600 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">{editTarget ? 'Save Changes' : 'Send Invite'}</button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-2xl shadow-xl w-full max-w-sm">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="text-base font-700 text-foreground">User Profile</h2>
              <button onClick={() => setViewTarget(null)} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground"><X size={16} /></button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center text-white text-xl font-700">{viewTarget.avatar}</div>
                <div>
                  <h3 className="font-700 text-foreground text-lg">{viewTarget.name}</h3>
                  <p className="text-sm text-muted-foreground">{viewTarget.email}</p>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-600 mt-1 ${ROLE_CONFIG[viewTarget.role].className}`}>
                    {ROLE_CONFIG[viewTarget.role].icon}{ROLE_CONFIG[viewTarget.role].label}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Company', value: viewTarget.company },
                  { label: 'Status', value: STATUS_CONFIG[viewTarget.status].label },
                  { label: 'Last Active', value: viewTarget.lastActive },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-muted/40 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground mb-1">{label}</p>
                    <p className="text-sm font-600 text-foreground">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {menuOpen && <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(null)} />}
    </AppLayout>
  );
}
