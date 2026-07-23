'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { Plus, Search, Eye, X, ChevronLeft, ChevronRight, MapPin, User, ArrowRight, ChevronDown, Phone, Weight,  } from 'lucide-react';
import { ShipmentStatusBadge, ShipmentStatus } from '@/components/ui/StatusBadge';

interface Shipment {
  id: string;
  trackingNumber: string;
  recipient: string;
  company: string;
  origin: string;
  destination: string;
  courier: string | null;
  status: ShipmentStatus;
  weight: string;
  eta: string;
  createdAt: string;
  phone?: string;
  notes?: string;
}

const COURIERS = [
  { id: 'c1', name: 'Jamal Okafor', vehicle: 'Motorcycle', status: 'busy' },
  { id: 'c2', name: 'Fatima Al-Hassan', vehicle: 'Van', status: 'busy' },
  { id: 'c3', name: 'Priya Sharma', vehicle: 'Bicycle', status: 'available' },
  { id: 'c4', name: 'Tomás Rivera', vehicle: 'Car', status: 'available' },
  { id: 'c5', name: 'Wei Chen', vehicle: 'Motorcycle', status: 'offline' },
  { id: 'c6', name: 'Aisha Nwosu', vehicle: 'Van', status: 'available' },
];

const STATUS_TRANSITIONS: Record<ShipmentStatus, ShipmentStatus[]> = {
  pending: ['assigned', 'cancelled'],
  assigned: ['picked_up', 'cancelled'],
  picked_up: ['in_transit', 'failed'],
  in_transit: ['delivered', 'failed'],
  delivered: [],
  failed: ['pending'],
  cancelled: [],
};

