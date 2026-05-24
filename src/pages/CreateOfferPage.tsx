import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import { ArrowLeft, Plus, Trash2, Save, Rocket } from 'lucide-react';
import { OfferForm, OfferStatus } from '../types';

interface SlotEntry {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  capacity: number;
}

const CATEGORIES = ['Fitness', 'Beauty', 'Food', 'Health', 'Sports', 'Education', 'Wellness', 'Entertainment'];
const STATUS_OPTIONS: OfferStatus[] = ['Draft', 'Active', 'Paused'];

const CreateOfferPage: React.FC = () => {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState<OfferForm>({
    title: '',
    description: '',
    category: 'Fitness',
    originalPrice: 0,
    offerPrice: 0,
    startDate: '2025-05-25',
    endDate: '2025-05-31',
    startTime: '15:00',
    endTime: '17:00',
    totalCapacity: 20,
    maxBookingPerCustomer: 1,
    termsAndConditions: '',
    status: 'Draft',
  });

  const [slots, setSlots] = useState<SlotEntry[]>([]);
  const [newSlot, setNewSlot] = useState<Omit<SlotEntry, 'id'>>({
    date: '2025-05-25', startTime: '15:00', endTime: '17:00', capacity: 20,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof OfferForm, string>>>({});

  const discountPct =
    form.originalPrice > 0 && form.offerPrice > 0
      ? Math.round(((form.originalPrice - form.offerPrice) / form.originalPrice) * 100)
      : 0;

  const set = (key: keyof OfferForm, value: string | number) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const validate = (): boolean => {
    const e: Partial<Record<keyof OfferForm, string>> = {};
    if (!form.title.trim()) e.title = 'Title is required';
    if (form.originalPrice <= 0) e.originalPrice = 'Must be greater than 0';
    if (form.offerPrice <= 0) e.offerPrice = 'Must be greater than 0';
    if (form.offerPrice >= form.originalPrice) e.offerPrice = 'Must be less than original price';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const addSlot = () => {
    setSlots(prev => [...prev, { ...newSlot, id: `slot-${Date.now()}` }]);
  };

  const removeSlot = (id: string) => setSlots(prev => prev.filter(s => s.id !== id));

  const handleSave = async (publish = false) => {
    if (!validate()) return;
    setSaving(true);
    await new Promise(r => setTimeout(r, 1000)); // simulate API call
    setSaving(false);
    navigate('/admin/offers');
  };

  return (
    <AdminLayout
      title="Create Offer"
      actions={
        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/admin/offers')}>
          <ArrowLeft size={14} /> Back
        </button>
      }
    >
      <div style={{ maxWidth: 700 }}>
        {/* Offer Details */}
        <div className="card" style={{ marginBottom: 16 }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 600, marginBottom: 20, paddingBottom: 14, borderBottom: '1px solid var(--border)' }}>
            Offer Details
          </h3>

          <div className="form-group">
            <label className="form-label">Offer Title *</label>
            <input className="form-control" placeholder="e.g. Afternoon Gym Trial"
              value={form.title} onChange={e => set('title', e.target.value)} />
            {errors.title && <div className="form-error">{errors.title}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-control" rows={3}
              placeholder="Describe what's included..."
              value={form.description} onChange={e => set('description', e.target.value)} />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Category</label>
              <select className="form-control" value={form.category} onChange={e => set('category', e.target.value)}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Status</label>
              <select className="form-control" value={form.status} onChange={e => set('status', e.target.value as OfferStatus)}>
                {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {/* Pricing */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
            <div className="form-group">
              <label className="form-label">Original Price (₹) *</label>
              <input className="form-control" type="number" min={0}
                value={form.originalPrice || ''} onChange={e => set('originalPrice', Number(e.target.value))} />
              {errors.originalPrice && <div className="form-error">{errors.originalPrice}</div>}
            </div>
            <div className="form-group">
              <label className="form-label">Offer Price (₹) *</label>
              <input className="form-control" type="number" min={0}
                value={form.offerPrice || ''} onChange={e => set('offerPrice', Number(e.target.value))} />
              {errors.offerPrice && <div className="form-error">{errors.offerPrice}</div>}
            </div>
            <div className="form-group">
              <label className="form-label">Discount %</label>
              <input className="form-control" readOnly value={discountPct ? `${discountPct}%` : '—'}
                style={{ background: 'var(--bg)', fontWeight: 600, color: discountPct > 0 ? 'var(--success)' : 'var(--muted)' }} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Start Date *</label>
              <input className="form-control" type="date" value={form.startDate} onChange={e => set('startDate', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">End Date *</label>
              <input className="form-control" type="date" value={form.endDate} onChange={e => set('endDate', e.target.value)} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Total Capacity *</label>
              <input className="form-control" type="number" min={1}
                value={form.totalCapacity} onChange={e => set('totalCapacity', Number(e.target.value))} />
            </div>
            <div className="form-group">
              <label className="form-label">Max Booking / Customer</label>
              <input className="form-control" type="number" min={1}
                value={form.maxBookingPerCustomer} onChange={e => set('maxBookingPerCustomer', Number(e.target.value))} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Terms & Conditions</label>
            <textarea className="form-control" rows={2}
              placeholder="e.g. Valid for new members only. Non-refundable."
              value={form.termsAndConditions} onChange={e => set('termsAndConditions', e.target.value)} />
          </div>
        </div>

        {/* Slots section */}
        <div className="card" style={{ marginBottom: 16 }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 600, marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid var(--border)' }}>
            Add Time Slots
          </h3>

          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end', flexWrap: 'wrap', marginBottom: 14 }}>
            {[
              { label: 'Slot Date', type: 'date', key: 'date', val: newSlot.date },
              { label: 'Start Time', type: 'time', key: 'startTime', val: newSlot.startTime },
              { label: 'End Time', type: 'time', key: 'endTime', val: newSlot.endTime },
              { label: 'Capacity', type: 'number', key: 'capacity', val: String(newSlot.capacity) },
            ].map(f => (
              <div key={f.key} style={{ flex: 1, minWidth: 100 }}>
                <label className="form-label">{f.label}</label>
                <input className="form-control" type={f.type}
                  value={f.val}
                  onChange={e => setNewSlot(prev => ({ ...prev, [f.key]: f.type === 'number' ? Number(e.target.value) : e.target.value }))} />
              </div>
            ))}
            <button className="btn btn-primary btn-sm" onClick={addSlot} style={{ marginBottom: 1 }}>
              <Plus size={14} /> Add
            </button>
          </div>

          {slots.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px', background: 'var(--bg)', borderRadius: 8, fontSize: 13, color: 'var(--faint)' }}>
              No slots added yet. Add at least one time slot above.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {slots.map(s => (
                <div key={s.id} style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px',
                  background: 'var(--bg)', borderRadius: 8, fontSize: 13,
                }}>
                  <span style={{ fontSize: 16 }}>📅</span>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontWeight: 500 }}>{s.date}</span>
                    <span style={{ color: 'var(--muted)', margin: '0 8px' }}>·</span>
                    <span>{s.startTime} – {s.endTime}</span>
                    <span style={{ color: 'var(--muted)', margin: '0 8px' }}>·</span>
                    <span>Capacity: {s.capacity}</span>
                  </div>
                  <button onClick={() => removeSlot(s.id)} className="btn btn-ghost btn-sm" style={{ color: 'var(--danger)', padding: '4px 8px' }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button className="btn btn-outline" onClick={() => navigate('/admin/offers')}>Cancel</button>
          <button className="btn btn-outline" onClick={() => handleSave(false)} disabled={saving}>
            <Save size={14} /> Save as Draft
          </button>
          <button className="btn btn-dark" onClick={() => handleSave(true)} disabled={saving}>
            {saving ? (
              <><div style={{ width: 14, height: 14, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', animation: 'spin 0.7s linear infinite' }} /> Publishing...</>
            ) : (
              <><Rocket size={14} /> Publish Offer</>
            )}
          </button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default CreateOfferPage;
