'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AppLogo from '@/components/ui/AppLogo';
import { Eye, EyeOff, Loader2, AlertCircle, Check } from 'lucide-react';
import { register, ApiError } from '@/lib/api';

interface FormState {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  company: string;
}

interface FieldErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

const PASSWORD_MIN_LENGTH = 8;

function validate(form: FormState): FieldErrors {
  const errors: FieldErrors = {};

  if (!form.name.trim()) {
    errors.name = 'Name is required';
  }

  if (!form.email.trim()) {
    errors.email = 'Email is required';
  } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
    errors.email = 'Enter a valid email address';
  }

  if (!form.password) {
    errors.password = 'Password is required';
  } else if (form.password.length < PASSWORD_MIN_LENGTH) {
    errors.password = `Password must be at least ${PASSWORD_MIN_LENGTH} characters`;
  }

  if (!form.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password';
  } else if (form.confirmPassword !== form.password) {
    errors.confirmPassword = 'Passwords do not match';
  }

  return errors;
}

function passwordStrength(password: string): { label: string; score: number } {
  let score = 0;
  if (password.length >= PASSWORD_MIN_LENGTH) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const labels = ['Too short', 'Weak', 'Fair', 'Good', 'Strong'];
  return { label: password ? labels[score] : '', score };
}

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    company: '',
  });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function handleChange(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field as keyof FieldErrors]) {
      setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    if (formError) setFormError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const errors = validate(form);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setSubmitting(true);
    setFormError(null);

    try {
      await register({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        ...(form.company.trim() ? { company: form.company.trim() } : {}),
      });
      router.replace('/login');
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 409) {
          setFormError('An account with this email already exists.');
        } else if (err.status === 400) {
          setFormError(err.message || 'Please check your details and try again.');
        } else if (err.status === 429) {
          setFormError('Too many attempts. Please wait a moment and try again.');
        } else {
          setFormError(err.message || 'Something went wrong. Please try again.');
        }
      } else {
        setFormError('Unable to reach the server. Check your connection and try again.');
      }
    } finally {
      setSubmitting(false);
    }
  }

  const strength = passwordStrength(form.password);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-sm">
        {/* Logo / brand */}
        <div className="flex flex-col items-center gap-2 mb-8">
          <AppLogo size={36} />
          <span className="font-bold text-lg text-foreground tracking-tight">CourierDesk</span>
        </div>

        <div className="bg-card border border-border rounded-xl shadow-card p-6">
          <div className="mb-6">
            <h1 className="text-lg font-700 text-foreground">Create your account</h1>
            <p className="text-xs text-muted-foreground mt-1">
              Set up access to your operations dashboard.
            </p>
          </div>

          {formError && (
            <div
              role="alert"
              className="mb-4 flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-xs text-destructive"
            >
              <AlertCircle size={14} className="shrink-0 mt-0.5" />
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="name" className="text-xs font-600 text-foreground">
                Full name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder="Marcus Adeyemi"
                value={form.name}
                onChange={(e) => handleChange('name', e.target.value)}
                aria-invalid={!!fieldErrors.name}
                aria-describedby={fieldErrors.name ? 'name-error' : undefined}
                className={`w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-colors duration-150 ${
                  fieldErrors.name ? 'border-destructive' : 'border-border'
                }`}
              />
              {fieldErrors.name && (
                <p id="name-error" className="text-[11px] text-destructive">
                  {fieldErrors.name}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-xs font-600 text-foreground">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@company.com"
                value={form.email}
                onChange={(e) => handleChange('email', e.target.value)}
                aria-invalid={!!fieldErrors.email}
                aria-describedby={fieldErrors.email ? 'email-error' : undefined}
                className={`w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-colors duration-150 ${
                  fieldErrors.email ? 'border-destructive' : 'border-border'
                }`}
              />
              {fieldErrors.email && (
                <p id="email-error" className="text-[11px] text-destructive">
                  {fieldErrors.email}
                </p>
              )}
            </div>

            {/* Company (optional) */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="company" className="text-xs font-600 text-foreground">
                Company <span className="text-muted-foreground font-400">(optional)</span>
              </label>
              <input
                id="company"
                name="company"
                type="text"
                autoComplete="organization"
                placeholder="Meridian Logistics Co."
                value={form.company}
                onChange={(e) => handleChange('company', e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-colors duration-150"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-xs font-600 text-foreground">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  aria-invalid={!!fieldErrors.password}
                  aria-describedby={fieldErrors.password ? 'password-error' : 'password-hint'}
                  className={`w-full rounded-lg border bg-background px-3 py-2 pr-9 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-colors duration-150 ${
                    fieldErrors.password ? 'border-destructive' : 'border-border'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>

              {/* Strength meter */}
              {form.password && !fieldErrors.password && (
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className="flex-1 flex gap-1">
                    {[0, 1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-colors duration-150 ${
                          i < strength.score
                            ? strength.score <= 1
                              ? 'bg-destructive'
                              : strength.score === 2
                              ? 'bg-warning'
                              : 'bg-success'
                            : 'bg-muted'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] text-muted-foreground w-12 text-right">
                    {strength.label}
                  </span>
                </div>
              )}

              {fieldErrors.password ? (
                <p id="password-error" className="text-[11px] text-destructive">
                  {fieldErrors.password}
                </p>
              ) : (
                <p id="password-hint" className="text-[11px] text-muted-foreground">
                  At least {PASSWORD_MIN_LENGTH} characters.
                </p>
              )}
            </div>

            {/* Confirm password */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="confirmPassword" className="text-xs font-600 text-foreground">
                Confirm password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="••••••••"
                  value={form.confirmPassword}
                  onChange={(e) => handleChange('confirmPassword', e.target.value)}
                  aria-invalid={!!fieldErrors.confirmPassword}
                  aria-describedby={fieldErrors.confirmPassword ? 'confirm-error' : undefined}
                  className={`w-full rounded-lg border bg-background px-3 py-2 pr-9 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-colors duration-150 ${
                    fieldErrors.confirmPassword ? 'border-destructive' : 'border-border'
                  }`}
                />
                {form.confirmPassword && !fieldErrors.confirmPassword && form.confirmPassword === form.password ? (
                  <Check size={15} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-success" />
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                )}
              </div>
              {fieldErrors.confirmPassword && (
                <p id="confirm-error" className="text-[11px] text-destructive">
                  {fieldErrors.confirmPassword}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="mt-1 flex items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2.5 text-sm font-600 text-black hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-150"
            >
              {submitting && <Loader2 size={14} className="animate-spin" />}
              {submitting ? 'Creating account…' : 'Create account'}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Already have an account?{' '}
          <Link href="/login" className="text-primary font-600 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}