'use client';

import React, { useState } from 'react';
import { X, Package, MapPin, FileText, Loader2, AlertCircle } from 'lucide-react';
import { createShipment, ApiError } from '@/lib/api';
import type { ApiShipment } from '@/lib/types';

interface NewShipmentModalProps {
  open: boolean;
  onClose: () => void;
  onCreated?: (shipment: ApiShipment) => void;
}

const RATE_CARDS = [
  'TEKG - Base and Kilo',
  'TE250 - 250 Gram Parcel',
  'TE0 - 500 Gram Parcel',
  'TE1 - 1Kg Parcel',
  'TE3 - 3Kg Parcel',
  'TE5 - 5Kg Parcel',
  'L11 - A Card Rate Block & BK',
  'TSKG - Base and Kilo',
  'TS250 - 250 Gram Parcel',
  'TS0 - 500g Parcel',
  'TS1 - 1Kg Parcel',
  'TS3 - 3Kg Parcel',
  'TS5 - 5Kg Parcel',
];
const STATES = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT'];

interface FormState {
  hblReference: string;
  rateCard: string;
  length: string;
  width: string;
  height: string;
  weight: string;
  quantity: string;

  pickupFirstName: string;
  pickupLastName: string;
  pickupEmail: string;
  pickupPhone: string;
  pickupAddress1: string;
  pickupAddress2: string;
  pickupSuburb: string;
  pickupState: string;
  pickupPostcode: string;

  destFirstName: string;
  destLastName: string;
  destCompany: string;
  destEmail: string;
  destPhone: string;
  destAddress1: string;
  destAddress2: string;
  destSuburb: string;
  destState: string;
  destPostcode: string;

  specialInstructions: string;
  acceptedTerms: boolean;
}

const EMPTY_FORM: FormState = {
  hblReference: '',
  rateCard: RATE_CARDS[0],
  length: '',
  width: '',
  height: '',
  weight: '',
  quantity: '1',

  pickupFirstName: '',
  pickupLastName: '',
  pickupEmail: '',
  pickupPhone: '',
  pickupAddress1: '',
  pickupAddress2: '',
  pickupSuburb: '',
  pickupState: STATES[0],
  pickupPostcode: '',

  destFirstName: '',
  destLastName: '',
  destCompany: '',
  destEmail: '',
  destPhone: '',
  destAddress1: '',
  destAddress2: '',
  destSuburb: '',
  destState: STATES[0],
  destPostcode: '',

  specialInstructions: '',
  acceptedTerms: false,
};

function formatAddress(f: {
  address1: string; address2: string; suburb: string; state: string; postcode: string;
}) {
  return [f.address1, f.address2, f.suburb, f.state, f.postcode].filter(Boolean).join(', ');
}

