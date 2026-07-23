'use client';

import React from 'react';
import { RadialBarChart, RadialBar, ResponsiveContainer, Tooltip } from 'recharts';

const UTILIZATION_DATA = [
  { name: 'Busy', value: 18, fill: 'var(--accent)' },
  { name: 'Available', value: 12, fill: 'var(--positive)' },
  { name: 'Offline', value: 4, fill: 'var(--muted-foreground)' },
];

const CustomTooltip = ({ active, payload }: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; payload: { fill: string } }>;
}) => {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  return (
    <div className="card-elevated p-2 text-xs shadow-card-md">
      <div className="flex items-center gap-1.5">
        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.payload.fill }} />
        <span className="font-600">{item.name}:</span>
        <span className="font-tabular">{item.value}</span>
      </div>
    </div>
  );
};

export default function CourierUtilizationChartInner() {
  return (
    <div className="card-elevated p-5">
      <div className="mb-3">
        <h2 className="text-sm font-700 text-foreground">Courier Utilization</h2>
        <p className="text-xs text-muted-foreground mt-0.5">34 total couriers</p>
      </div>
      <div className="flex items-center gap-4">
        <ResponsiveContainer width={110} height={110}>
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius={20}
            outerRadius={50}
            data={UTILIZATION_DATA}
            startAngle={90}
            endAngle={-270}
          >
            <RadialBar dataKey="value" cornerRadius={4} background={{ fill: 'var(--muted)' }} />
            <Tooltip content={<CustomTooltip />} />
          </RadialBarChart>
        </ResponsiveContainer>
        <div className="flex flex-col gap-2 flex-1">
          {UTILIZATION_DATA.map((item) => (
            <div key={`util-${item.name}`} className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: item.fill }} />
                <span className="text-xs text-muted-foreground">{item.name}</span>
              </div>
              <span className="text-xs font-700 font-tabular text-foreground">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}