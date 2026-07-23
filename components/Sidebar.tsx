'use client';

import React from 'react';
import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';
import { LayoutDashboard, Package, Truck, Building2, Users, MapPin, BarChart3, Settings, ChevronLeft, ChevronRight, LogOut, Search,  } from 'lucide-react';
import Icon from '@/components/ui/AppIcon';


interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  activePath?: string;
}

const NAV_GROUPS = [
  {
    label: 'Operations',
    items: [
      { label: 'Dashboard', icon: LayoutDashboard, href: '/stats-dashboard', badge: null },
      { label: 'Shipments', icon: Package, href: '/shipments', badge: '3' },
      { label: 'Couriers', icon: Truck, href: '/couriers', badge: null },
      { label: 'Live Tracking', icon: MapPin, href: '/tracking', badge: null },
    ],
  },
  {
    label: 'Management',
    items: [
      { label: 'Companies', icon: Building2, href: '/companies', badge: null },
      { label: 'Users', icon: Users, href: '/users', badge: null },
      { label: 'Reports', icon: BarChart3, href: '/reports', badge: null },
    ],
  },
];

export default function Sidebar({ collapsed, onToggle, activePath }: SidebarProps) {
  return (
    <aside
      className="relative flex flex-col bg-card border-r border-border shrink-0 transition-all duration-300 ease-in-out"
      style={{ width: collapsed ? 64 : 240 }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-border h-16 overflow-hidden">
        <div className="shrink-0">
          <AppLogo size={28} />
        </div>
        {!collapsed && (
          <span className="font-bold text-base text-foreground tracking-tight whitespace-nowrap">
            CourierDesk
          </span>
        )}
      </div>

      {/* Search */}
      {!collapsed && (
        <div className="px-3 py-3 border-b border-border">
          <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg cursor-pointer hover:bg-secondary transition-colors duration-150">
            <Search size={14} className="text-muted-foreground shrink-0" />
            <span className="text-xs text-muted-foreground">Search... ⌘K</span>
          </div>
        </div>
      )}

      {/* Nav Groups */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-3 px-2">
        {NAV_GROUPS.map((group) => (
          <div key={`group-${group.label}`} className="mb-4">
            {!collapsed && (
              <p className="px-3 mb-1 text-[10px] font-700 uppercase tracking-widest text-muted-foreground select-none">
                {group.label}
              </p>
            )}
            <div className="flex flex-col gap-0.5">
              {group.items.map((item) => {
                const isActive = activePath === item.href || (item.href === '/stats-dashboard' && activePath === '/');
                const Icon = item.icon;
                return (
                  <Link
                    key={`nav-${item.href}`}
                    href={item.href}
                    title={collapsed ? item.label : undefined}
                    className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                  >
                    <Icon size={18} className="shrink-0" />
                    {!collapsed && (
                      <>
                        <span className="flex-1 truncate">{item.label}</span>
                        {item.badge && (
                          <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-warning text-white text-[10px] font-700 px-1.5">
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                    {collapsed && item.badge && (
                      <span className="absolute top-0.5 right-0.5 h-2 w-2 rounded-full bg-warning" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom */}
      <div className="border-t border-border px-2 py-3 flex flex-col gap-0.5">
        <Link
          href="/settings"
          className="sidebar-nav-item"
          title={collapsed ? 'Settings' : undefined}
        >
          <Settings size={18} className="shrink-0" />
          {!collapsed && <span className="truncate">Settings</span>}
        </Link>

        {!collapsed && (
          <div className="flex items-center gap-2 px-3 py-2 mt-1 rounded-lg hover:bg-muted cursor-pointer transition-colors duration-150">
            <div className="h-7 w-7 rounded-full bg-primary flex items-center justify-center text-white text-xs font-700 shrink-0">
              MA
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-600 text-foreground truncate">Marcus Adeyemi</p>
              <p className="text-[10px] text-muted-foreground truncate">Company Admin</p>
            </div>
            <LogOut size={14} className="text-muted-foreground shrink-0" />
          </div>
        )}

        {collapsed && (
          <button className="sidebar-nav-item justify-center" title="Logout">
            <LogOut size={18} className="shrink-0" />
          </button>
        )}
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-[72px] z-10 flex h-6 w-6 items-center justify-center rounded-full bg-card border border-border shadow-card text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-150"
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </aside>
  );
}