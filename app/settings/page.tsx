'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import {
  Settings, User, Bell, Shield, Globe, Palette,
  Save, ChevronRight, Moon, Sun, Check,
} from 'lucide-react';
import Icon from '@/components/ui/AppIcon';


const SECTIONS = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'regional', label: 'Regional', icon: Globe },
];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('profile');
  const [saved, setSaved] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [notifications, setNotifications] = useState({
    newShipment: true,
    statusUpdate: true,
    courierAlert: true,
    weeklyReport: false,
    smsAlerts: false,
  });
  const [profile, setProfile] = useState({
    name: 'Marcus Adeyemi',
    email: 'marcus.adeyemi@meridianlogistics.com',
    phone: '+1 212-555-0100',
    company: 'Meridian Logistics',
    role: 'Company Admin',
    timezone: 'America/New_York',
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <AppLayout activePath="/settings">
      <div className="max-w-screen-lg mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-700 text-foreground">Settings</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage your account preferences and platform settings</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Nav */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              {SECTIONS.map((section) => {
                const Icon = section.icon;
                const isActive = activeSection === section.id;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`flex items-center justify-between w-full px-4 py-3 text-sm transition-colors border-b border-border last:border-0 ${isActive ? 'bg-primary/5 text-primary font-600' : 'text-foreground hover:bg-muted'}`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={16} className={isActive ? 'text-primary' : 'text-muted-foreground'} />
                      {section.label}
                    </div>
                    <ChevronRight size={14} className={isActive ? 'text-primary' : 'text-muted-foreground'} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="bg-card border border-border rounded-xl">
              {/* Profile */}
              {activeSection === 'profile' && (
                <div>
                  <div className="px-6 py-4 border-b border-border">
                    <h2 className="text-base font-700 text-foreground">Profile Settings</h2>
                    <p className="text-xs text-muted-foreground mt-0.5">Update your personal information</p>
                  </div>
                  <div className="px-6 py-5 space-y-4">
                    <div className="flex items-center gap-4 pb-4 border-b border-border">
                      <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center text-white text-xl font-700">MA</div>
                      <div>
                        <p className="text-sm font-600 text-foreground">{profile.name}</p>
                        <p className="text-xs text-muted-foreground">{profile.role} · {profile.company}</p>
                        <button className="text-xs text-primary mt-1 hover:underline">Change avatar</button>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { label: 'Full Name', key: 'name' },
                        { label: 'Email Address', key: 'email' },
                        { label: 'Phone Number', key: 'phone' },
                        { label: 'Company', key: 'company' },
                      ].map(({ label, key }) => (
                        <div key={key}>
                          <label className="block text-xs font-600 text-muted-foreground mb-1.5">{label}</label>
                          <input
                            value={(profile as Record<string, string>)[key]}
                            onChange={(e) => setProfile((p) => ({ ...p, [key]: e.target.value }))}
                            className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                          />
                        </div>
                      ))}
                    </div>
                    <div>
                      <label className="block text-xs font-600 text-muted-foreground mb-1.5">Role</label>
                      <input value={profile.role} disabled className="w-full px-3 py-2 text-sm bg-muted border border-border rounded-lg text-muted-foreground cursor-not-allowed" />
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications */}
              {activeSection === 'notifications' && (
                <div>
                  <div className="px-6 py-4 border-b border-border">
                    <h2 className="text-base font-700 text-foreground">Notification Preferences</h2>
                    <p className="text-xs text-muted-foreground mt-0.5">Choose what alerts you receive</p>
                  </div>
                  <div className="px-6 py-5 space-y-1">
                    {[
                      { key: 'newShipment', label: 'New Shipment Created', desc: 'Get notified when a new shipment is created in your company' },
                      { key: 'statusUpdate', label: 'Status Updates', desc: 'Receive alerts when shipment status changes' },
                      { key: 'courierAlert', label: 'Courier Alerts', desc: 'Notifications for courier assignment and location updates' },
                      { key: 'weeklyReport', label: 'Weekly Summary Report', desc: 'Receive a weekly performance summary every Monday' },
                      { key: 'smsAlerts', label: 'SMS Alerts', desc: 'Receive critical alerts via SMS (additional charges may apply)' },
                    ].map(({ key, label, desc }) => (
                      <div key={key} className="flex items-center justify-between py-4 border-b border-border last:border-0">
                        <div>
                          <p className="text-sm font-600 text-foreground">{label}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
                        </div>
                        <button
                          onClick={() => setNotifications((n) => ({ ...n, [key]: !n[key as keyof typeof n] }))}
                          className={`relative h-6 w-11 rounded-full transition-colors ${(notifications as Record<string, boolean>)[key] ? 'bg-primary' : 'bg-muted'}`}
                        >
                          <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${(notifications as Record<string, boolean>)[key] ? 'translate-x-5' : 'translate-x-0.5'}`} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Security */}
              {activeSection === 'security' && (
                <div>
                  <div className="px-6 py-4 border-b border-border">
                    <h2 className="text-base font-700 text-foreground">Security</h2>
                    <p className="text-xs text-muted-foreground mt-0.5">Manage your password and account security</p>
                  </div>
                  <div className="px-6 py-5 space-y-4">
                    {[
                      { label: 'Current Password', placeholder: '••••••••' },
                      { label: 'New Password', placeholder: '••••••••' },
                      { label: 'Confirm New Password', placeholder: '••••••••' },
                    ].map(({ label, placeholder }) => (
                      <div key={label}>
                        <label className="block text-xs font-600 text-muted-foreground mb-1.5">{label}</label>
                        <input type="password" placeholder={placeholder} className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30" />
                      </div>
                    ))}
                    <div className="pt-2 border-t border-border">
                      <div className="flex items-center justify-between py-3">
                        <div>
                          <p className="text-sm font-600 text-foreground">Two-Factor Authentication</p>
                          <p className="text-xs text-muted-foreground mt-0.5">Add an extra layer of security to your account</p>
                        </div>
                        <button className="px-3 py-1.5 text-xs font-600 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors">Enable 2FA</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Appearance */}
              {activeSection === 'appearance' && (
                <div>
                  <div className="px-6 py-4 border-b border-border">
                    <h2 className="text-base font-700 text-foreground">Appearance</h2>
                    <p className="text-xs text-muted-foreground mt-0.5">Customize the look and feel of the dashboard</p>
                  </div>
                  <div className="px-6 py-5 space-y-6">
                    <div>
                      <p className="text-sm font-600 text-foreground mb-3">Theme</p>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { key: 'light', label: 'Light', icon: <Sun size={18} /> },
                          { key: 'dark', label: 'Dark', icon: <Moon size={18} /> },
                          { key: 'system', label: 'System', icon: <Settings size={18} /> },
                        ].map(({ key, label, icon }) => (
                          <button
                            key={key}
                            onClick={() => setTheme(key as typeof theme)}
                            className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${theme === key ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40'}`}
                          >
                            <div className={theme === key ? 'text-primary' : 'text-muted-foreground'}>{icon}</div>
                            <span className={`text-xs font-600 ${theme === key ? 'text-primary' : 'text-foreground'}`}>{label}</span>
                            {theme === key && <Check size={12} className="text-primary" />}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Regional */}
              {activeSection === 'regional' && (
                <div>
                  <div className="px-6 py-4 border-b border-border">
                    <h2 className="text-base font-700 text-foreground">Regional Settings</h2>
                    <p className="text-xs text-muted-foreground mt-0.5">Configure timezone, language, and date formats</p>
                  </div>
                  <div className="px-6 py-5 space-y-4">
                    {[
                      { label: 'Timezone', options: ['America/New_York', 'America/Chicago', 'America/Los_Angeles', 'Europe/London', 'Europe/Paris', 'Asia/Tokyo'] },
                      { label: 'Language', options: ['English (US)', 'English (UK)', 'French', 'Spanish', 'German'] },
                      { label: 'Date Format', options: ['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD'] },
                      { label: 'Time Format', options: ['12-hour (AM/PM)', '24-hour'] },
                    ].map(({ label, options }) => (
                      <div key={label}>
                        <label className="block text-xs font-600 text-muted-foreground mb-1.5">{label}</label>
                        <select className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30">
                          {options.map((o) => <option key={o}>{o}</option>)}
                        </select>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Save Button */}
              <div className="px-6 py-4 border-t border-border flex justify-end">
                <button
                  onClick={handleSave}
                  className={`flex items-center gap-2 px-5 py-2 text-sm font-600 rounded-lg transition-all ${saved ? 'bg-success text-white' : 'bg-primary text-white hover:bg-primary/90'}`}
                >
                  {saved ? <><Check size={15} />Saved!</> : <><Save size={15} />Save Changes</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
