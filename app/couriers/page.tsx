'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { Truck, Plus, Search, MoreHorizontal, Edit2, Trash2, CheckCircle, X, ChevronLeft, ChevronRight, MapPin, Phone, WifiOff, Eye,  } from 'lucide-react';

type CourierStatus = 'available' | 'busy' | 'offline';

interface Courier {
  id: string;
  name: string;
  phone: string;
  email: string;
  vehicle: string;
  status: CourierStatus;
  location: string;
  activeShipments: number;
  totalDeliveries: number;
  rating: number;
  joinedAt: string;
  avatar: string;
}

const STATUS_CONFIG: Record<CourierStatus, { label: string; icon: React.ReactNode; className: string; dot: string }> = {
  available: { label: 'Available', icon: <CheckCircle size={11} />, className: 'text-success bg-success/10', dot: 'bg-success' },
  busy: { label: 'On Delivery', icon: <Truck size={11} />, className: 'text-warning bg-warning/10', dot: 'bg-warning' },
  offline: { label: 'Offline', icon: <WifiOff size={11} />, className: 'text-muted-foreground bg-muted', dot: 'bg-muted-foreground' },
};

const VEHICLE_ICONS: Record<string, string> = {
  Motorcycle: '🏍️',
  Van: '🚐',
  Bicycle: '🚲',
  Car: '🚗',
  Truck: '🚛',
};

const INITIAL_COURIERS: Courier[] = [
  { id: 'c-001', name: 'Jamal Okafor', phone: '+1 212-555-0401', email: 'jamal.okafor@courierdesk.io', vehicle: 'Motorcycle', status: 'busy', location: 'Canal St & Broadway, NY', activeShipments: 2, totalDeliveries: 847, rating: 4.9, joinedAt: 'Mar 12, 2023', avatar: 'JO' },
  { id: 'c-002', name: 'Fatima Al-Hassan', phone: '+1 212-555-0402', email: 'fatima.alhassan@courierdesk.io', vehicle: 'Van', status: 'busy', location: '7th Ave & 34th St, NY', activeShipments: 1, totalDeliveries: 1203, rating: 4.8, joinedAt: 'Jan 5, 2023', avatar: 'FA' },
  { id: 'c-003', name: 'Priya Sharma', phone: '+1 212-555-0403', email: 'priya.sharma@courierdesk.io', vehicle: 'Bicycle', status: 'available', location: 'Central Park South, NY', activeShipments: 0, totalDeliveries: 412, rating: 4.7, joinedAt: 'Jun 20, 2023', avatar: 'PS' },
  { id: 'c-004', name: 'Tomás Rivera', phone: '+1 212-555-0404', email: 'tomas.rivera@courierdesk.io', vehicle: 'Car', status: 'available', location: 'Park Ave & 42nd St, NY', activeShipments: 0, totalDeliveries: 634, rating: 4.6, joinedAt: 'Feb 14, 2023', avatar: 'TR' },
  { id: 'c-005', name: 'Wei Chen', phone: '+1 212-555-0405', email: 'wei.chen@courierdesk.io', vehicle: 'Motorcycle', status: 'offline', location: 'Last seen: 5th Ave, NY', activeShipments: 0, totalDeliveries: 289, rating: 4.5, joinedAt: 'Sep 8, 2023', avatar: 'WC' },
  { id: 'c-006', name: 'Aisha Nwosu', phone: '+1 212-555-0406', email: 'aisha.nwosu@courierdesk.io', vehicle: 'Van', status: 'available', location: 'Fulton St & Broadway, NY', activeShipments: 0, totalDeliveries: 521, rating: 4.8, joinedAt: 'Apr 3, 2023', avatar: 'AN' },
  { id: 'c-007', name: 'Dmitri Volkov', phone: '+1 212-555-0407', email: 'dmitri.volkov@courierdesk.io', vehicle: 'Car', status: 'busy', location: 'W 34th St & 8th Ave, NY', activeShipments: 3, totalDeliveries: 978, rating: 4.7, joinedAt: 'Dec 1, 2022', avatar: 'DV' },
];

const AVATAR_COLORS = ['bg-primary', 'bg-info', 'bg-success', 'bg-warning', 'bg-destructive', 'bg-primary/70', 'bg-info/70'];

const EMPTY_FORM = { name: '', phone: '', email: '', vehicle: 'Motorcycle', status: 'available' as CourierStatus };