export default function NewShipmentModal({ open, onClose, onCreated }: NewShipmentModalProps) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function resetAndClose() {
    setForm(EMPTY_FORM);
    setError(null);
    onClose();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!form.destFirstName || !form.destLastName) {
      setError('Recipient first and last name are required.');
      return;
    }
    if (!formatAddress({ address1: form.pickupAddress1, address2: form.pickupAddress2, suburb: form.pickupSuburb, state: form.pickupState, postcode: form.pickupPostcode })) {
      setError('Pickup address is required.');
      return;
    }
    if (!formatAddress({ address1: form.destAddress1, address2: form.destAddress2, suburb: form.destSuburb, state: form.destState, postcode: form.destPostcode })) {
      setError('Destination address is required.');
      return;
    }
    if (!form.weight || Number(form.weight) <= 0) {
      setError('Enter a valid package weight.');
      return;
    }
    if (!form.acceptedTerms) {
      setError('You must accept the terms and conditions.');
      return;
    }

    setSubmitting(true);
    try {
      const { data } = await createShipment({
        recipient: `${form.destFirstName} ${form.destLastName}`.trim(),
        origin: formatAddress({
          address1: form.pickupAddress1, address2: form.pickupAddress2,
          suburb: form.pickupSuburb, state: form.pickupState, postcode: form.pickupPostcode,
        }),
        destination: formatAddress({
          address1: form.destAddress1, address2: form.destAddress2,
          suburb: form.destSuburb, state: form.destState, postcode: form.destPostcode,
        }),
        weightKg: Number(form.weight),
        phone: form.destPhone || undefined,
        notes: [
          form.hblReference && `Ref: ${form.hblReference}`,
          form.rateCard && `Rate card: ${form.rateCard}`,
          form.specialInstructions,
        ].filter(Boolean).join(' — ') || undefined,
      });
      onCreated?.(data);
      resetAndClose();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to create shipment.');
    } finally {
      setSubmitting(false);
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 px-4 py-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby="new-shipment-title"
      onClick={resetAndClose}
    >
      <div
        className="w-full max-w-2xl rounded-xl border border-border bg-card shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border sticky top-0 bg-card rounded-t-xl">
          <div>
            <h2 id="new-shipment-title" className="text-base font-700 text-foreground">New Shipment</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Create a booking for pickup and delivery</p>
          </div>
          <button
            onClick={resetAndClose}
            aria-label="Close"
            className="text-muted-foreground hover:text-foreground rounded-lg p-1 hover:bg-muted transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-5 space-y-6 max-h-[70vh] overflow-y-auto">
            {error && (
              <div role="alert" className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
                <AlertCircle size={14} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Package Details */}
            <section className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-700 text-foreground">
                <Package size={15} className="text-primary" />
                Package Details
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">HBL / Reference #</label>
                  <input
                    className="form-input"
                    value={form.hblReference}
                    onChange={(e) => update('hblReference', e.target.value)}
                    placeholder="e.g. REF-10234"
                  />
                </div>
                <div>
                  <label className="form-label">Rate Card</label>
                  <select
                    className="form-input"
                    value={form.rateCard}
                    onChange={(e) => update('rateCard', e.target.value)}
                  >
                    {RATE_CARDS.map((r) => <option key={r}>{r}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                <div>
                  <label className="form-label">Length (cm)</label>
                  <input
                    type="number" min="0" step="0.1"
                    className="form-input"
                    value={form.length}
                    onChange={(e) => update('length', e.target.value)}
                  />
                </div>
                <div>
                  <label className="form-label">Width (cm)</label>
                  <input
                    type="number" min="0" step="0.1"
                    className="form-input"
                    value={form.width}
                    onChange={(e) => update('width', e.target.value)}
                  />
                </div>
                <div>
                  <label className="form-label">Height (cm)</label>
                  <input
                    type="number" min="0" step="0.1"
                    className="form-input"
                    value={form.height}
                    onChange={(e) => update('height', e.target.value)}
                  />
                </div>
                <div>
                  <label className="form-label">Weight (kg)</label>
                  <input
                    type="number" min="0" step="0.1" required
                    className="form-input"
                    value={form.weight}
                    onChange={(e) => update('weight', e.target.value)}
                  />
                </div>
                <div>
                  <label className="form-label">Quantity</label>
                  <input
                    type="number" min="1" step="1"
                    className="form-input"
                    value={form.quantity}
                    onChange={(e) => update('quantity', e.target.value)}
                  />
                </div>
              </div>
            </section>

            {/* Pickup / Sender Details */}
            <section className="space-y-3 pt-4 border-t border-border">
              <div className="flex items-center gap-2 text-sm font-700 text-foreground">
                <MapPin size={15} className="text-primary" />
                Pickup Details
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">First Name</label>
                  <input className="form-input" value={form.pickupFirstName} onChange={(e) => update('pickupFirstName', e.target.value)} />
                </div>
                <div>
                  <label className="form-label">Last Name</label>
                  <input className="form-input" value={form.pickupLastName} onChange={(e) => update('pickupLastName', e.target.value)} />
                </div>
                <div>
                  <label className="form-label">Email</label>
                  <input type="email" className="form-input" value={form.pickupEmail} onChange={(e) => update('pickupEmail', e.target.value)} />
                </div>
                <div>
                  <label className="form-label">Phone</label>
                  <input type="tel" className="form-input" value={form.pickupPhone} onChange={(e) => update('pickupPhone', e.target.value)} />
                </div>
              </div>
              <div>
                <label className="form-label">Address Line 1</label>
                <input required className="form-input" value={form.pickupAddress1} onChange={(e) => update('pickupAddress1', e.target.value)} />
              </div>
              <div>
                <label className="form-label">Address Line 2 (Optional)</label>
                <input className="form-input" value={form.pickupAddress2} onChange={(e) => update('pickupAddress2', e.target.value)} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="form-label">Suburb</label>
                  <input className="form-input" value={form.pickupSuburb} onChange={(e) => update('pickupSuburb', e.target.value)} />
                </div>
                <div>
                  <label className="form-label">State</label>
                  <select className="form-input" value={form.pickupState} onChange={(e) => update('pickupState', e.target.value)}>
                    {STATES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">Postcode</label>
                  <input className="form-input" value={form.pickupPostcode} onChange={(e) => update('pickupPostcode', e.target.value)} />
                </div>
              </div>
            </section>

            {/* Destination Details */}
            <section className="space-y-3 pt-4 border-t border-border">
              <div className="flex items-center gap-2 text-sm font-700 text-foreground">
                <MapPin size={15} className="text-accent" />
                Destination Details
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">First Name</label>
                  <input required className="form-input" value={form.destFirstName} onChange={(e) => update('destFirstName', e.target.value)} />
                </div>
                <div>
                  <label className="form-label">Last Name</label>
                  <input required className="form-input" value={form.destLastName} onChange={(e) => update('destLastName', e.target.value)} />
                </div>
                <div>
                  <label className="form-label">Company Name</label>
                  <input className="form-input" value={form.destCompany} onChange={(e) => update('destCompany', e.target.value)} />
                </div>
                <div>
                  <label className="form-label">Email</label>
                  <input type="email" className="form-input" value={form.destEmail} onChange={(e) => update('destEmail', e.target.value)} />
                </div>
                <div>
                  <label className="form-label">Phone</label>
                  <input type="tel" className="form-input" value={form.destPhone} onChange={(e) => update('destPhone', e.target.value)} />
                </div>
              </div>
              <div>
                <label className="form-label">Address Line 1</label>
                <input required className="form-input" value={form.destAddress1} onChange={(e) => update('destAddress1', e.target.value)} />
              </div>
              <div>
                <label className="form-label">Address Line 2 (Optional)</label>
                <input className="form-input" value={form.destAddress2} onChange={(e) => update('destAddress2', e.target.value)} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="form-label">Suburb / City</label>
                  <input className="form-input" value={form.destSuburb} onChange={(e) => update('destSuburb', e.target.value)} />
                </div>
                <div>
                  <label className="form-label">State</label>
                  <select className="form-input" value={form.destState} onChange={(e) => update('destState', e.target.value)}>
                    {STATES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">Postcode</label>
                  <input className="form-input" value={form.destPostcode} onChange={(e) => update('destPostcode', e.target.value)} />
                </div>
              </div>
            </section>

            {/* Special Instructions */}
            <section className="space-y-3 pt-4 border-t border-border">
              <div className="flex items-center gap-2 text-sm font-700 text-foreground">
                <FileText size={15} className="text-muted-foreground" />
                Special Instructions
              </div>
              <textarea
                className="form-input min-h-[80px] resize-y"
                value={form.specialInstructions}
                onChange={(e) => update('specialInstructions', e.target.value)}
                placeholder="e.g. Leave at front desk, fragile, call on arrival…"
              />
            </section>

            <label className="flex items-center gap-2 text-xs text-foreground pt-2">
              <input
                type="checkbox"
                checked={form.acceptedTerms}
                onChange={(e) => update('acceptedTerms', e.target.checked)}
                className="h-4 w-4 rounded border-border accent-[var(--primary)]"
              />
              I accept the terms and conditions
            </label>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-2 px-6 py-4 border-t border-border">
            <button type="button" onClick={resetAndClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="btn-primary">
              {submitting && <Loader2 size={14} className="animate-spin" />}
              {submitting ? 'Submitting…' : 'Submit Shipment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}