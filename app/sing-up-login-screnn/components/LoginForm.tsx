'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import AppLogo from '@/components/ui/AppLogo';
import {
  Eye, EyeOff, Mail, Lock, ArrowRight, Copy, Check,
  Package, Truck, Clock, TrendingUp, AlertCircle, Loader2,
} from 'lucide-react';
import { toast } from 'sonner';
import Icon from '@/components/ui/AppIcon';


interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

const DEMO_CREDENTIALS = [
  {
    id: 'cred-superadmin',
    role: 'Super Admin',
    email: 'elena.vasquez@courierdesk.io',
    password: 'CDK$uperAdmin2026',
    description: 'Full platform access — manage companies, couriers, users',
    badgeClass: 'bg-danger-bg text-danger-foreground',
  },
  {
    id: 'cred-companyadmin',
    role: 'Company Admin',
    email: 'marcus.adeyemi@meridianlogistics.com',
    password: 'MeridianAdmin#99',
    description: 'Manage shipments, users, and view company stats',
    badgeClass: 'bg-primary/10 text-primary',
  },
  {
    id: 'cred-staff',
    role: 'Company Staff',
    email: 'nina.kowalski@meridianlogistics.com',
    password: 'StaffAccess!2026',
    description: 'Create shipments, view status, update tracking',
    badgeClass: 'bg-info-bg text-info-foreground',
  },
  {
    id: 'cred-courier',
    role: 'Courier',
    email: 'jamal.okafor@courierdesk.io',
    password: 'CourierApp@2026',
    description: 'View assigned shipments, update delivery status',
    badgeClass: 'bg-warning-bg text-warning-foreground',
  },
];

const STATS = [
  { id: 'stat-shipments', icon: Package, value: '2.4M+', label: 'Shipments tracked' },
  { id: 'stat-partners', icon: Truck, value: '380+', label: 'Partner companies' },
  { id: 'stat-ontime', icon: TrendingUp, value: '93.2%', label: 'On-time rate' },
  { id: 'stat-delivery', icon: Clock, value: '3.1h', label: 'Avg delivery time' },
];

