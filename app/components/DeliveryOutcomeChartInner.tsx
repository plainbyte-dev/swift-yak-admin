'use client';

import React, { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const STATUS_DATA = [
  { name: 'Delivered', value: 1621, color: 'var(--positive)' },
  { name: 'In Transit', value: 89, color: 'var(--primary)' },
  { name: 'Assigned', value: 43, color: 'var(--info)' },
  { name: 'Pending', value: 14, color: 'var(--accent)' },
  { name: 'Failed', value: 52, color: 'var(--danger)' },
  { name: 'Cancelled', value: 23, color: 'var(--muted-foreground)' },
];

const CustomTooltip = ({ active, payload }: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; payload: { color: string } }>;
}) => {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  const total = STATUS_DATA.reduce((s, d) => s + d.value, 0);
  return (
    <div className="card-elevated p-3 text-xs shadow-card-md">
      <div className="flex items-center gap-2 mb-1">
        <span className="h-2 w-2 rounded-full inline-block" style={{ backgroundColor: item.payload.color }} />
        <span className="font-600 text-foreground">{item.name}</span>
      </div>
      <p className="text-muted-foreground font-tabular">
        {item.value} shipments ({((item.value / total) * 100).toFixed(1)}%)
      </p>
    </div>
  );
};

export default function DeliveryOutcomeChartInner() {
  return (
    <div className="card-elevated p-5">
      <div className="mb-3">
        <h2 className="text-sm font-700 text-foreground">Status Distribution</h2>
        <p className="text-xs text-muted-foreground mt-0.5">All shipments this week</p>
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <PieChart>
          <Pie
            data={STATUS_DATA}
            cx="50%"
            cy="50%"
            innerRadius={45}
            outerRadius={70}
            paddingAngle={2}
            dataKey="value"
            strokeWidth={0}
          >
            {STATUS_DATA.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            iconType="circle"
            iconSize={7}
            wrapperStyle={{ fontSize: 10, paddingTop: 4 }}
            formatter={(v) => <span className="text-muted-foreground">{v}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}