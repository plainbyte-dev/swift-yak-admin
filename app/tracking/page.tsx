'use client';

import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import { MapPin, Package, Truck, Clock, Search, Navigation, Wifi,  } from 'lucide-react';

interface LiveShipment {
  id: string;
  trackingNumber: string;
  recipient: string;
  courier: string;
  courierAvatar: string;
  vehicle: string;
  status: 'in_transit' | 'picked_up' | 'assigned';
  origin: string;
  destination: string;
  currentLocation: string;
  lat: number;
  lng: number;
  eta: string;
  progress: number;
  lastPing: string;
}

interface TrackingEvent {
  time: string;
  event: string;
  location: string;
  type: 'success' | 'info' | 'warning';
}

const LIVE_SHIPMENTS: LiveShipment[] = [
  { id: 'ship-001', trackingNumber: 'CDK-20847', recipient: 'Northgate Retail Ltd.', courier: 'Jamal Okafor', courierAvatar: 'JO', vehicle: 'Motorcycle', status: 'in_transit', origin: '245 W 34th St, NY', destination: '88 Canal St, NY', currentLocation: 'Canal St & Broadway, NY', lat: 40.7193, lng: -74.0020, eta: '10:45 AM', progress: 72, lastPing: '1 min ago' },
  { id: 'ship-002', trackingNumber: 'CDK-20848', recipient: 'Sunrise Pharmacy', courier: 'Fatima Al-Hassan', courierAvatar: 'FA', vehicle: 'Van', status: 'picked_up', origin: '12 Park Ave, NY', destination: '500 7th Ave, NY', currentLocation: '7th Ave & 34th St, NY', lat: 40.7484, lng: -73.9967, eta: '11:20 AM', progress: 35, lastPing: '2 min ago' },
  { id: 'ship-005', trackingNumber: 'CDK-20851', recipient: 'Greenfield Foods', courier: 'Tomás Rivera', courierAvatar: 'TR', vehicle: 'Car', status: 'in_transit', origin: '45 Fulton St, NY', destination: '900 3rd Ave, NY', currentLocation: 'Park Ave & 42nd St, NY', lat: 40.7527, lng: -73.9772, eta: '11:55 AM', progress: 58, lastPing: '30 sec ago' },
  { id: 'ship-006', trackingNumber: 'CDK-20839', recipient: 'Metro Office Supplies', courier: 'Fatima Al-Hassan', courierAvatar: 'FA', vehicle: 'Van', status: 'in_transit', origin: '55 Water St, NY', destination: '1251 6th Ave, NY', currentLocation: 'W 34th St & 8th Ave, NY', lat: 40.7484, lng: -74.0018, eta: '10:30 AM', progress: 85, lastPing: '45 sec ago' },
];

const TRACKING_HISTORY: Record<string, TrackingEvent[]> = {
  'ship-001': [
    { time: '10:12 AM', event: 'Out for delivery', location: 'Canal St & Broadway, NY', type: 'info' },
    { time: '09:48 AM', event: 'Package picked up', location: '245 W 34th St, NY', type: 'success' },
    { time: '09:30 AM', event: 'Courier assigned', location: 'Depot, NY', type: 'info' },
    { time: '08:12 AM', event: 'Shipment created', location: 'System', type: 'info' },
  ],
  'ship-002': [
    { time: '10:55 AM', event: 'Package picked up', location: '12 Park Ave, NY', type: 'success' },
    { time: '10:30 AM', event: 'Courier en route to pickup', location: 'Depot, NY', type: 'info' },
    { time: '08:34 AM', event: 'Shipment created', location: 'System', type: 'info' },
  ],
  'ship-005': [
    { time: '10:40 AM', event: 'Out for delivery', location: 'Park Ave & 42nd St, NY', type: 'info' },
    { time: '10:15 AM', event: 'Package picked up', location: '45 Fulton St, NY', type: 'success' },
    { time: '09:45 AM', event: 'Shipment created', location: 'System', type: 'info' },
  ],
  'ship-006': [
    { time: '10:22 AM', event: 'Approaching destination', location: 'W 34th St & 8th Ave, NY', type: 'success' },
    { time: '09:50 AM', event: 'Out for delivery', location: '55 Water St, NY', type: 'info' },
    { time: '07:22 AM', event: 'Shipment created', location: 'System', type: 'info' },
  ],
};

const STATUS_CONFIG = {
  in_transit: { label: 'In Transit', className: 'text-info bg-info/10', icon: <Truck size={11} /> },
  picked_up: { label: 'Picked Up', className: 'text-warning bg-warning/10', icon: <Package size={11} /> },
  assigned: { label: 'Assigned', className: 'text-primary bg-primary/10', icon: <Clock size={11} /> },
};

const AVATAR_COLORS = ['bg-primary', 'bg-info', 'bg-success', 'bg-warning'];

