import React from 'react';
import { RefreshCw, Download, Plus, Bell } from 'lucide-react';


export default function DashboardHeader() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-2xl font-700 text-foreground tracking-tight">
          Operations Dashboard
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Meridian Logistics Co. ·{' '}
          <span className="text-positive font-500">Live</span>
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-positive ml-1 pulse-dot align-middle" />
          <span className="text-muted-foreground ml-2">
            Last updated: Jul 23, 2026, 05:56 AM
          </span>
        </p>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative">
          <button
            className="btn-secondary relative"
            title="View notifications"
          >
            <Bell size={15} />
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-danger text-white text-[9px] font-700 flex items-center justify-center">
              3
            </span>
          </button>
        </div>
        <button className="btn-secondary" title="Refresh dashboard data">
          <RefreshCw size={15} />
          <span className="hidden sm:inline">Refresh</span>
        </button>
        <button className="btn-secondary" title="Export report">
          <Download size={15} />
          <span className="hidden sm:inline">Export</span>
        </button>
        <button className="btn-primary">
          <Plus size={15} />
          New Shipment
        </button>
      </div>
    </div>
  );
}