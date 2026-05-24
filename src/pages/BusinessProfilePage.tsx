import React, { useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import { mockBusiness } from '../data/mockData';
import { Business, BusinessType } from '../types';
import { Edit2, Save, X, Building2, Phone, Mail, MapPin, Clock, User } from 'lucide-react';

const BIZ_TYPES: BusinessType[] = ['Restaurant', 'Gym', 'Salon', 'Clinic', 'Coaching', 'Turf', 'Other'];

const BusinessProfilePage: React.FC = () => {
  const [biz, setBiz] = useState<Business>(mockBusiness);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<Business>(mockBusiness);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const set = (key: keyof Business, value: string) => setDraft(prev => ({ ...prev, [key]: value }));

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 800));
    setBiz(draft);
    setSaving(false);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleCancel = () => { setDraft(biz); setEditing(false); };

  const BIZ_EMOJI: Record<BusinessType, string> = {
    Gym: '🏋️', Restaurant: '🍽️', Salon: '✂️', Clinic: '🩺',
    Coaching: '📚', Turf: '⚽', Other: '🏢',
  };

  const infoRows = [
    { icon: <User size={15} />, label: 'Owner Name', val: biz.ownerName },
    { icon: <Phone size={15} />, label: 'Phone', val: biz.phone },
    { icon: <Mail size={15} />, label: 'Email', val: biz.email },
    { icon: <MapPin size={15} />, label: 'Address', val: `${biz.address}, ${biz.city}` },
    { icon: <Clock size={15} />, label: 'Business Hours', val: `${biz.openingTime} – ${biz.closingTime}` },
    { icon: <Building2 size={15} />, label: 'Business Type', val: biz.businessType },
  ];

  return (
    <AdminLayout
      title="Business Profile"
      actions={
        !editing ? (
          <button className="btn btn-outline btn-sm" onClick={() => { setDraft(biz); setEditing(true); }}>
            <Edit2 size={14} /> Edit Profile
          </button>
        ) : (
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-outline btn-sm" onClick={handleCancel}><X size={14} /> Cancel</button>
            <button className="btn btn-primary btn-sm" onClick={handleSave} disabled={saving}>
              {saving ? '...' : <><Save size={14} /> Save Changes</>}
            </button>
          </div>
        )
      }
    >
      {saved && (
        <div style={{
          background: 'var(--success-bg)', border: '1px solid rgba(34,197,94,0.3)',
          borderRadius: 10, padding: '12px 16px', marginBottom: 20,
          fontSize: 13, color: '#15803d', display: 'flex', alignItems: 'center', gap: 8,
        }}>
          ✅ Business profile updated successfully!
        </div>
      )}

      <div style={{ maxWidth: 680 }}>
        {/* Profile header */}
        <div className="card" style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, paddingBottom: 20, marginBottom: 20, borderBottom: '1px solid var(--border)' }}>
            <div style={{
              width: 72, height: 72, borderRadius: 16,
              background: 'var(--bg)', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: 36, border: '1px solid var(--border)',
            }}>
              {BIZ_EMOJI[biz.businessType] ?? '🏢'}
            </div>
            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700 }}>{biz.name}</h2>
              <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 2 }}>
                {biz.businessType} · {biz.city}
              </div>
              <div style={{ fontSize: 11, color: 'var(--faint)', marginTop: 4 }}>
                Member since {new Date(biz.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
              </div>
            </div>
          </div>

          {/* Info grid (view mode) */}
          {!editing ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
              {infoRows.map(row => (
                <div key={row.label} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div style={{ color: 'var(--muted)', marginTop: 1 }}>{row.icon}</div>
                  <div>
                    <div style={{ fontSize: 11, color: 'var(--faint)', marginBottom: 2 }}>{row.label}</div>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{row.val}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Edit form */
            <div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Business Name *</label>
                  <input className="form-control" value={draft.name} onChange={e => set('name', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Business Type</label>
                  <select className="form-control" value={draft.businessType}
                    onChange={e => set('businessType', e.target.value as BusinessType)}>
                    {BIZ_TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Owner Name *</label>
                  <input className="form-control" value={draft.ownerName} onChange={e => set('ownerName', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone *</label>
                  <input className="form-control" value={draft.phone} onChange={e => set('phone', e.target.value)} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input className="form-control" type="email" value={draft.email} onChange={e => set('email', e.target.value)} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Address</label>
                  <input className="form-control" value={draft.address} onChange={e => set('address', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">City</label>
                  <input className="form-control" value={draft.city} onChange={e => set('city', e.target.value)} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Opening Time</label>
                  <input className="form-control" type="time" value={draft.openingTime} onChange={e => set('openingTime', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Closing Time</label>
                  <input className="form-control" type="time" value={draft.closingTime} onChange={e => set('closingTime', e.target.value)} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Logo URL (optional)</label>
                <input className="form-control" placeholder="https://example.com/logo.png"
                  value={draft.logoUrl ?? ''} onChange={e => set('logoUrl', e.target.value)} />
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default BusinessProfilePage;
