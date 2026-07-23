'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Search, Eye, UserPlus, ChevronUp, ChevronDown,
  ChevronLeft, ChevronRight, X, MapPin, Package,
  Clock, User, Truck, CheckCircle, AlertCircle, XCircle,
  ArrowRight, ChevronDown as ChevronDownSm,
} from 'lucide-react';
import { ShipmentStatusBadge, ShipmentStatus } from '@/components/ui/StatusBadge';

// ─── Data ────────────────────────────────────────────────────────────────────

interface Shipment {
  id: string;
  trackingNumber: string;
  recipient: string;
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
  { id: 'c1', name: 'Jamal Okafor', vehicle: 'Motorcycle', status: 'available' },
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

const STATUS_TRANSITION_LABELS: Record<ShipmentStatus, string> = {
  pending: 'Pending',
  assigned: 'Mark Assigned',
  picked_up: 'Mark Picked Up',
  in_transit: 'Mark In Transit',
  delivered: 'Mark Delivered',
  failed: 'Mark Failed',
  cancelled: 'Cancel Shipment',
};

const STATUS_TRANSITION_ICONS: Record<ShipmentStatus, React.ReactNode> = {
  pending: <Clock size={12} />,
  assigned: <User size={12} />,
  picked_up: <Package size={12} />,
  in_transit: <Truck size={12} />,
  delivered: <CheckCircle size={12} />,
  failed: <AlertCircle size={12} />,
  cancelled: <XCircle size={12} />,
};

const INITIAL_SHIPMENTS: Shipment[] = [
  { id: 'ship-001', trackingNumber: 'CDK-20847', recipient: 'Northgate Retail Ltd.', origin: '245 W 34th St, NY', destination: '88 Canal St, NY', courier: 'Jamal Okafor', status: 'in_transit', weight: '3.2 kg', eta: '10:45 AM', createdAt: 'Jul 22, 08:12 AM', phone: '+1 212-555-0101', notes: 'Leave at reception desk if no answer.' },
  { id: 'ship-002', trackingNumber: 'CDK-20848', recipient: 'Sunrise Pharmacy', origin: '12 Park Ave, NY', destination: '500 7th Ave, NY', courier: 'Fatima Al-Hassan', status: 'picked_up', weight: '0.8 kg', eta: '11:20 AM', createdAt: 'Jul 22, 08:34 AM', phone: '+1 212-555-0202', notes: 'Fragile — handle with care.' },
  { id: 'ship-003', trackingNumber: 'CDK-20849', recipient: 'Harborview Clinic', origin: '78 Broad St, NY', destination: '320 E 42nd St, NY', courier: null, status: 'pending', weight: '5.1 kg', eta: 'Unassigned', createdAt: 'Jul 22, 09:01 AM', phone: '+1 212-555-0303', notes: 'Medical supplies — priority delivery.' },
  { id: 'ship-004', trackingNumber: 'CDK-20850', recipient: 'Apex Consulting', origin: '1 Liberty Plaza, NY', destination: '200 Park Ave, NY', courier: 'Priya Sharma', status: 'assigned', weight: '1.4 kg', eta: '12:00 PM', createdAt: 'Jul 22, 09:18 AM', phone: '+1 212-555-0404', notes: '' },
  { id: 'ship-005', trackingNumber: 'CDK-20851', recipient: 'Greenfield Foods', origin: '45 Fulton St, NY', destination: '900 3rd Ave, NY', courier: 'Tomás Rivera', status: 'in_transit', weight: '12.6 kg', eta: '11:55 AM', createdAt: 'Jul 22, 09:45 AM', phone: '+1 212-555-0505', notes: 'Keep refrigerated.' },
  { id: 'ship-006', trackingNumber: 'CDK-20839', recipient: 'Metro Office Supplies', origin: '55 Water St, NY', destination: '1251 6th Ave, NY', courier: 'Fatima Al-Hassan', status: 'in_transit', weight: '8.3 kg', eta: '10:30 AM', createdAt: 'Jul 22, 07:22 AM', phone: '+1 212-555-0606', notes: '' },
  { id: 'ship-007', trackingNumber: 'CDK-20832', recipient: 'Lakeview Medical', origin: '30 Rockefeller Plz, NY', destination: '445 Park Ave, NY', courier: 'Jamal Okafor', status: 'delivered', weight: '2.0 kg', eta: 'Delivered 09:48 AM', createdAt: 'Jul 22, 06:55 AM', phone: '+1 212-555-0707', notes: '' },
  { id: 'ship-008', trackingNumber: 'CDK-20821', recipient: 'Pacific Imports Co.', origin: '100 Broadway, NY', destination: '411 W 35th St, NY', courier: 'Wei Chen', status: 'failed', weight: '4.7 kg', eta: 'Attempt failed 08:14 AM', createdAt: 'Jul 22, 05:30 AM', phone: '+1 212-555-0808', notes: 'Recipient not available. Retry required.' },
];

// ─── Assign Dropdown ──────────────────────────────────────────────────────────

interface AssignDropdownProps {
  shipmentId: string;
  currentCourier: string | null;
  onAssign: (shipmentId: string, courierName: string) => void;
}

function AssignDropdown({ shipmentId, currentCourier, onAssign }: AssignDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const available = COURIERS.filter((c) => c.status === 'available');

  return (
    <div ref={ref} className="relative">
      <button
        onClick={(e) => { e.stopPropagation(); setOpen((o) => !o); }}
        className={`flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-600 transition-colors duration-150 whitespace-nowrap ${
          currentCourier
            ? 'bg-muted hover:bg-secondary text-foreground'
            : 'bg-warning-bg hover:bg-warning/20 text-warning'
        }`}
        title="Assign courier"
      >
        <UserPlus size={11} />
        {currentCourier ? currentCourier.split(' ')[0] : 'Assign'}
        <ChevronDownSm size={10} className={`transition-transform duration-150 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 z-50 w-52 rounded-lg border border-border bg-card shadow-lg py-1">
          <p className="px-3 py-1.5 text-[10px] font-700 text-muted-foreground uppercase tracking-wide border-b border-border mb-1">
            Available Couriers
          </p>
          {available.length === 0 && (
            <p className="px-3 py-2 text-xs text-muted-foreground">No couriers available</p>
          )}
          {available.map((c) => (
            <button
              key={c.id}
              onClick={(e) => {
                e.stopPropagation();
                onAssign(shipmentId, c.name);
                setOpen(false);
              }}
              className={`w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-muted transition-colors duration-100 ${
                currentCourier === c.name ? 'bg-primary/5 text-primary font-600' : 'text-foreground'
              }`}
            >
              <span className="h-5 w-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-700 shrink-0">
                {c.name.charAt(0)}
              </span>
              <span className="flex-1 text-left">
                <span className="block font-500">{c.name}</span>
                <span className="text-[10px] text-muted-foreground">{c.vehicle}</span>
              </span>
              {currentCourier === c.name && <CheckCircle size={12} className="text-primary shrink-0" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Status Transition Dropdown ───────────────────────────────────────────────

interface StatusDropdownProps {
  shipmentId: string;
  currentStatus: ShipmentStatus;
  onStatusChange: (shipmentId: string, newStatus: ShipmentStatus) => void;
}

function StatusDropdown({ shipmentId, currentStatus, onStatusChange }: StatusDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const transitions = STATUS_TRANSITIONS[currentStatus];

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  if (transitions.length === 0) {
    return <ShipmentStatusBadge status={currentStatus} size="sm" />;
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={(e) => { e.stopPropagation(); setOpen((o) => !o); }}
        className="flex items-center gap-1 group"
        title="Change status"
      >
        <ShipmentStatusBadge status={currentStatus} size="sm" />
        <ChevronDownSm
          size={10}
          className={`text-muted-foreground group-hover:text-foreground transition-all duration-150 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-1 z-50 w-44 rounded-lg border border-border bg-card shadow-lg py-1">
          <p className="px-3 py-1.5 text-[10px] font-700 text-muted-foreground uppercase tracking-wide border-b border-border mb-1">
            Transition To
          </p>
          {transitions.map((s) => (
            <button
              key={s}
              onClick={(e) => {
                e.stopPropagation();
                onStatusChange(shipmentId, s);
                setOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs text-foreground hover:bg-muted transition-colors duration-100"
            >
              <span className="text-muted-foreground">{STATUS_TRANSITION_ICONS[s]}</span>
              <ArrowRight size={10} className="text-muted-foreground/50" />
              {STATUS_TRANSITION_LABELS[s]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Shipment Detail Modal ────────────────────────────────────────────────────

interface ShipmentDetailModalProps {
  shipment: Shipment | null;
  onClose: () => void;
  onAssign: (shipmentId: string, courierName: string) => void;
  onStatusChange: (shipmentId: string, newStatus: ShipmentStatus) => void;
}

function ShipmentDetailModal({ shipment, onClose, onAssign, onStatusChange }: ShipmentDetailModalProps) {
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  if (!shipment) return null;

  const transitions = STATUS_TRANSITIONS[shipment.status];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Panel */}
      <div
        className="relative z-10 w-full max-w-lg bg-card rounded-2xl border border-border shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-border">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-base font-700 text-primary font-tabular">{shipment.trackingNumber}</span>
              <ShipmentStatusBadge status={shipment.status} size="sm" />
            </div>
            <p className="text-sm font-600 text-foreground">{shipment.recipient}</p>
            {shipment.phone && (
              <p className="text-xs text-muted-foreground mt-0.5">{shipment.phone}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors duration-150"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {/* Route */}
          <div className="bg-muted/40 rounded-xl p-4 space-y-3">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 h-5 w-5 rounded-full bg-positive/10 flex items-center justify-center shrink-0">
                <MapPin size={11} className="text-positive" />
              </div>
              <div>
                <p className="text-[10px] font-700 text-muted-foreground uppercase tracking-wide">Origin</p>
                <p className="text-xs text-foreground font-500 mt-0.5">{shipment.origin}</p>
              </div>
            </div>
            <div className="ml-2.5 border-l-2 border-dashed border-border h-3" />
            <div className="flex items-start gap-3">
              <div className="mt-0.5 h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <MapPin size={11} className="text-primary" />
              </div>
              <div>
                <p className="text-[10px] font-700 text-muted-foreground uppercase tracking-wide">Destination</p>
                <p className="text-xs text-foreground font-500 mt-0.5">{shipment.destination}</p>
              </div>
            </div>
          </div>

          {/* Meta grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-muted/30 rounded-lg p-3">
              <p className="text-[10px] font-700 text-muted-foreground uppercase tracking-wide mb-1">Weight</p>
              <p className="text-sm font-700 text-foreground font-tabular">{shipment.weight}</p>
            </div>
            <div className="bg-muted/30 rounded-lg p-3">
              <p className="text-[10px] font-700 text-muted-foreground uppercase tracking-wide mb-1">ETA</p>
              <p className="text-sm font-700 text-foreground font-tabular">{shipment.eta}</p>
            </div>
            <div className="bg-muted/30 rounded-lg p-3">
              <p className="text-[10px] font-700 text-muted-foreground uppercase tracking-wide mb-1">Created</p>
              <p className="text-[11px] font-600 text-foreground">{shipment.createdAt}</p>
            </div>
          </div>

          {/* Courier assignment */}
          <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
            <div>
              <p className="text-[10px] font-700 text-muted-foreground uppercase tracking-wide mb-1">Assigned Courier</p>
              {shipment.courier ? (
                <div className="flex items-center gap-2">
                  <span className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[11px] font-700">
                    {shipment.courier.charAt(0)}
                  </span>
                  <span className="text-sm font-600 text-foreground">{shipment.courier}</span>
                </div>
              ) : (
                <span className="text-xs text-warning font-600">Unassigned</span>
              )}
            </div>
            <AssignDropdown
              shipmentId={shipment.id}
              currentCourier={shipment.courier}
              onAssign={(id, name) => { onAssign(id, name); }}
            />
          </div>

          {/* Notes */}
          {shipment.notes && (
            <div className="p-3 bg-info-bg/40 rounded-lg border border-info/20">
              <p className="text-[10px] font-700 text-muted-foreground uppercase tracking-wide mb-1">Notes</p>
              <p className="text-xs text-foreground">{shipment.notes}</p>
            </div>
          )}
        </div>

        {/* Footer — status transitions */}
        {transitions.length > 0 && (
          <div className="px-5 pb-5">
            <p className="text-[10px] font-700 text-muted-foreground uppercase tracking-wide mb-2">Transition Status</p>
            <div className="flex flex-wrap gap-2">
              {transitions.map((s) => (
                <button
                  key={s}
                  onClick={() => { onStatusChange(shipment.id, s); onClose(); }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-600 border transition-colors duration-150 ${
                    s === 'cancelled' || s === 'failed' ?'border-danger/30 bg-danger-bg text-danger hover:bg-danger/20'
                      : s === 'delivered' ?'border-positive/30 bg-positive-bg text-positive hover:bg-positive/20' :'border-primary/30 bg-primary/5 text-primary hover:bg-primary/10'
                  }`}
                >
                  {STATUS_TRANSITION_ICONS[s]}
                  {STATUS_TRANSITION_LABELS[s]}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Table ───────────────────────────────────────────────────────────────

type SortKey = 'trackingNumber' | 'status' | 'createdAt';
type SortDir = 'asc' | 'desc';

export default function RecentShipmentsTable() {
  const [shipments, setShipments] = useState<Shipment[]>(INITIAL_SHIPMENTS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ShipmentStatus | 'all'>('all');
  const [sortKey, setSortKey] = useState<SortKey>('createdAt');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [page, setPage] = useState(1);
  const [detailShipment, setDetailShipment] = useState<Shipment | null>(null);
  const perPage = 6;

  const handleAssign = (shipmentId: string, courierName: string) => {
    setShipments((prev) =>
      prev.map((s) =>
        s.id === shipmentId
          ? { ...s, courier: courierName, status: s.status === 'pending' ? 'assigned' : s.status }
          : s
      )
    );
    if (detailShipment?.id === shipmentId) {
      setDetailShipment((prev) =>
        prev ? { ...prev, courier: courierName, status: prev.status === 'pending' ? 'assigned' : prev.status } : prev
      );
    }
  };

  const handleStatusChange = (shipmentId: string, newStatus: ShipmentStatus) => {
    setShipments((prev) =>
      prev.map((s) => (s.id === shipmentId ? { ...s, status: newStatus } : s))
    );
    if (detailShipment?.id === shipmentId) {
      setDetailShipment((prev) => (prev ? { ...prev, status: newStatus } : prev));
    }
  };

  const filtered = shipments.filter((s) => {
    const matchSearch =
      s.trackingNumber.toLowerCase().includes(search.toLowerCase()) ||
      s.recipient.toLowerCase().includes(search.toLowerCase()) ||
      (s.courier ?? '').toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || s.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const sorted = [...filtered].sort((a, b) => {
    const av = a[sortKey] ?? '';
    const bv = b[sortKey] ?? '';
    const cmp = av < bv ? -1 : av > bv ? 1 : 0;
    return sortDir === 'asc' ? cmp : -cmp;
  });

  const totalPages = Math.ceil(sorted.length / perPage);
  const paginated = sorted.slice((page - 1) * perPage, page * perPage);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(key); setSortDir('asc'); }
  };

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <ChevronUp size={12} className="text-muted-foreground/40" />;
    return sortDir === 'asc'
      ? <ChevronUp size={12} className="text-primary" />
      : <ChevronDown size={12} className="text-primary" />;
  };

  const STATUS_FILTERS: Array<{ value: ShipmentStatus | 'all'; label: string }> = [
    { value: 'all', label: 'All' },
    { value: 'pending', label: 'Pending' },
    { value: 'assigned', label: 'Assigned' },
    { value: 'in_transit', label: 'In Transit' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'failed', label: 'Failed' },
  ];

  return (
    <>
      <div className="card-elevated flex flex-col">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 border-b border-border">
          <div className="flex-1">
            <h2 className="text-base font-700 text-foreground">Recent Shipments</h2>
            <p className="text-xs text-muted-foreground mt-0.5">{filtered.length} shipments · Today</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search tracking, recipient..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="form-input pl-8 h-8 text-xs w-48"
              />
            </div>
            <div className="flex items-center gap-1 flex-wrap">
              {STATUS_FILTERS.map((f) => (
                <button
                  key={`filter-${f.value}`}
                  onClick={() => { setStatusFilter(f.value); setPage(1); }}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-600 transition-colors duration-150 ${
                    statusFilter === f.value
                      ? 'bg-primary text-white' :'bg-muted text-muted-foreground hover:bg-secondary'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                {[
                  { key: 'trackingNumber', label: 'Tracking #', sortable: true },
                  { key: 'recipient', label: 'Recipient', sortable: false },
                  { key: 'origin', label: 'Origin', sortable: false },
                  { key: 'destination', label: 'Destination', sortable: false },
                  { key: 'courier', label: 'Courier', sortable: false },
                  { key: 'weight', label: 'Weight', sortable: false },
                  { key: 'status', label: 'Status', sortable: true },
                  { key: 'eta', label: 'ETA', sortable: false },
                  { key: 'actions', label: '', sortable: false },
                ].map((col) => (
                  <th
                    key={`th-${col.key}`}
                    className={`px-4 py-2.5 text-left text-[11px] font-600 text-muted-foreground uppercase tracking-wide whitespace-nowrap ${
                      col.sortable ? 'cursor-pointer hover:text-foreground select-none' : ''
                    }`}
                    onClick={col.sortable ? () => handleSort(col.key as SortKey) : undefined}
                  >
                    <div className="flex items-center gap-1">
                      {col.label}
                      {col.sortable && <SortIcon col={col.key as SortKey} />}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center">
                    <p className="text-sm font-600 text-foreground mb-1">No shipments found</p>
                    <p className="text-xs text-muted-foreground">Try adjusting your search or filter criteria</p>
                  </td>
                </tr>
              ) : (
                paginated.map((shipment, idx) => (
                  <tr
                    key={shipment.id}
                    className={`border-b border-border transition-colors duration-100 hover:bg-muted/40 group ${
                      idx % 2 === 1 ? 'bg-muted/10' : ''
                    }`}
                  >
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-xs font-700 text-primary font-tabular">{shipment.trackingNumber}</span>
                    </td>
                    <td className="px-4 py-3 max-w-[140px]">
                      <span className="text-xs text-foreground font-500 truncate block">{shipment.recipient}</span>
                    </td>
                    <td className="px-4 py-3 max-w-[120px]">
                      <span className="text-xs text-muted-foreground truncate block">{shipment.origin}</span>
                    </td>
                    <td className="px-4 py-3 max-w-[120px]">
                      <span className="text-xs text-muted-foreground truncate block">{shipment.destination}</span>
                    </td>
                    {/* Courier — inline assign dropdown */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <AssignDropdown
                        shipmentId={shipment.id}
                        currentCourier={shipment.courier}
                        onAssign={handleAssign}
                      />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-xs text-muted-foreground font-tabular">{shipment.weight}</span>
                    </td>
                    {/* Status — inline transition dropdown */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <StatusDropdown
                        shipmentId={shipment.id}
                        currentStatus={shipment.status}
                        onStatusChange={handleStatusChange}
                      />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap max-w-[130px]">
                      <span className={`text-xs font-tabular ${
                        shipment.status === 'failed' ? 'text-danger font-600' :
                        shipment.status === 'delivered' ? 'text-positive font-600' :
                        shipment.status === 'pending' ? 'text-warning font-600' : 'text-foreground'
                      }`}>{shipment.eta}</span>
                    </td>
                    {/* Actions */}
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setDetailShipment(shipment)}
                        className="h-7 w-7 flex items-center justify-center rounded-md hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors duration-150"
                        title="View shipment details"
                      >
                        <Eye size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-border">
          <p className="text-xs text-muted-foreground font-tabular">
            Showing {Math.min((page - 1) * perPage + 1, sorted.length)}–{Math.min(page * perPage, sorted.length)} of {sorted.length}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="h-7 w-7 flex items-center justify-center rounded-md border border-border text-muted-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-150"
            >
              <ChevronLeft size={14} />
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={`page-${i + 1}`}
                onClick={() => setPage(i + 1)}
                className={`h-7 w-7 flex items-center justify-center rounded-md text-xs font-600 transition-colors duration-150 ${
                  page === i + 1
                    ? 'bg-primary text-white' :'border border-border text-muted-foreground hover:bg-muted'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="h-7 w-7 flex items-center justify-center rounded-md border border-border text-muted-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-150"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Shipment Detail Modal */}
      {detailShipment && (
        <ShipmentDetailModal
          shipment={detailShipment}
          onClose={() => setDetailShipment(null)}
          onAssign={handleAssign}
          onStatusChange={handleStatusChange}
        />
      )}
    </>
  );
}