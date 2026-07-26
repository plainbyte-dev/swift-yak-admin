import type { ApiCourier, ApiShipment, DashboardMetrics, ApiUser, Paginated, ApiCompany, ReportPeriod, CourierPerformance, VolumeDataPoint, CompanyPerformance, ReportsSummary } from './types';
import type { ShipmentStatus, CourierStatus } from '@/components/ui/StatusBadge';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
const TOKEN_KEY = 'cd_token';


export function getReportsSummary(period: ReportPeriod) {
  return request<{ data: ReportsSummary }>(`/reports/summary?period=${period}`);
}

export function getVolumeTrend(period: ReportPeriod) {
  return request<{ data: VolumeDataPoint[] }>(`/reports/volume?period=${period}`);
}

export function getCompanyPerformance(period: ReportPeriod) {
  return request<{ data: CompanyPerformance[] }>(`/reports/companies?period=${period}`);
}

export function getCourierLeaderboard(period: ReportPeriod) {
  return request<{ data: CourierPerformance[] }>(`/reports/couriers?period=${period}`);
}

class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

export interface GetUsersParams {
  search?: string;
  role?: ApiUser['role'] | 'all';
  page?: number;
  perPage?: number;
}

export function getUsers(params: GetUsersParams = {}) {
  const query = new URLSearchParams(
    Object.entries(params).reduce((acc, [k, v]) => {
      if (v !== undefined) acc[k] = String(v);
      return acc;
    }, {} as Record<string, string>)
  ).toString();

  return request<Paginated<ApiUser>>(`/users${query ? `?${query}` : ''}`);
}

export function updateUser(id: string, data: Partial<{
  name: string;
  role: ApiUser['role'];
  company: string;
  isActive: boolean;
}>) {
  return request<{ data: ApiUser }>(`/users/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export function deleteUser(id: string) {
  return request<void>(`/users/${id}`, { method: 'DELETE' });
}
export interface GetCompaniesParams {
  search?: string;
  status?: ApiCompany['status'] | 'all';
  page?: number;
  perPage?: number;
}

export function getCompanies(params: GetCompaniesParams = {}) {
  const query = new URLSearchParams(
    Object.entries(params).reduce((acc, [k, v]) => {
      if (v !== undefined) acc[k] = String(v);
      return acc;
    }, {} as Record<string, string>)
  ).toString();

  return request<Paginated<ApiCompany>>(`/companies${query ? `?${query}` : ''}`);
}

export function getCompany(id: string) {
  return request<{ data: ApiCompany }>(`/companies/${id}`);
}

export function createCompany(data: {
  name: string;
  contact: string;
  email: string;
  phone?: string;
  address?: string;
  status?: ApiCompany['status'];
  plan?: ApiCompany['plan'];
}) {
  return request<{ data: ApiCompany }>('/companies', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateCompany(id: string, data: Partial<{
  name: string;
  contact: string;
  email: string;
  phone: string;
  address: string;
  plan: ApiCompany['plan'];
}>) {
  return request<{ data: ApiCompany }>(`/companies/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export function updateCompanyStatus(id: string, status: ApiCompany['status']) {
  return request<{ data: ApiCompany }>(`/companies/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

export function deleteCompany(id: string) {
  return request<void>(`/companies/${id}`, { method: 'DELETE' });
}

export interface ShipmentEvent {
  status: ApiShipment['status'];
  changedAt: string;
}

export function getShipmentEvents(shipmentId: string) {
  return request<{ data: ShipmentEvent[] }>(`/shipments/${shipmentId}/events`);
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