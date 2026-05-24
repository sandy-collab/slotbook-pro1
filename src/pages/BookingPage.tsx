import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { mockOffers, mockSlots } from '../data/mockData';
import { BookingForm } from '../types';
import { ArrowLeft, Check, Calendar, Clock, Users, ChevronRight } from 'lucide-react';

const STEPS = ['Select Slot', 'Your Details', 'Confirm'];

const generateRef = () => `SLT-2025-${String(Math.floor(1000 + Math.random() * 9000))}`;

const BookingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const offer = mockOffers.find(o => o.id === id) ?? mockOffers[0];
  const slots = mockSlots.filter(s => s.offerId === offer.id);

  const [step, setStep] = useState(1);
  const [form, setForm] = useState<BookingForm>({
    customerName: '', customerPhone: '', customerEmail: '',
    selectedSlotId: '', peopleCount: 1, specialNote: '',
  });
  const [errors, setErrors] = useState<Partial<BookingForm & { slot: string }>>({});
  const [loading, setLoading] = useState(false);
  const [bookingRef] = useState(generateRef);

  const set = (key: keyof BookingForm, val: string | number) =>
    setForm(prev => ({ ...prev, [key]: val }));

  const selectedSlot = slots.find(s => s.id === form.selectedSlotId);

  const validateStep1 = () => {
    const e: typeof errors = {};
    if (!form.selectedSlotId) e.slot = 'Please select a time slot';
    if (form.peopleCount < 1) e.peopleCount = 'At least 1 person required';
    if (selectedSlot && form.peopleCount > selectedSlot.availableCount)
      e.peopleCount = `Only ${selectedSlot.availableCount} seats available`;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = () => {
    const e: typeof errors = {};
    if (!form.customerName.trim()) e.customerName = 'Name is required';
    if (!/^\d{10}$/.test(form.customerPhone)) e.customerPhone = 'Enter valid 10-digit phone number';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = async () => {
    if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2 && validateStep2()) setStep(3);
    else if (step === 3) {
      setLoading(true);
      await new Promise(r => setTimeout(r, 1200));
      navigate(`/booking/confirmation?ref=${bookingRef}&offer=${encodeURIComponent(offer.title)}&biz=${encodeURIComponent(offer.businessName)}&date=${selectedSlot?.slotDate ?? ''}&time=${selectedSlot?.startTime ?? ''}-${selectedSlot?.endTime ?? ''}&name=${encodeURIComponent(form.customerName)}&people=${form.peopleCount}`);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Header */}
      <header style={{
        background: 'var(--surface)', borderBottom: '1px solid var(--border)',
        padding: '0 20px', height: 56, display: 'flex', alignItems: 'center', gap: 12,
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        <button className="btn btn-ghost btn-sm" onClick={() => step > 1 ? setStep(s => s - 1) : navigate(`/offers/${offer.id}`)}>
          <ArrowLeft size={15} /> Back
        </button>
        <div style={{ flex: 1, textAlign: 'center', fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 600 }}>
          Book: {offer.title}
        </div>
      </header>

      <div style={{ maxWidth: 560, margin: '0 auto', padding: '28px 20px' }}>
        {/* Step indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 28 }}>
          {STEPS.map((s, i) => (
            <React.Fragment key={s}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{
                  width: 30, height: 30, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, fontWeight: 700, transition: 'all 0.2s',
                  background: i + 1 < step ? 'var(--success)' : i + 1 === step ? 'var(--accent)' : 'var(--border)',
                  color: i + 1 <= step ? '#fff' : 'var(--muted)',
                }}>
                  {i + 1 < step ? <Check size={14} /> : i + 1}
                </div>
                <div style={{ fontSize: 11, fontWeight: i + 1 === step ? 600 : 400, color: i + 1 === step ? 'var(--text)' : 'var(--muted)', whiteSpace: 'nowrap' }}>
                  {s}
                </div>
              </div>
              {i < STEPS.length - 1 && (
                <div style={{ flex: 1, height: 1, background: i + 1 < step ? 'var(--success)' : 'var(--border)', margin: '0 6px', marginBottom: 18 }} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Offer summary chip */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 12, marginBottom: 16,
        }}>
          <span style={{ fontSize: 24 }}>{offer.emoji}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: 14 }}>{offer.title}</div>
            <div style={{ fontSize: 12, color: 'var(--muted)' }}>{offer.businessName}</div>
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: 'var(--accent)' }}>₹{offer.offerPrice}</div>
        </div>

        {/* Step 1: Slot selection */}
        {step === 1 && (
          <div className="card animate-fade">
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 600, marginBottom: 16 }}>
              Select a Time Slot
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 18 }}>
              {slots.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 30, color: 'var(--muted)', fontSize: 13 }}>
                  No slots available for this offer
                </div>
              ) : slots.map(s => {
                const isFull = s.status === 'Full' || s.availableCount === 0;
                const isSelected = form.selectedSlotId === s.id;
                return (
                  <div key={s.id}
                    onClick={() => !isFull && set('selectedSlotId', s.id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 14,
                      padding: '12px 14px', borderRadius: 10, cursor: isFull ? 'not-allowed' : 'pointer',
                      border: `2px solid ${isSelected ? 'var(--accent)' : 'var(--border)'}`,
                      background: isSelected ? 'var(--accent-glow)' : isFull ? 'var(--bg)' : 'var(--surface)',
                      opacity: isFull ? 0.55 : 1, transition: 'all 0.15s',
                    }}>
                    <div style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${isSelected ? 'var(--accent)' : 'var(--border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {isSelected && <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--accent)' }} />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 500, fontSize: 13 }}>
                        <Calendar size={12} style={{ verticalAlign: 'middle', marginRight: 5 }} />{s.slotDate}
                        <span style={{ color: 'var(--muted)', margin: '0 8px' }}>·</span>
                        <Clock size={12} style={{ verticalAlign: 'middle', marginRight: 5 }} />{s.startTime} – {s.endTime}
                      </div>
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: isFull ? 'var(--danger)' : 'var(--success)', whiteSpace: 'nowrap' }}>
                      {isFull ? 'Full' : `${s.availableCount} left`}
                    </div>
                  </div>
                );
              })}
            </div>
            {errors.slot && <div className="form-error" style={{ marginBottom: 12 }}>{errors.slot}</div>}

            <div className="form-group">
              <label className="form-label">Number of People *</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <button className="btn btn-outline" style={{ width: 34, height: 34, padding: 0, justifyContent: 'center' }}
                  onClick={() => set('peopleCount', Math.max(1, form.peopleCount - 1))}>−</button>
                <input className="form-control" type="number" min={1} max={offer.maxBookingPerCustomer}
                  value={form.peopleCount} onChange={e => set('peopleCount', Number(e.target.value))}
                  style={{ textAlign: 'center', width: 80 }} />
                <button className="btn btn-outline" style={{ width: 34, height: 34, padding: 0, justifyContent: 'center' }}
                  onClick={() => set('peopleCount', Math.min(offer.maxBookingPerCustomer, form.peopleCount + 1))}>+</button>
                <span style={{ fontSize: 12, color: 'var(--muted)' }}>max {offer.maxBookingPerCustomer} per booking</span>
              </div>
              {errors.peopleCount && <div className="form-error">{errors.peopleCount}</div>}
            </div>

            <button className="btn btn-primary btn-full" onClick={handleNext}>
              Continue <ChevronRight size={15} />
            </button>
          </div>
        )}

        {/* Step 2: Customer details */}
        {step === 2 && (
          <div className="card animate-fade">
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 600, marginBottom: 16 }}>
              Your Details
            </h3>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input className="form-control" placeholder="Rahul Sharma"
                  value={form.customerName} onChange={e => set('customerName', e.target.value)} />
                {errors.customerName && <div className="form-error">{errors.customerName}</div>}
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number *</label>
                <input className="form-control" placeholder="10-digit mobile number"
                  value={form.customerPhone} onChange={e => set('customerPhone', e.target.value)} maxLength={10} />
                {errors.customerPhone && <div className="form-error">{errors.customerPhone}</div>}
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Email (optional)</label>
              <input className="form-control" type="email" placeholder="you@example.com"
                value={form.customerEmail} onChange={e => set('customerEmail', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Special Note (optional)</label>
              <textarea className="form-control" rows={2}
                placeholder="Any special request or information..."
                value={form.specialNote} onChange={e => set('specialNote', e.target.value)} />
            </div>

            {/* Summary */}
            <div style={{ background: 'var(--bg)', borderRadius: 10, padding: 14, marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>Booking Summary</div>
              {[
                ['Slot', selectedSlot ? `${selectedSlot.slotDate}, ${selectedSlot.startTime}–${selectedSlot.endTime}` : '—'],
                ['People', String(form.peopleCount)],
                ['Price', `₹${offer.offerPrice} × ${form.peopleCount} = ₹${offer.offerPrice * form.peopleCount}`],
                ['Max Booking Limit', `${offer.maxBookingPerCustomer} per customer ✓`],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: 13, borderBottom: '1px solid var(--border)' }}>
                  <span style={{ color: 'var(--muted)' }}>{k}</span>
                  <span style={{ fontWeight: 500 }}>{v}</span>
                </div>
              ))}
            </div>

            <button className="btn btn-primary btn-full" onClick={handleNext}>
              Review & Confirm <ChevronRight size={15} />
            </button>
          </div>
        )}

        {/* Step 3: Confirm */}
        {step === 3 && (
          <div className="card animate-fade">
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 600, marginBottom: 4 }}>
              Review & Confirm
            </h3>
            <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 18 }}>
              Please review your booking details before confirming.
            </p>
            {[
              { icon: <span style={{ fontSize: 16 }}>{offer.emoji}</span>, label: 'Offer', val: offer.title },
              { icon: <Calendar size={15} />, label: 'Date', val: selectedSlot?.slotDate ?? '—' },
              { icon: <Clock size={15} />, label: 'Time', val: `${selectedSlot?.startTime} – ${selectedSlot?.endTime}` },
              { icon: <Users size={15} />, label: 'Name', val: form.customerName },
              { icon: <Users size={15} />, label: 'Phone', val: form.customerPhone },
              { icon: <Users size={15} />, label: 'People', val: String(form.peopleCount) },
            ].map(row => (
              <div key={row.label} style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0',
                borderBottom: '1px solid var(--border)', fontSize: 13,
              }}>
                <span style={{ color: 'var(--accent)', flexShrink: 0 }}>{row.icon}</span>
                <span style={{ color: 'var(--muted)', width: 80, flexShrink: 0 }}>{row.label}</span>
                <span style={{ fontWeight: 500 }}>{row.val}</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', fontSize: 15, fontWeight: 700 }}>
              <span>Total</span>
              <span style={{ color: 'var(--accent)', fontFamily: 'var(--font-display)' }}>
                ₹{offer.offerPrice * form.peopleCount}
              </span>
            </div>
            <button className="btn btn-primary btn-full btn-lg" onClick={handleNext} disabled={loading} style={{ marginTop: 8 }}>
              {loading ? (
                <><div style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', animation: 'spin 0.7s linear infinite' }} /> Confirming...</>
              ) : (
                <><Check size={16} /> Confirm Booking</>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingPage;