export default function TrackingPage() {
  const [selected, setSelected] = useState<LiveShipment>(LIVE_SHIPMENTS[0]);
  const [search, setSearch] = useState('');
  const [lastRefresh, setLastRefresh] = useState('Just now');
  const [pingCount, setPingCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPingCount((p) => p + 1);
      setLastRefresh('Just now');
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const filtered = LIVE_SHIPMENTS.filter((s) =>
    s.trackingNumber.toLowerCase().includes(search.toLowerCase()) ||
    s.recipient.toLowerCase().includes(search.toLowerCase()) ||
    s.courier.toLowerCase().includes(search.toLowerCase())
  );

  const events = TRACKING_HISTORY[selected.id] || [];

  return (
    <AppLayout activePath="/tracking">
      <div className="max-w-screen-xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-700 text-foreground">Live Tracking</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Real-time courier location and shipment progress</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
            <span>Live — {filtered.length} active shipments</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Active Shipments List */}
          <div className="lg:col-span-1 space-y-4">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search active shipments..."
                className="w-full pl-9 pr-4 py-2 text-sm bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            <div className="space-y-2">
              {filtered.map((shipment, idx) => {
                const sc = STATUS_CONFIG[shipment.status];
                const avatarColor = AVATAR_COLORS[idx % AVATAR_COLORS.length];
                const isSelected = selected.id === shipment.id;
                return (
                  <button
                    key={shipment.id}
                    onClick={() => setSelected(shipment)}
                    className={`w-full text-left bg-card border rounded-xl p-4 transition-all ${isSelected ? 'border-primary ring-1 ring-primary/30' : 'border-border hover:border-primary/40'}`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className={`h-8 w-8 rounded-full ${avatarColor} flex items-center justify-center text-white text-xs font-700 shrink-0`}>{shipment.courierAvatar}</div>
                        <div>
                          <p className="text-xs font-700 text-foreground">{shipment.courier}</p>
                          <p className="text-[10px] text-muted-foreground">{shipment.vehicle}</p>
                        </div>
                      </div>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-600 ${sc.className}`}>{sc.icon}{sc.label}</span>
                    </div>
                    <p className="text-xs font-700 text-foreground font-mono">{shipment.trackingNumber}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">{shipment.recipient}</p>
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1">
                        <span>Progress</span>
                        <span>{shipment.progress}%</span>
                      </div>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${shipment.progress}%` }} />
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-2 text-[10px] text-muted-foreground">
                      <span className="flex items-center gap-1"><Wifi size={9} />Ping {shipment.lastPing}</span>
                      <span className="flex items-center gap-1"><Clock size={9} />ETA {shipment.eta}</span>
                    </div>
                  </button>
                );
              })}
              {filtered.length === 0 && (
                <div className="py-12 text-center text-muted-foreground text-sm">No active shipments</div>
              )}
            </div>
          </div>

          {/* Right: Detail Panel */}
          <div className="lg:col-span-2 space-y-4">
            {/* Map Placeholder */}
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="relative h-64 bg-gradient-to-br from-muted/60 to-muted/20 flex items-center justify-center">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 39px, var(--border) 39px, var(--border) 40px), repeating-linear-gradient(90deg, transparent, transparent 39px, var(--border) 39px, var(--border) 40px)' }} />
                <div className="relative text-center space-y-3">
                  <div className="h-14 w-14 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
                    <Navigation size={24} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-700 text-foreground">{selected.currentLocation}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {selected.lat.toFixed(4)}°N, {Math.abs(selected.lng).toFixed(4)}°W
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-1.5 text-xs text-success">
                    <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
                    Live GPS — last ping {selected.lastPing}
                  </div>
                </div>
                {/* Courier pin */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="h-10 w-10 rounded-full bg-primary border-4 border-white shadow-lg flex items-center justify-center text-white text-xs font-700 animate-pulse">
                    {selected.courierAvatar}
                  </div>
                </div>
              </div>
              <div className="px-5 py-3 border-t border-border flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5"><MapPin size={12} className="text-primary" />{selected.origin.split(',')[0]}</span>
                  <span>→</span>
                  <span className="flex items-center gap-1.5"><MapPin size={12} className="text-success" />{selected.destination.split(',')[0]}</span>
                </div>
                <span className="text-xs font-600 text-foreground">ETA {selected.eta}</span>
              </div>
            </div>

            {/* Shipment Info */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Tracking #', value: selected.trackingNumber },
                { label: 'Courier', value: selected.courier },
                { label: 'Vehicle', value: selected.vehicle },
                { label: 'Progress', value: `${selected.progress}%` },
              ].map(({ label, value }) => (
                <div key={label} className="bg-card border border-border rounded-xl p-3">
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className="text-sm font-700 text-foreground mt-1 truncate">{value}</p>
                </div>
              ))}
            </div>

            {/* Progress Bar */}
            <div className="bg-card border border-border rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-700 text-foreground">Delivery Progress</p>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-600 ${STATUS_CONFIG[selected.status].className}`}>
                  {STATUS_CONFIG[selected.status].icon}{STATUS_CONFIG[selected.status].label}
                </span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden mb-2">
                <div className="h-full bg-gradient-to-r from-primary to-info rounded-full transition-all duration-700" style={{ width: `${selected.progress}%` }} />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Pickup: {selected.origin.split(',')[0]}</span>
                <span className="font-600 text-primary">{selected.progress}%</span>
                <span>Delivery: {selected.destination.split(',')[0]}</span>
              </div>
            </div>

            {/* Tracking Timeline */}
            <div className="bg-card border border-border rounded-xl p-5">
              <p className="text-sm font-700 text-foreground mb-4">Tracking Timeline</p>
              <div className="space-y-4">
                {events.map((event, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className={`mt-0.5 h-2 w-2 rounded-full shrink-0 ${event.type === 'success' ? 'bg-success' : event.type === 'warning' ? 'bg-warning' : 'bg-primary'}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-600 text-foreground">{event.event}</p>
                        <span className="text-xs text-muted-foreground shrink-0">{event.time}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1"><MapPin size={10} />{event.location}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
