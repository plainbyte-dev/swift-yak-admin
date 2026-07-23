'use client';

import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';

// 14-day realistic data with weekend dips
const VOLUME_DATA = [
  { date: 'Jul 9', shipments: 198, onTime: 181, failed: 17, day: 'Wed' },
  { date: 'Jul 10', shipments: 221, onTime: 203, failed: 18, day: 'Thu' },
  { date: 'Jul 11', shipments: 234, onTime: 217, failed: 17, day: 'Fri' },
  { date: 'Jul 12', shipments: 142, onTime: 128, failed: 14, day: 'Sat' },
  { date: 'Jul 13', shipments: 98, onTime: 87, failed: 11, day: 'Sun' },
  { date: 'Jul 14', shipments: 209, onTime: 192, failed: 17, day: 'Mon' },
  { date: 'Jul 15', shipments: 228, onTime: 209, failed: 19, day: 'Tue' },
  { date: 'Jul 16', shipments: 241, onTime: 224, failed: 17, day: 'Wed' },
  { date: 'Jul 17', shipments: 256, onTime: 238, failed: 18, day: 'Thu' },
  { date: 'Jul 18', shipments: 239, onTime: 218, failed: 21, day: 'Fri' },
  { date: 'Jul 19', shipments: 134, onTime: 119, failed: 15, day: 'Sat' },
  { date: 'Jul 20', shipments: 107, onTime: 96, failed: 11, day: 'Sun' },
  { date: 'Jul 21', shipments: 231, onTime: 212, failed: 19, day: 'Mon' },
  { date: 'Jul 22', shipments: 247, onTime: 226, failed: 21, day: 'Tue' },
];

type TabType = 'volume' | 'ontime';

const CustomTooltip = ({ active, payload, label }: {
  active?: boolean;
  payload?: Array<{ value: number; name: string; color: string }>;
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="card-elevated p-3 text-xs shadow-card-md min-w-[160px]">
      <p className="font-600 text-foreground mb-2">{label}</p>
      {payload.map((entry, i) => (
        <div key={`tooltip-entry-${i}`} className="flex items-center justify-between gap-4 mb-1">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full inline-block" style={{ backgroundColor: entry.color }} />
            <span className="text-muted-foreground capitalize">{entry.name}</span>
          </div>
          <span className="font-600 text-foreground font-tabular">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

export default function ShipmentVolumeChartInner() {
  const [activeTab, setActiveTab] = useState<TabType>('volume');

  const totalThisWeek = VOLUME_DATA.slice(7).reduce((s, d) => s + d.shipments, 0);
  const totalLastWeek = VOLUME_DATA.slice(0, 7).reduce((s, d) => s + d.shipments, 0);
  const weekChange = totalThisWeek - totalLastWeek;
  const weekChangeDir = weekChange >= 0 ? 'up' : 'down';

  return (
    <div className="card-elevated p-5 h-full">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-base font-700 text-foreground">Shipment Volume</h2>
          <p className="text-xs text-muted-foreground mt-0.5">14-day trend · Jul 9 – Jul 22</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            {weekChangeDir === 'up' ? (
              <TrendingUp size={13} className="text-positive" />
            ) : (
              <TrendingDown size={13} className="text-danger" />
            )}
            <span className={`text-xs font-600 ${weekChangeDir === 'up' ? 'text-positive' : 'text-danger'}`}>
              {weekChange > 0 ? '+' : ''}{weekChange} this week
            </span>
          </div>
          <div className="flex rounded-lg border border-border overflow-hidden">
            {(['volume', 'ontime'] as TabType[]).map((tab) => (
              <button
                key={`chart-tab-${tab}`}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 text-xs font-600 transition-colors duration-150 ${
                  activeTab === tab
                    ? 'bg-primary text-white' :'bg-card text-muted-foreground hover:bg-muted'
                }`}
              >
                {tab === 'volume' ? 'Volume' : 'On-Time vs Failed'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {activeTab === 'volume' ? (
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={VOLUME_DATA} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="shipmentGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.2} />
                <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="shipments"
              stroke="var(--primary)"
              strokeWidth={2}
              fill="url(#shipmentGradient)"
              dot={false}
              activeDot={{ r: 4, fill: 'var(--primary)', strokeWidth: 2, stroke: 'var(--card)' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={VOLUME_DATA} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
              formatter={(v) => <span className="text-muted-foreground capitalize">{v}</span>}
            />
            <Bar dataKey="onTime" name="On-Time" fill="var(--positive)" radius={[3, 3, 0, 0]} />
            <Bar dataKey="failed" name="Failed" fill="var(--danger)" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}