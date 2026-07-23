import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  Package,
  Truck,
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ArrowRight,
} from 'lucide-react';
import Icon from '@/components/ui/AppIcon';


// Bento grid plan:
// 7 cards → grid-cols-4
// Row 1: [On-Time Rate hero — col-span-2] [Shipment Volume] [Active Couriers]
// Row 2: [Avg Delivery Time] [In-Transit] [Failed Rate] [Pending Assignment — alert]

const METRICS = [
  {
    id: 'metric-ontime',
    label: 'On-Time Delivery Rate',
    value: '91.4%',
    change: '+2.1%',
    changeDir: 'up' as const,
    changeLabel: 'vs last 7 days',
    icon: CheckCircle2,
    iconBg: 'bg-positive-bg',
    iconColor: 'text-positive',
    hero: true,
    colSpan: 'col-span-2 md:col-span-2',
    context: 'SLA target: 90.0%',
    contextColor: 'text-positive',
    accent: 'border-l-4 border-l-positive',
  },
  {
    id: 'metric-volume',
    label: 'Shipments Today',
    value: '247',
    change: '+18',
    changeDir: 'up' as const,
    changeLabel: 'vs yesterday',
    icon: Package,
    iconBg: 'bg-primary/10',
    iconColor: 'text-primary',
    hero: false,
    colSpan: 'col-span-1',
    context: '1,842 this week',
    contextColor: 'text-muted-foreground',
    accent: '',
  },
  {
    id: 'metric-couriers',
    label: 'Active Couriers',
    value: '34',
    change: '12 available',
    changeDir: 'neutral' as const,
    changeLabel: '18 busy · 4 offline',
    icon: Truck,
    iconBg: 'bg-info-bg',
    iconColor: 'text-info',
    hero: false,
    colSpan: 'col-span-1',
    context: '82% utilization',
    contextColor: 'text-info',
    accent: '',
  },
  {
    id: 'metric-avgtime',
    label: 'Avg Delivery Time',
    value: '3h 22m',
    change: '-14m',
    changeDir: 'up' as const,
    changeLabel: 'vs last week',
    icon: Clock,
    iconBg: 'bg-primary/10',
    iconColor: 'text-primary',
    hero: false,
    colSpan: 'col-span-1',
    context: 'SLA target: 4h 00m',
    contextColor: 'text-positive',
    accent: '',
  },
  {
    id: 'metric-intransit',
    label: 'In Transit Now',
    value: '89',
    change: '+6',
    changeDir: 'up' as const,
    changeLabel: 'since 1 hour ago',
    icon: ArrowRight,
    iconBg: 'bg-info-bg',
    iconColor: 'text-info',
    hero: false,
    colSpan: 'col-span-1',
    context: '36% of daily volume',
    contextColor: 'text-muted-foreground',
    accent: '',
  },
  {
    id: 'metric-failed',
    label: 'Failed Deliveries',
    value: '11',
    change: '+3',
    changeDir: 'down' as const,
    changeLabel: 'vs yesterday',
    icon: XCircle,
    iconBg: 'bg-danger-bg',
    iconColor: 'text-danger',
    hero: false,
    colSpan: 'col-span-1',
    context: '4.5% failure rate',
    contextColor: 'text-danger',
    accent: '',
  },
  {
    id: 'metric-pending',
    label: 'Pending Assignment',
    value: '14',
    change: 'Needs action',
    changeDir: 'alert' as const,
    changeLabel: 'No courier assigned',
    icon: AlertTriangle,
    iconBg: 'bg-warning-bg',
    iconColor: 'text-warning',
    hero: false,
    colSpan: 'col-span-1',
    context: 'Oldest: 47 min ago',
    contextColor: 'text-warning',
    accent: 'border-l-4 border-l-warning',
    alert: true,
  },
];

export default function MetricsBentoGrid() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
      {METRICS.map((metric) => {
        const Icon = metric.icon;
        return (
          <div
            key={metric.id}
            className={`card-elevated card-hover p-5 ${metric.colSpan} ${metric.accent} ${
              metric.alert ? 'bg-warning-bg/30' : ''
            } ${metric.hero ? 'bg-positive-bg/20' : ''}`}
          >
            <div className="flex items-start justify-between mb-3">
              <p className="text-xs font-600 text-muted-foreground uppercase tracking-wide leading-tight">
                {metric.label}
              </p>
              <div className={`h-9 w-9 rounded-lg ${metric.iconBg} flex items-center justify-center shrink-0`}>
                <Icon size={18} className={metric.iconColor} />
              </div>
            </div>

            <div className={`font-tabular mb-1 ${metric.hero ? 'text-hero-metric' : 'text-metric-md'} text-foreground`}>
              {metric.value}
            </div>

            <div className="flex items-center gap-1 mb-1">
              {metric.changeDir === 'up' && (
                <TrendingUp size={12} className="text-positive shrink-0" />
              )}
              {metric.changeDir === 'down' && (
                <TrendingDown size={12} className="text-danger shrink-0" />
              )}
              {metric.changeDir === 'alert' && (
                <AlertTriangle size={12} className="text-warning shrink-0" />
              )}
              <span
                className={`text-xs font-600 ${
                  metric.changeDir === 'up' ?'text-positive'
                    : metric.changeDir === 'down' ?'text-danger'
                    : metric.changeDir === 'alert' ?'text-warning' :'text-muted-foreground'
                }`}
              >
                {metric.change}
              </span>
              <span className="text-xs text-muted-foreground">{metric.changeLabel}</span>
            </div>

            <p className={`text-xs font-500 ${metric.contextColor}`}>
              {metric.context}
            </p>
          </div>
        );
      })}
    </div>
  );
}