const ALL_SHIPMENTS: Shipment[] = [
  { id: 'ship-001', trackingNumber: 'CDK-20847', recipient: 'Northgate Retail Ltd.', company: 'Northgate Retail Ltd.', origin: '245 W 34th St, NY', destination: '88 Canal St, NY', courier: 'Jamal Okafor', status: 'in_transit', weight: '3.2 kg', eta: '10:45 AM', createdAt: 'Jul 22, 08:12 AM', phone: '+1 212-555-0101', notes: 'Leave at reception desk if no answer.' },
  { id: 'ship-002', trackingNumber: 'CDK-20848', recipient: 'Sunrise Pharmacy', company: 'Sunrise Pharmacy', origin: '12 Park Ave, NY', destination: '500 7th Ave, NY', courier: 'Fatima Al-Hassan', status: 'picked_up', weight: '0.8 kg', eta: '11:20 AM', createdAt: 'Jul 22, 08:34 AM', phone: '+1 212-555-0202', notes: 'Fragile — handle with care.' },
  { id: 'ship-003', trackingNumber: 'CDK-20849', recipient: 'Harborview Clinic', company: 'Harborview Clinic', origin: '78 Broad St, NY', destination: '320 E 42nd St, NY', courier: null, status: 'pending', weight: '5.1 kg', eta: 'Unassigned', createdAt: 'Jul 22, 09:01 AM', phone: '+1 212-555-0303', notes: 'Medical supplies — priority delivery.' },
  { id: 'ship-004', trackingNumber: 'CDK-20850', recipient: 'Apex Consulting', company: 'Apex Consulting', origin: '1 Liberty Plaza, NY', destination: '200 Park Ave, NY', courier: 'Priya Sharma', status: 'assigned', weight: '1.4 kg', eta: '12:00 PM', createdAt: 'Jul 22, 09:18 AM', phone: '+1 212-555-0404', notes: '' },
  { id: 'ship-005', trackingNumber: 'CDK-20851', recipient: 'Greenfield Foods', company: 'Greenfield Foods', origin: '45 Fulton St, NY', destination: '900 3rd Ave, NY', courier: 'Tomás Rivera', status: 'in_transit', weight: '12.6 kg', eta: '11:55 AM', createdAt: 'Jul 22, 09:45 AM', phone: '+1 212-555-0505', notes: 'Keep refrigerated.' },
  { id: 'ship-006', trackingNumber: 'CDK-20839', recipient: 'Metro Office Supplies', company: 'Metro Office Supplies', origin: '55 Water St, NY', destination: '1251 6th Ave, NY', courier: 'Fatima Al-Hassan', status: 'in_transit', weight: '8.3 kg', eta: '10:30 AM', createdAt: 'Jul 22, 07:22 AM', phone: '+1 212-555-0606', notes: '' },
  { id: 'ship-007', trackingNumber: 'CDK-20832', recipient: 'Lakeview Medical', company: 'Meridian Logistics', origin: '30 Rockefeller Plz, NY', destination: '445 Park Ave, NY', courier: 'Jamal Okafor', status: 'delivered', weight: '2.0 kg', eta: 'Delivered 09:48 AM', createdAt: 'Jul 22, 06:55 AM', phone: '+1 212-555-0707', notes: '' },
  { id: 'ship-008', trackingNumber: 'CDK-20821', recipient: 'Pacific Imports Co.', company: 'Pacific Imports Co.', origin: '100 Broadway, NY', destination: '411 W 35th St, NY', courier: 'Wei Chen', status: 'failed', weight: '4.7 kg', eta: 'Attempt failed 08:14 AM', createdAt: 'Jul 22, 05:30 AM', phone: '+1 212-555-0808', notes: 'Recipient not available. Retry required.' },
  { id: 'ship-009', trackingNumber: 'CDK-20852', recipient: 'Riverside Bakery', company: 'Meridian Logistics', origin: '10 Hudson Yards, NY', destination: '350 W 42nd St, NY', courier: null, status: 'pending', weight: '2.3 kg', eta: 'Unassigned', createdAt: 'Jul 22, 10:05 AM', phone: '+1 212-555-0909', notes: '' },
  { id: 'ship-010', trackingNumber: 'CDK-20853', recipient: 'Skyline Architects', company: 'Meridian Logistics', origin: '4 World Trade Ctr, NY', destination: '1 Penn Plaza, NY', courier: 'Aisha Nwosu', status: 'assigned', weight: '6.8 kg', eta: '1:30 PM', createdAt: 'Jul 22, 10:22 AM', phone: '+1 212-555-1010', notes: 'Blueprints — do not fold.' },
  { id: 'ship-011', trackingNumber: 'CDK-20854', recipient: 'Downtown Deli', company: 'Greenfield Foods', origin: '250 Vesey St, NY', destination: '75 Broad St, NY', courier: 'Dmitri Volkov', status: 'cancelled', weight: '1.1 kg', eta: 'Cancelled', createdAt: 'Jul 22, 10:45 AM', phone: '+1 212-555-1111', notes: 'Order cancelled by customer.' },
  { id: 'ship-012', trackingNumber: 'CDK-20855', recipient: 'Uptown Gallery', company: 'Northgate Retail Ltd.', origin: '11 Times Square, NY', destination: '1000 5th Ave, NY', courier: 'Priya Sharma', status: 'delivered', weight: '3.5 kg', eta: 'Delivered 11:02 AM', createdAt: 'Jul 22, 08:50 AM', phone: '+1 212-555-1212', notes: 'Art prints — handle with care.' },
];

const EMPTY_FORM = { recipient: '', company: '', origin: '', destination: '', weight: '', phone: '', notes: '', courier: '', status: 'pending' as ShipmentStatus };

