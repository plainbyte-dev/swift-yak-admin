'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { TrendingUp, TrendingDown, Package, Truck, CheckCircle, Clock, AlertCircle, Building2, Calendar, Download, ChevronDown,  } from 'lucide-react';
import dynamic from 'next/dynamic';

const AreaChart = dynamic(() => import('recharts')?.then((m) => m?.AreaChart), { ssr: false });
const Area = dynamic(() => import('recharts')?.then((m) => m?.Area), { ssr: false });
const BarChartComp = dynamic(() => import('recharts')?.then((m) => m?.BarChart), { ssr: false });
const Bar = dynamic(() => import('recharts')?.then((m) => m?.Bar), { ssr: false });
const XAxis = dynamic(() => import('recharts')?.then((m) => m?.XAxis), { ssr: false });
const YAxis = dynamic(() => import('recharts')?.then((m) => m?.YAxis), { ssr: false });
const Tooltip = dynamic(() => import('recharts')?.then((m) => m?.Tooltip), { ssr: false });
const ResponsiveContainer = dynamic(() => import('recharts')?.then((m) => m?.ResponsiveContainer), { ssr: false });

const WEEKLY_DATA = [
  { day: 'Mon', shipments: 42, delivered: 38, failed: 4 },
  { day: 'Tue', shipments: 58, delivered: 54, failed: 4 },
  { day: 'Wed', shipments: 51, delivered: 47, failed: 4 },
  { day: 'Thu', shipments: 67, delivered: 63, failed: 4 },
  { day: 'Fri', shipments: 73, delivered: 68, failed: 5 },
  { day: 'Sat', shipments: 45, delivered: 43, failed: 2 },
  { day: 'Sun', shipments: 29, delivered: 28, failed: 1 },
];

const COMPANY_PERFORMANCE = [
  { company: 'Meridian', shipments: 1248, onTime: 94, revenue: '$18,420' },
  { company: 'Northgate', shipments: 543, onTime: 91, revenue: '$7,840' },
  { company: 'Harborview', shipments: 312, onTime: 97, revenue: '$4,920' },
  { company: 'Greenfield', shipments: 876, onTime: 89, revenue: '$12,180' },
  { company: 'Metro Office', shipments: 421, onTime: 93, revenue: '$6,340' },
];

const COURIER_STATS = [
  { name: 'Jamal Okafor', deliveries: 847, onTime: 96, rating: 4.9 },
  { name: 'Fatima Al-Hassan', deliveries: 1203, onTime: 94, rating: 4.8 },
  { name: 'Priya Sharma', deliveries: 412, onTime: 98, rating: 4.7 },
  { name: 'Tomás Rivera', deliveries: 634, onTime: 92, rating: 4.6 },
  { name: 'Aisha Nwosu', deliveries: 521, onTime: 95, rating: 4.8 },
];

const PERIODS = ['This Week', 'This Month', 'Last 3 Months', 'This Year'];

