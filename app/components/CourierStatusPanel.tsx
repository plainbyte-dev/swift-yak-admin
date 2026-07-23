import React from 'react';
import { MapPin, Clock, AlertCircle } from 'lucide-react';
import { CourierStatusBadge, CourierStatus } from '@/components/ui/StatusBadge';

const COURIERS = [
  {
    id: 'courier-001',
    name: 'Jamal Okafor',
    initials: 'JO',
    status: 'busy' as CourierStatus,
    vehicle: 'Motorcycle',
    currentShipment: 'CDK-20847',
    location: 'Midtown East, NY',
    lastPing: '2 min ago',
    deliveriesLeft: 3,
  },
  {
    id: 'courier-002',
    name: 'Priya Sharma',
    initials: 'PS',
    status: 'available' as CourierStatus,
    vehicle: 'Van',
    currentShipment: null,
    location: 'Brooklyn Heights, NY',
    lastPing: '1 min ago',
    deliveriesLeft: 0,
  },
  {
    id: 'courier-003',
    name: 'Tomás Rivera',
    initials: 'TR',
    status: 'busy' as CourierStatus,
    vehicle: 'Bicycle',
    currentShipment: 'CDK-20851',
    location: 'Lower Manhattan, NY',
    lastPing: '4 min ago',
    deliveriesLeft: 2,
  },
  {
    id: 'courier-004',
    name: 'Aisha Nwosu',
    initials: 'AN',
    status: 'available' as CourierStatus,
    vehicle: 'Motorcycle',
    currentShipment: null,
    location: 'Queens, NY',
    lastPing: '3 min ago',
    deliveriesLeft: 0,
  },
  {
    id: 'courier-005',
    name: 'Wei Chen',
    initials: 'WC',
    status: 'offline' as CourierStatus,
    vehicle: 'Van',
    currentShipment: null,
    location: 'Bronx, NY',
    lastPing: '47 min ago',
    deliveriesLeft: 0,
  },
  {
    id: 'courier-006',
    name: 'Fatima Al-Hassan',
    initials: 'FA',
    status: 'busy' as CourierStatus,
    vehicle: 'Motorcycle',
    currentShipment: 'CDK-20839',
    location: 'Upper West Side, NY',
    lastPing: '1 min ago',
    deliveriesLeft: 5,
  },
];

export default function CourierStatusPanel() {
  return (
    <div className="card-elevated p-5 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-700 text-foreground">Courier Status</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Live · 34 total</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-positive pulse-dot" />
            <span className="text-xs text-muted-foreground">Live</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2.5 flex-1 overflow-y-auto">
        {COURIERS.map((courier) => (
          <div
            key={courier.id}
            className={`rounded-lg border p-3 transition-all duration-150 hover:shadow-card cursor-pointer ${
              courier.status === 'offline' ?'border-border bg-muted/30 opacity-70'
                : courier.status === 'available' ?'border-positive/30 bg-positive-bg/30' :'border-border bg-card'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="relative shrink-0">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-700">
                  {courier.initials}
                </div>
                <span
                  className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white ${
                    courier.status === 'available' ?'bg-positive'
                      : courier.status === 'busy' ?'bg-warning' :'bg-muted-foreground'
                  }`}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-600 text-foreground truncate">{courier.name}</p>
                  <CourierStatusBadge status={courier.status} size="sm" />
                </div>
                <div className="flex items-center gap-1 mt-0.5">
                  <MapPin size={10} className="text-muted-foreground shrink-0" />
                  <p className="text-[10px] text-muted-foreground truncate">{courier.location}</p>
                </div>
                {courier.currentShipment && (
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="text-[10px] text-info font-600">{courier.currentShipment}</span>
                    <span className="text-[10px] text-muted-foreground">· {courier.deliveriesLeft} left</span>
                  </div>
                )}
                <div className="flex items-center gap-1 mt-0.5">
                  <Clock size={10} className="text-muted-foreground shrink-0" />
                  <span className="text-[10px] text-muted-foreground">{courier.lastPing}</span>
                  {courier.status === 'offline' && parseInt(courier.lastPing) > 30 && (
                    <AlertCircle size={10} className="text-danger ml-1" />
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="mt-3 w-full btn-secondary text-xs py-2">
        View All Couriers →
      </button>
    </div>
  );
}