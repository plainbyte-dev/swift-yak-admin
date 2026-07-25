import { ShipmentStatus, CourierStatus } from '@/components/ui/StatusBadge';

export interface ApiCourier {
  _id: string;
  name: string;
  vehicle: 'Motorcycle' | 'Van' | 'Bicycle' | 'Car' | 'Truck';
  status: CourierStatus;
  location: string;
  lastPingAt: string;
  phone?: string;
  initials: string;
  // Computed server-side in GET /couriers
  currentShipment?: string | null;
  deliveriesLeft?: number;
}

export interface ApiShipment {
  _id: string;
  trackingNumber: string;
  recipient: string;
  phone?: string;
  origin: string;
  destination: string;
  courier: { _id: string; name: string; vehicle: string; status: CourierStatus } | null;
  status: ShipmentStatus;
  weightKg: number;
  eta: string | null;
  deliveredAt?: string | null;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardMetrics {
  onTimeDeliveryRate: number | null;
  shipmentsToday: number;
  shipmentsTodayDelta: number;
  activeCouriers: number;
  couriersAvailable: number;
  couriersBusy: number;
  couriersOffline: number;
  avgDeliveryTimeMinutes: number | null;
  inTransitNow: number;
  failedDeliveriesToday: number;
  failedDeliveriesDelta: number;
  pendingAssignment: number;
  oldestPendingMinutes: number | null;
}

export interface Paginated<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
  };
}
