'use client';

import React, { useState } from 'react';
import Sidebar from './Sidebar';

interface AppLayoutProps {
  children: React.ReactNode;
  activePath?: string;
}

export default function AppLayout({ children, activePath }: AppLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((p) => !p)}
        activePath={activePath}
      />
      <main
        className="flex-1 overflow-y-auto overflow-x-hidden transition-all duration-300 ease-in-out"
      >
        <div className="min-h-full px-6 py-6 lg:px-8 xl:px-10 2xl:px-12">
          {children}
        </div>
      </main>
    </div>
  );
}