export default function ShipmentsPage() {
  const [shipments, setShipments] = useState<Shipment[]>(ALL_SHIPMENTS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [viewTarget, setViewTarget] = useState<Shipment | null>(null);
  const [assignOpen, setAssignOpen] = useState<string | null>(null);
  const [statusOpen, setStatusOpen] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [page, setPage] = useState(1);
  const PER_PAGE = 8;

  const filtered = shipments.filter((s) => {
    const matchSearch = s.trackingNumber.toLowerCase().includes(search.toLowerCase()) ||
      s.recipient.toLowerCase().includes(search.toLowerCase()) ||
      (s.courier || '').toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || s.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleCreate = () => {
    if (!form.recipient.trim() || !form.origin.trim() || !form.destination.trim()) return;
    const newShipment: Shipment = {
      ...form,
      id: `ship-${Date.now()}`,
      trackingNumber: `CDK-${20856 + shipments.length}`,
      courier: form.courier || null,
      eta: form.courier ? 'TBD' : 'Unassigned',
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
    };
    setShipments((prev) => [newShipment, ...prev]);
    setModalOpen(false);
    setForm(EMPTY_FORM);
  };

  const assignCourier = (shipmentId: string, courierName: string) => {
    setShipments((prev) => prev.map((s) => s.id === shipmentId ? { ...s, courier: courierName, status: s.status === 'pending' ? 'assigned' : s.status, eta: 'TBD' } : s));
    setAssignOpen(null);
  };

  const updateStatus = (shipmentId: string, newStatus: ShipmentStatus) => {
    setShipments((prev) => prev.map((s) => s.id === shipmentId ? { ...s, status: newStatus } : s));
    setStatusOpen(null);
  };

  const statusCounts = {
    all: shipments.length,
    pending: shipments.filter((s) => s.status === 'pending').length,
    in_transit: shipments.filter((s) => s.status === 'in_transit').length,
    delivered: shipments.filter((s) => s.status === 'delivered').length,
    failed: shipments.filter((s) => s.status === 'failed').length,
  };

  return (
    <AppLayout activePath="/shipments">
      <div className="max-w-screen-xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-700 text-foreground">Shipments</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Create, assign, and track all shipments</p>
          </div>
          <button onClick={() => setModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-600 hover:bg-primary/90 transition-colors">
            <Plus size={16} /> New Shipment
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { label: 'Total', value: statusCounts.all, color: 'text-foreground', key: 'all' },
            { label: 'Pending', value: statusCounts.pending, color: 'text-warning', key: 'pending' },
            { label: 'In Transit', value: statusCounts.in_transit, color: 'text-info', key: 'in_transit' },
            { label: 'Delivered', value: statusCounts.delivered, color: 'text-success', key: 'delivered' },
            { label: 'Failed', value: statusCounts.failed, color: 'text-destructive', key: 'failed' },
          ].map((stat) => (
            <button
              key={stat.key}
              onClick={() => { setStatusFilter(stat.key); setPage(1); }}
              className={`bg-card border rounded-xl p-4 text-left transition-all ${statusFilter === stat.key ? 'border-primary ring-1 ring-primary/30' : 'border-border hover:border-primary/40'}`}
            >
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <p className={`text-2xl font-700 mt-1 ${stat.color}`}>{stat.value}</p>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by tracking #, recipient, courier..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        {/* Table */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="text-left px-5 py-3 text-xs font-600 text-muted-foreground uppercase tracking-wide">Tracking #</th>
                  <th className="text-left px-5 py-3 text-xs font-600 text-muted-foreground uppercase tracking-wide">Recipient</th>
                  <th className="text-left px-5 py-3 text-xs font-600 text-muted-foreground uppercase tracking-wide">Route</th>
                  <th className="text-left px-5 py-3 text-xs font-600 text-muted-foreground uppercase tracking-wide">Courier</th>
                  <th className="text-left px-5 py-3 text-xs font-600 text-muted-foreground uppercase tracking-wide">Status</th>
                  <th className="text-left px-5 py-3 text-xs font-600 text-muted-foreground uppercase tracking-wide">ETA</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {paginated.map((shipment) => {
                  const transitions = STATUS_TRANSITIONS[shipment.status];
                  return (
                    <tr key={shipment.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-5 py-3.5">
                        <p className="font-700 text-foreground font-mono text-xs">{shipment.trackingNumber}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{shipment.createdAt}</p>
                      </td>
                      <td className="px-5 py-3.5">
                        <p className="font-600 text-foreground">{shipment.recipient}</p>
                        <p className="text-xs text-muted-foreground">{shipment.weight}</p>
                      </td>
                      <td className="px-5 py-3.5 max-w-[180px]">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <span className="truncate max-w-[70px]">{shipment.origin.split(',')[0]}</span>
                          <ArrowRight size={10} className="shrink-0" />
                          <span className="truncate max-w-[70px]">{shipment.destination.split(',')[0]}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="relative">
                          <button
                            onClick={() => setAssignOpen(assignOpen === shipment.id ? null : shipment.id)}
                            className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg border transition-colors ${shipment.courier ? 'border-border text-foreground hover:bg-muted' : 'border-dashed border-warning text-warning hover:bg-warning/5'}`}
                          >
                            <User size={11} />
                            <span>{shipment.courier || 'Assign'}</span>
                            <ChevronDown size={10} />
                          </button>
                          {assignOpen === shipment.id && (
                            <div className="absolute left-0 top-9 z-20 bg-card border border-border rounded-xl shadow-lg py-1 min-w-[180px]">
                              {COURIERS.map((c) => (
                                <button
                                  key={c.id}
                                  onClick={() => assignCourier(shipment.id, c.name)}
                                  className="flex items-center justify-between w-full px-4 py-2 text-xs hover:bg-muted text-foreground"
                                >
                                  <span className="font-600">{c.name}</span>
                                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-600 ${c.status === 'available' ? 'text-success bg-success/10' : c.status === 'busy' ? 'text-warning bg-warning/10' : 'text-muted-foreground bg-muted'}`}>{c.vehicle}</span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="relative">
                          {transitions.length > 0 ? (
                            <button onClick={() => setStatusOpen(statusOpen === shipment.id ? null : shipment.id)} className="group">
                              <ShipmentStatusBadge status={shipment.status} />
                            </button>
                          ) : (
                            <ShipmentStatusBadge status={shipment.status} />
                          )}
                          {statusOpen === shipment.id && transitions.length > 0 && (
                            <div className="absolute left-0 top-8 z-20 bg-card border border-border rounded-xl shadow-lg py-1 min-w-[160px]">
                              {transitions.map((t) => (
                                <button key={t} onClick={() => updateStatus(shipment.id, t)} className="flex items-center gap-2 w-full px-4 py-2 text-xs hover:bg-muted text-foreground">
                                  <ArrowRight size={11} /><span className="capitalize">{t.replace('_', ' ')}</span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-xs text-muted-foreground">{shipment.eta}</td>
                      <td className="px-5 py-3.5">
                        <button onClick={() => setViewTarget(shipment)} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"><Eye size={15} /></button>
                      </td>
                    </tr>
                  );
                })}
                {paginated.length === 0 && (
                  <tr><td colSpan={7} className="px-5 py-12 text-center text-muted-foreground text-sm">No shipments found</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between px-5 py-3 border-t border-border">
            <p className="text-xs text-muted-foreground">{filtered.length} shipments</p>
            <div className="flex items-center gap-2">
              <button disabled={page === 1} onClick={() => setPage((p) => p - 1)} className="p-1.5 rounded-lg border border-border disabled:opacity-40 hover:bg-muted transition-colors"><ChevronLeft size={14} /></button>
              <span className="text-xs font-600">{page} / {totalPages}</span>
              <button disabled={page === totalPages} onClick={() => setPage((p) => p + 1)} className="p-1.5 rounded-lg border border-border disabled:opacity-40 hover:bg-muted transition-colors"><ChevronRight size={14} /></button>
            </div>
          </div>
        </div>
      </div>

      {/* Create Shipment Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border sticky top-0 bg-card">
              <h2 className="text-base font-700 text-foreground">New Shipment</h2>
              <button onClick={() => setModalOpen(false)} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground"><X size={16} /></button>
            </div>
            <div className="px-6 py-5 space-y-4">
              {[
                { label: 'Recipient Name / Company', key: 'recipient', placeholder: 'e.g. Northgate Retail Ltd.' },
                { label: 'Company (Sender)', key: 'company', placeholder: 'Partner company name' },
                { label: 'Pickup Address', key: 'origin', placeholder: '245 W 34th St, New York, NY' },
                { label: 'Delivery Address', key: 'destination', placeholder: '88 Canal St, New York, NY' },
                { label: 'Weight', key: 'weight', placeholder: 'e.g. 3.2 kg' },
                { label: 'Recipient Phone', key: 'phone', placeholder: '+1 212-555-0000' },
                { label: 'Notes', key: 'notes', placeholder: 'Special instructions...' },
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
              <div>
                <label className="block text-xs font-600 text-muted-foreground mb-1.5">Assign Courier (optional)</label>
                <select value={form.courier} onChange={(e) => setForm((f) => ({ ...f, courier: e.target.value }))} className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30">
                  <option value="">Unassigned</option>
                  {COURIERS.map((c) => <option key={c.id} value={c.name}>{c.name} ({c.vehicle})</option>)}
                </select>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border sticky bottom-0 bg-card">
              <button onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm font-600 text-muted-foreground hover:text-foreground transition-colors">Cancel</button>
              <button onClick={handleCreate} className="px-5 py-2 text-sm font-600 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">Create Shipment</button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {viewTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border sticky top-0 bg-card">
              <div>
                <h2 className="text-base font-700 text-foreground">{viewTarget.trackingNumber}</h2>
                <p className="text-xs text-muted-foreground">{viewTarget.createdAt}</p>
              </div>
              <button onClick={() => setViewTarget(null)} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground"><X size={16} /></button>
            </div>
            <div className="px-6 py-5 space-y-5">
              <div className="flex items-center justify-between">
                <ShipmentStatusBadge status={viewTarget.status} />
                <span className="text-xs text-muted-foreground">{viewTarget.weight}</span>
              </div>
              <div className="bg-muted/40 rounded-xl p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-2 w-2 rounded-full bg-primary shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Pickup</p>
                    <p className="text-sm font-600 text-foreground">{viewTarget.origin}</p>
                  </div>
                </div>
                <div className="ml-[3px] h-6 w-px bg-border" />
                <div className="flex items-start gap-3">
                  <MapPin size={14} className="mt-0.5 text-success shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Delivery</p>
                    <p className="text-sm font-600 text-foreground">{viewTarget.destination}</p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Recipient', value: viewTarget.recipient },
                  { label: 'Phone', value: viewTarget.phone || '—' },
                  { label: 'Courier', value: viewTarget.courier || 'Unassigned' },
                  { label: 'ETA', value: viewTarget.eta },
                  { label: 'Company', value: viewTarget.company },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-muted/40 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground mb-1">{label}</p>
                    <p className="text-sm font-600 text-foreground">{value}</p>
                  </div>
                ))}
              </div>
              {viewTarget.notes && (
                <div className="bg-muted/40 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground mb-1">Notes</p>
                  <p className="text-sm text-foreground">{viewTarget.notes}</p>
                </div>
              )}
              {STATUS_TRANSITIONS[viewTarget.status].length > 0 && (
                <div>
                  <p className="text-xs font-600 text-muted-foreground mb-2">Update Status</p>
                  <div className="flex flex-wrap gap-2">
                    {STATUS_TRANSITIONS[viewTarget.status].map((t) => (
                      <button
                        key={t}
                        onClick={() => { updateStatus(viewTarget.id, t); setViewTarget((prev) => prev ? { ...prev, status: t } : null); }}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-600 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors capitalize"
                      >
                        <ArrowRight size={11} />{t.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {(assignOpen || statusOpen) && <div className="fixed inset-0 z-10" onClick={() => { setAssignOpen(null); setStatusOpen(null); }} />}
    </AppLayout>
  );
}
