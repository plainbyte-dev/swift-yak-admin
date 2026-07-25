import type { ApiCourier, ApiShipment, DashboardMetrics, Paginated } from './types';
import type { ShipmentStatus, CourierStatus } from '@/components/ui/StatusBadge';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
const TOKEN_KEY = 'cd_token';

class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

interface RequestOptions extends RequestInit {
  /** Next.js data cache behavior. Defaults to no-store — this is a live ops dashboard. */
  cache?: RequestCache;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const token = typeof window !== 'undefined' ? window.localStorage.getItem(TOKEN_KEY) : null;

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    cache: options.cache ?? 'no-store',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  let body: any = null;
  try {
    body = await res.json();
  } catch {
    // Non-JSON response (e.g. the API is unreachable) — fall through to the status check below.
  }

  if (!res.ok) {
    // Token expired/invalid — clear it so the app can redirect to login rather than
    // keep firing requests with a dead token.
    if (res.status === 401 && typeof window !== 'undefined' && path !== '/auth/login') {
      window.localStorage.removeItem(TOKEN_KEY);
    }
    throw new ApiError(res.status, body?.message || `Request to ${path} failed with ${res.status}`);
  }

  return body as T;
}

// ─── Auth ───────────────────────────────────────────────────────────────────

export type UserRole = 'admin' | 'dispatcher' | 'courier' | string;

export interface ApiUser {
  id: string;
  name: string;
  email: string;
  company?: string;
  role: UserRole;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: ApiUser;
}

export function register(data: {
  name: string;
  email: string;
  password: string;
  company?: string;
}) {
  return request<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  }).then((res) => {
    setToken(res.token);
    return res;
  });
}

export function login(data: { email: string; password: string }) {
  return request<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  }).then((res) => {
    setToken(res.token);
    return res;
  });
}

export function getMe() {
  return request<{ data: ApiUser }>('/auth/me');
}

export function logout() {
  clearToken();
}

// ─── Token storage ──────────────────────────────────────────────────────────

export function getToken(): string | null {
  return typeof window !== 'undefined' ? window.localStorage.getItem(TOKEN_KEY) : null;
}

export function setToken(token: string) {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(TOKEN_KEY, token);
  }
}

export function clearToken() {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(TOKEN_KEY);
  }
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

// ─── Shipments ──────────────────────────────────────────────────────────────

export interface GetShipmentsParams {
  search?: string;
  status?: ShipmentStatus | 'all';
  sortKey?: 'trackingNumber' | 'status' | 'createdAt';
  sortDir?: 'asc' | 'desc';
  page?: number;
  perPage?: number;
}

export function getShipments(params: GetShipmentsParams = {}) {
  const query = new URLSearchParams(
    Object.entries(params).reduce((acc, [k, v]) => {
      if (v !== undefined) acc[k] = String(v);
      return acc;
    }, {} as Record<string, string>)
  ).toString();

  return request<Paginated<ApiShipment>>(`/shipments${query ? `?${query}` : ''}`);
}

export function getShipment(id: string) {
  return request<{ data: ApiShipment }>(`/shipments/${id}`);
}

export function createShipment(data: {
  recipient: string;
  origin: string;
  destination: string;
  weightKg: number;
  phone?: string;
  notes?: string;
  eta?: string;
}) {
  return request<{ data: ApiShipment }>('/shipments', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateShipment(id: string, data: Partial<{
  recipient: string;
  origin: string;
  destination: string;
  weightKg: number;
  phone?: string;
  notes?: string;
  eta?: string;
}>) {
  return request<{ data: ApiShipment }>(`/shipments/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export function assignCourier(shipmentId: string, courierId: string) {
  return request<{ data: ApiShipment }>(`/shipments/${shipmentId}/assign`, {
    method: 'PATCH',
    body: JSON.stringify({ courierId }),
  });
}

export function updateShipmentStatus(shipmentId: string, status: ShipmentStatus) {
  return request<{ data: ApiShipment }>(`/shipments/${shipmentId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

export function deleteShipment(id: string) {
  return request<void>(`/shipments/${id}`, { method: 'DELETE' });
}

// ─── Couriers ───────────────────────────────────────────────────────────────

export function getCouriers(status?: CourierStatus) {
  const query = status ? `?status=${status}` : '';
  return request<{ data: ApiCourier[]; count: number }>(`/couriers${query}`);
}

export function getCourier(id: string) {
  return request<{ data: ApiCourier }>(`/couriers/${id}`);
}

export function createCourier(data: {
  name: string;
  vehicle: string;
  location?: string;
  phone?: string;
}) {
  return request<{ data: ApiCourier }>('/couriers', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateCourier(id: string, data: Partial<{
  name: string;
  vehicle: string;
  location?: string;
  phone?: string;
}>) {
  return request<{ data: ApiCourier }>(`/couriers/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export function updateCourierStatus(courierId: string, status: CourierStatus) {
  return request<{ data: ApiCourier }>(`/couriers/${courierId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

export function deleteCourier(id: string) {
  return request<void>(`/couriers/${id}`, { method: 'DELETE' });
}

// ─── Metrics ────────────────────────────────────────────────────────────────

export function getDashboardMetrics() {
  return request<{ data: DashboardMetrics }>('/metrics/dashboard');
}

export { ApiError };