export default function CouriersPage() {
  const [couriers, setCouriers] = useState<Courier[]>(INITIAL_COURIERS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Courier | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [viewTarget, setViewTarget] = useState<Courier | null>(null);
  const [page, setPage] = useState(1);
  const PER_PAGE = 6;

  const filtered = couriers.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.vehicle.toLowerCase().includes(search.toLowerCase()) ||
      c.location.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const openAdd = () => { setEditTarget(null); setForm(EMPTY_FORM); setModalOpen(true); };
  const openEdit = (c: Courier) => { setEditTarget(c); setForm({ name: c.name, phone: c.phone, email: c.email, vehicle: c.vehicle, status: c.status }); setModalOpen(true); setMenuOpen(null); };

  const handleSave = () => {
    if (!form.name.trim()) return;
    if (editTarget) {
      setCouriers((prev) => prev.map((c) => c.id === editTarget.id ? { ...c, ...form } : c));
    } else {
      const initials = form.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
      setCouriers((prev) => [{ ...form, id: `c-${Date.now()}`, location: 'Not yet tracked', activeShipments: 0, totalDeliveries: 0, rating: 0, joinedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), avatar: initials }, ...prev]);
    }
    setModalOpen(false);
  };

  const handleDelete = (id: string) => { setCouriers((prev) => prev.filter((c) => c.id !== id)); setMenuOpen(null); };

  const setStatus = (id: string, status: CourierStatus) => {
    setCouriers((prev) => prev.map((c) => c.id === id ? { ...c, status } : c));
    setMenuOpen(null);
  };

  return (
    <AppLayout activePath="/couriers">
      <div className="max-w-screen-xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-700 text-foreground">Couriers</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Manage courier fleet, availability, and assignments</p>
          </div>
          <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-600 hover:bg-primary/90 transition-colors">
            <Plus size={16} /> Add Courier
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total Couriers', value: couriers.length, color: 'text-foreground' },
            { label: 'Available', value: couriers.filter((c) => c.status === 'available').length, color: 'text-success' },
            { label: 'On Delivery', value: couriers.filter((c) => c.status === 'busy').length, color: 'text-warning' },
            { label: 'Offline', value: couriers.filter((c) => c.status === 'offline').length, color: 'text-muted-foreground' },
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
              placeholder="Search couriers..."
              className="w-full pl-9 pr-4 py-2 text-sm bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div className="flex gap-2">
            {['all', 'available', 'busy', 'offline'].map((s) => (
              <button
                key={s}
                onClick={() => { setStatusFilter(s); setPage(1); }}
                className={`px-3 py-2 text-xs font-600 rounded-lg capitalize transition-colors ${statusFilter === s ? 'bg-primary text-white' : 'bg-card border border-border text-muted-foreground hover:bg-muted'}`}
              >
                {s === 'all' ? 'All' : s === 'busy' ? 'On Delivery' : s}
              </button>
            ))}
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginated.map((courier, idx) => {
            const sc = STATUS_CONFIG[courier.status];
            const avatarColor = AVATAR_COLORS[idx % AVATAR_COLORS.length];
            return (
              <div key={courier.id} className="bg-card border border-border rounded-xl p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className={`h-11 w-11 rounded-full ${avatarColor} flex items-center justify-center text-white text-sm font-700`}>{courier.avatar}</div>
                      <span className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card ${sc.dot}`} />
                    </div>
                    <div>
                      <p className="font-700 text-foreground">{courier.name}</p>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-600 ${sc.className}`}>
                        {sc.icon}{sc.label}
                      </span>
                    </div>
                  </div>
                  <div className="relative">
                    <button onClick={() => setMenuOpen(menuOpen === courier.id ? null : courier.id)} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground transition-colors"><MoreHorizontal size={15} /></button>
                    {menuOpen === courier.id && (
                      <div className="absolute right-0 top-8 z-20 bg-card border border-border rounded-xl shadow-lg py-1 min-w-[160px]">
                        <button onClick={() => { setViewTarget(courier); setMenuOpen(null); }} className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-muted text-foreground"><Eye size={14} />View Details</button>
                        <button onClick={() => openEdit(courier)} className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-muted text-foreground"><Edit2 size={14} />Edit</button>
                        {courier.status !== 'available' && <button onClick={() => setStatus(courier.id, 'available')} className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-muted text-success"><CheckCircle size={14} />Set Available</button>}
                        {courier.status !== 'offline' && <button onClick={() => setStatus(courier.id, 'offline')} className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-muted text-muted-foreground"><WifiOff size={14} />Set Offline</button>}
                        <button onClick={() => handleDelete(courier.id)} className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-muted text-destructive"><Trash2 size={14} />Remove</button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2"><span className="text-base">{VEHICLE_ICONS[courier.vehicle] || '🚗'}</span><span>{courier.vehicle}</span></div>
                  <div className="flex items-center gap-2"><MapPin size={12} /><span className="truncate">{courier.location}</span></div>
                  <div className="flex items-center gap-2"><Phone size={12} /><span>{courier.phone}</span></div>
                </div>

                <div className="mt-4 pt-4 border-t border-border grid grid-cols-3 gap-2 text-center">
                  <div>
                    <p className="text-xs text-muted-foreground">Active</p>
                    <p className="text-sm font-700 text-foreground">{courier.activeShipments}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Delivered</p>
                    <p className="text-sm font-700 text-foreground">{courier.totalDeliveries}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Rating</p>
                    <p className="text-sm font-700 text-foreground">{courier.rating > 0 ? `⭐ ${courier.rating}` : '—'}</p>
                  </div>
                </div>
              </div>
            );
          })}
          {paginated.length === 0 && (
            <div className="col-span-3 py-16 text-center text-muted-foreground text-sm">No couriers found</div>
          )}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">{filtered.length} couriers</p>
          <div className="flex items-center gap-2">
            <button disabled={page === 1} onClick={() => setPage((p) => p - 1)} className="p-1.5 rounded-lg border border-border disabled:opacity-40 hover:bg-muted transition-colors"><ChevronLeft size={14} /></button>
            <span className="text-xs font-600">{page} / {totalPages}</span>
            <button disabled={page === totalPages} onClick={() => setPage((p) => p + 1)} className="p-1.5 rounded-lg border border-border disabled:opacity-40 hover:bg-muted transition-colors"><ChevronRight size={14} /></button>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-2xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="text-base font-700 text-foreground">{editTarget ? 'Edit Courier' : 'Add Courier'}</h2>
              <button onClick={() => setModalOpen(false)} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground"><X size={16} /></button>
            </div>
            <div className="px-6 py-5 space-y-4">
              {[
                { label: 'Full Name', key: 'name', placeholder: 'e.g. John Smith' },
                { label: 'Phone', key: 'phone', placeholder: '+1 212-555-0000' },
                { label: 'Email', key: 'email', placeholder: 'courier@courierdesk.io' },
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
                  <label className="block text-xs font-600 text-muted-foreground mb-1.5">Vehicle Type</label>
                  <select value={form.vehicle} onChange={(e) => setForm((f) => ({ ...f, vehicle: e.target.value }))} className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30">
                    {['Motorcycle', 'Bicycle', 'Car', 'Van', 'Truck'].map((v) => <option key={v}>{v}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-600 text-muted-foreground mb-1.5">Status</label>
                  <select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as CourierStatus }))} className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30">
                    <option value="available">Available</option>
                    <option value="busy">On Delivery</option>
                    <option value="offline">Offline</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border">
              <button onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm font-600 text-muted-foreground hover:text-foreground transition-colors">Cancel</button>
              <button onClick={handleSave} className="px-5 py-2 text-sm font-600 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">{editTarget ? 'Save Changes' : 'Add Courier'}</button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-2xl shadow-xl w-full max-w-sm">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="text-base font-700 text-foreground">Courier Details</h2>
              <button onClick={() => setViewTarget(null)} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground"><X size={16} /></button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center text-white text-xl font-700">{viewTarget.avatar}</div>
                  <span className={`absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full border-2 border-card ${STATUS_CONFIG[viewTarget.status].dot}`} />
                </div>
                <div>
                  <h3 className="font-700 text-foreground text-lg">{viewTarget.name}</h3>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-600 ${STATUS_CONFIG[viewTarget.status].className}`}>
                    {STATUS_CONFIG[viewTarget.status].icon}{STATUS_CONFIG[viewTarget.status].label}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Vehicle', value: `${VEHICLE_ICONS[viewTarget.vehicle] || ''} ${viewTarget.vehicle}` },
                  { label: 'Phone', value: viewTarget.phone },
                  { label: 'Location', value: viewTarget.location },
                  { label: 'Active Jobs', value: String(viewTarget.activeShipments) },
                  { label: 'Total Deliveries', value: String(viewTarget.totalDeliveries) },
                  { label: 'Rating', value: viewTarget.rating > 0 ? `⭐ ${viewTarget.rating}` : 'N/A' },
                  { label: 'Joined', value: viewTarget.joinedAt },
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