export default function ReportsPage() {
  const [period, setPeriod] = useState('This Week');
  const [periodOpen, setPeriodOpen] = useState(false);

  const kpis = [
    { label: 'Total Shipments', value: '365', change: '+12%', up: true, icon: <Package size={18} />, color: 'text-primary bg-primary/10' },
    { label: 'Delivered', value: '341', change: '+9%', up: true, icon: <CheckCircle size={18} />, color: 'text-success bg-success/10' },
    { label: 'On-Time Rate', value: '93.4%', change: '+1.2%', up: true, icon: <Clock size={18} />, color: 'text-info bg-info/10' },
    { label: 'Failed / Cancelled', value: '24', change: '-3%', up: false, icon: <AlertCircle size={18} />, color: 'text-destructive bg-destructive/10' },
    { label: 'Active Couriers', value: '6', change: '0%', up: true, icon: <Truck size={18} />, color: 'text-warning bg-warning/10' },
    { label: 'Partner Companies', value: '8', change: '+1', up: true, icon: <Building2 size={18} />, color: 'text-primary bg-primary/10' },
  ];

  return (
    <AppLayout activePath="/reports">
      <div className="max-w-screen-xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-700 text-foreground">Reports</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Performance analytics across companies, couriers, and shipments</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                onClick={() => setPeriodOpen((p) => !p)}
                className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg text-sm font-600 hover:bg-muted transition-colors"
              >
                <Calendar size={15} className="text-muted-foreground" />
                {period}
                <ChevronDown size={14} className="text-muted-foreground" />
              </button>
              {periodOpen && (
                <div className="absolute right-0 top-10 z-20 bg-card border border-border rounded-xl shadow-lg py-1 min-w-[160px]">
                  {PERIODS?.map((p) => (
                    <button key={p} onClick={() => { setPeriod(p); setPeriodOpen(false); }} className={`w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors ${period === p ? 'text-primary font-600' : 'text-foreground'}`}>{p}</button>
                  ))}
                </div>
              )}
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-600 hover:bg-primary/90 transition-colors">
              <Download size={15} /> Export
            </button>
          </div>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {kpis?.map((kpi) => (
            <div key={kpi?.label} className="bg-card border border-border rounded-xl p-4">
              <div className={`h-9 w-9 rounded-lg flex items-center justify-center mb-3 ${kpi?.color}`}>{kpi?.icon}</div>
              <p className="text-2xl font-700 text-foreground">{kpi?.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{kpi?.label}</p>
              <div className={`flex items-center gap-1 mt-1.5 text-xs font-600 ${kpi?.up ? 'text-success' : 'text-destructive'}`}>
                {kpi?.up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                {kpi?.change}
              </div>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Shipment Volume */}
          <div className="bg-card border border-border rounded-xl p-5">
            <h3 className="text-sm font-700 text-foreground mb-4">Shipment Volume — {period}</h3>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={WEEKLY_DATA} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                  <defs>
                    <linearGradient id="colorShipments" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorDelivered" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--success)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="var(--success)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }} />
                  <Area type="monotone" dataKey="shipments" stroke="var(--primary)" strokeWidth={2} fill="url(#colorShipments)" name="Total" />
                  <Area type="monotone" dataKey="delivered" stroke="var(--success)" strokeWidth={2} fill="url(#colorDelivered)" name="Delivered" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Company Shipments */}
          <div className="bg-card border border-border rounded-xl p-5">
            <h3 className="text-sm font-700 text-foreground mb-4">Shipments by Company</h3>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChartComp data={COMPANY_PERFORMANCE} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                  <XAxis dataKey="company" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }} />
                  <Bar dataKey="shipments" fill="var(--primary)" radius={[4, 4, 0, 0]} name="Shipments" />
                </BarChartComp>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Tables Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Company Performance */}
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-border">
              <h3 className="text-sm font-700 text-foreground">Company Performance</h3>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="text-left px-5 py-3 text-xs font-600 text-muted-foreground">Company</th>
                  <th className="text-right px-5 py-3 text-xs font-600 text-muted-foreground">Shipments</th>
                  <th className="text-right px-5 py-3 text-xs font-600 text-muted-foreground">On-Time</th>
                  <th className="text-right px-5 py-3 text-xs font-600 text-muted-foreground">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {COMPANY_PERFORMANCE?.map((co) => (
                  <tr key={co?.company} className="hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-3 font-600 text-foreground">{co?.company}</td>
                    <td className="px-5 py-3 text-right text-foreground">{co?.shipments?.toLocaleString()}</td>
                    <td className="px-5 py-3 text-right">
                      <span className={`font-600 ${co?.onTime >= 95 ? 'text-success' : co?.onTime >= 90 ? 'text-warning' : 'text-destructive'}`}>{co?.onTime}%</span>
                    </td>
                    <td className="px-5 py-3 text-right font-600 text-foreground">{co?.revenue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Courier Leaderboard */}
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-border">
              <h3 className="text-sm font-700 text-foreground">Courier Leaderboard</h3>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="text-left px-5 py-3 text-xs font-600 text-muted-foreground">#</th>
                  <th className="text-left px-5 py-3 text-xs font-600 text-muted-foreground">Courier</th>
                  <th className="text-right px-5 py-3 text-xs font-600 text-muted-foreground">Deliveries</th>
                  <th className="text-right px-5 py-3 text-xs font-600 text-muted-foreground">On-Time</th>
                  <th className="text-right px-5 py-3 text-xs font-600 text-muted-foreground">Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {COURIER_STATS?.sort((a, b) => b?.deliveries - a?.deliveries)?.map((courier, idx) => (
                  <tr key={courier?.name} className="hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-3 text-xs font-700 text-muted-foreground">{idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`}</td>
                    <td className="px-5 py-3 font-600 text-foreground">{courier?.name}</td>
                    <td className="px-5 py-3 text-right text-foreground">{courier?.deliveries?.toLocaleString()}</td>
                    <td className="px-5 py-3 text-right">
                      <span className={`font-600 ${courier?.onTime >= 95 ? 'text-success' : 'text-warning'}`}>{courier?.onTime}%</span>
                    </td>
                    <td className="px-5 py-3 text-right font-600 text-foreground">⭐ {courier?.rating}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {periodOpen && <div className="fixed inset-0 z-10" onClick={() => setPeriodOpen(false)} />}
    </AppLayout>
  );
}