export default function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    defaultValues: { email: '', password: '', rememberMe: false },
  });

  // Backend integration point: POST /api/auth/login with { email, password }
  // Expected response: { access_token, refresh_token, user: { id, role, company_id } }
  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    await new Promise((res) => setTimeout(res, 1200));

    const validCred = DEMO_CREDENTIALS.find(
      (c) => c.email === data.email && c.password === data.password
    );

    if (!validCred) {
      setIsLoading(false);
      toast.error('Invalid credentials — use the demo accounts below to sign in', {
        duration: 4000,
        icon: <AlertCircle size={16} />,
      });
      return;
    }

    toast.success(`Welcome back! Signed in as ${validCred.role}`, { duration: 2000 });
    setTimeout(() => router.push('/'), 800);
  };

  const handleAutofill = (email: string, password: string) => {
    setValue('email', email);
    setValue('password', password);
    toast.info('Credentials autofilled', { duration: 1500 });
  };

  const handleCopy = async (text: string, fieldId: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 1800);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel — Brand */}
      <div className="hidden lg:flex lg:w-[52%] xl:w-[55%] gradient-primary-bg flex-col justify-between p-10 xl:p-14 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 h-80 w-80 rounded-full bg-white/5" />
          <div className="absolute top-1/3 -left-16 h-64 w-64 rounded-full bg-white/5" />
          <div className="absolute bottom-20 right-10 h-48 w-48 rounded-full bg-white/5" />
          <div className="absolute bottom-40 -right-10 h-96 w-96 rounded-full border border-white/10" />
          <div className="absolute top-20 left-1/3 h-48 w-48 rounded-full border border-white/10" />
        </div>

        {/* Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <AppLogo size={36} />
            <span className="text-white font-800 text-xl tracking-tight">CourierDesk</span>
          </div>
          <p className="text-white/60 text-xs mt-1 ml-12">Partner Delivery Management Portal</p>
        </div>

        {/* Hero Copy */}
        <div className="relative z-10 flex-1 flex flex-col justify-center py-12">
          <h1 className="text-3xl xl:text-4xl font-800 text-white leading-tight mb-4">
            Every delivery,<br />
            tracked in real time.
          </h1>
          <p className="text-white/70 text-base leading-relaxed max-w-sm">
            Create shipments, assign couriers, and monitor your entire delivery
            operation from a single dashboard — built for logistics teams that
            can&apos;t afford to miss a delivery.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 mt-8 max-w-sm">
            {STATS.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.id} className="bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon size={16} className="text-accent" />
                    <span className="text-white font-800 text-lg font-tabular">{stat.value}</span>
                  </div>
                  <p className="text-white/60 text-xs">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10">
          <p className="text-white/40 text-xs">
            © 2026 CourierDesk Inc. · All rights reserved
          </p>
        </div>
      </div>

      {/* Right Panel — Form */}
      <div className="flex-1 flex flex-col justify-center px-6 py-10 sm:px-10 lg:px-12 xl:px-16 overflow-y-auto bg-background">
        {/* Mobile logo */}
        <div className="flex items-center gap-2 mb-8 lg:hidden">
          <AppLogo size={28} />
          <span className="font-800 text-lg text-foreground tracking-tight">CourierDesk</span>
        </div>

        <div className="w-full max-w-md mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl font-700 text-foreground tracking-tight">Sign in to your account</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Enter your credentials to access the partner portal
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="email" className="form-label">
                Email address
              </label>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@company.com"
                  className={`form-input pl-9 ${errors.email ? 'error' : ''}`}
                  {...register('email', {
                    required: 'Email address is required',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Enter a valid email address',
                    },
                  })}
                />
              </div>
              {errors.email && (
                <p className="form-error flex items-center gap-1">
                  <AlertCircle size={11} />
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="form-label mb-0">
                  Password
                </label>
                <button type="button" className="text-xs text-primary font-600 hover:underline">
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••••••"
                  className={`form-input pl-9 pr-10 ${errors.password ? 'error' : ''}`}
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 8, message: 'Password must be at least 8 characters' },
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-150"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.password && (
                <p className="form-error flex items-center gap-1">
                  <AlertCircle size={11} />
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-2">
              <input
                id="rememberMe"
                type="checkbox"
                className="h-4 w-4 rounded border-input accent-primary cursor-pointer"
                {...register('rememberMe')}
              />
              <label htmlFor="rememberMe" className="text-sm text-muted-foreground cursor-pointer select-none">
                Keep me signed in for 30 days
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full py-3 text-sm"
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign in to CourierDesk
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-background px-3 text-xs text-muted-foreground font-500">
                Demo accounts for evaluation
              </span>
            </div>
          </div>

          {/* Demo Credentials Table */}
          <div className="rounded-xl border border-border overflow-hidden">
            <div className="bg-muted/50 px-4 py-2.5 border-b border-border">
              <p className="text-xs font-600 text-foreground">
                Click a role to autofill credentials
              </p>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                These are pre-configured demo accounts — no registration needed
              </p>
            </div>
            <div className="divide-y divide-border">
              {DEMO_CREDENTIALS.map((cred) => (
                <div
                  key={cred.id}
                  className="flex items-start gap-3 px-4 py-3 hover:bg-muted/30 transition-colors duration-150 cursor-pointer group"
                  onClick={() => handleAutofill(cred.email, cred.password)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`status-badge text-[10px] px-2 py-0.5 ${cred.badgeClass}`}>
                        {cred.role}
                      </span>
                    </div>
                    <p className="text-[11px] text-foreground font-500 font-tabular truncate">{cred.email}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{cred.description}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0 mt-0.5">
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); handleCopy(cred.email, `${cred.id}-email`); }}
                      className="h-6 w-6 flex items-center justify-center rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-150"
                      title="Copy email"
                    >
                      {copiedField === `${cred.id}-email` ? (
                        <Check size={12} className="text-positive" />
                      ) : (
                        <Copy size={12} />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); handleAutofill(cred.email, cred.password); }}
                      className="px-2 py-1 rounded text-[10px] font-600 text-primary bg-primary/10 hover:bg-primary/20 transition-colors duration-150 opacity-0 group-hover:opacity-100"
                    >
                      Use
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="text-center text-xs text-muted-foreground mt-6">
            Need access for your company?{' '}
            <button className="text-primary font-600 hover:underline">
              Request a partner account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}