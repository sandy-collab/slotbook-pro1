import React, { useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import { StatusBadge, SeatsBar, EmptyState } from '../components/UI';
import { mockSlots, mockOffers } from '../data/mockData';
import { OfferSlot, SlotStatus } from '../types';
import { Plus, Trash2, Edit2, Calendar } from 'lucide-react';

const ManageSlotsPage: React.FC = () => {
  const [slots, setSlots] = useState<OfferSlot[]>(mockSlots);
  const [offerFilter, setOfferFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSlot, setNewSlot] = useState({
    offerId: mockOffers[0].id,
    slotDate: '2025-05-26',
    startTime: '10:00',
    endTime: '12:00',
    capacity: 20,
  });

  const filtered = slots.filter(s => {
    const matchOffer = offerFilter === 'all' || s.offerId === offerFilter;
    const matchDate = !dateFilter || s.slotDate === dateFilter;
    return matchOffer && matchDate;
  });

  const handleAdd = () => {
    const offer = mockOffers.find(o => o.id === newSlot.offerId);
    if (!offer) return;
    const slot: OfferSlot = {
      id: `slot-${Date.now()}`,
      offerId: newSlot.offerId,
      offerTitle: offer.title,
      slotDate: newSlot.slotDate,
      startTime: newSlot.startTime,
      endTime: newSlot.endTime,
      capacity: newSlot.capacity,
      bookedCount: 0,
      availableCount: newSlot.capacity,
      status: 'Available',
      createdAt: new Date().toISOString(),
    };
    setSlots(prev => [slot, ...prev]);
    setShowAddForm(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this slot?')) setSlots(prev => prev.filter(s => s.id !== id));
  };

  const handleStatusChange = (id: string, status: SlotStatus) => {
    setSlots(prev => prev.map(s => s.id === id ? { ...s, status } : s));
  };

  return (
    <AdminLayout
      title="Manage Slots"
      actions={
        <button className="btn btn-primary btn-sm" onClick={() => setShowAddForm(!showAddForm)}>
          <Plus size={14} /> Add Slot
        </button>
      }
    >
      {/* Add slot form */}
      {showAddForm && (
        <div className="card" style={{ marginBottom: 20, borderColor: 'var(--accent)', borderWidth: 1.5 }}>
          <h4 style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 600, marginBottom: 14 }}>Add New Slot</h4>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div style={{ flex: '1 1 180px' }}>
              <label className="form-label">Offer</label>
              <select className="form-control" value={newSlot.offerId}
                onChange={e => setNewSlot(p => ({ ...p, offerId: e.target.value }))}>
                {mockOffers.map(o => <option key={o.id} value={o.id}>{o.title}</option>)}
              </select>
            </div>
            <div style={{ flex: '1 1 140px' }}>
              <label className="form-label">Date</label>
              <input className="form-control" type="date" value={newSlot.slotDate}
                onChange={e => setNewSlot(p => ({ ...p, slotDate: e.target.value }))} />
            </div>
            <div style={{ flex: '1 1 110px' }}>
              <label className="form-label">Start Time</label>
              <input className="form-control" type="time" value={newSlot.startTime}
                onChange={e => setNewSlot(p => ({ ...p, startTime: e.target.value }))} />
            </div>
            <div style={{ flex: '1 1 110px' }}>
              <label className="form-label">End Time</label>
              <input className="form-control" type="time" value={newSlot.endTime}
                onChange={e => setNewSlot(p => ({ ...p, endTime: e.target.value }))} />
            </div>
            <div style={{ flex: '0 0 100px' }}>
              <label className="form-label">Capacity</label>
              <input className="form-control" type="number" min={1} value={newSlot.capacity}
                onChange={e => setNewSlot(p => ({ ...p, capacity: Number(e.target.value) }))} />
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-primary btn-sm" onClick={handleAdd}><Plus size={13} /> Add</button>
              <button className="btn btn-outline btn-sm" onClick={() => setShowAddForm(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
        <select className="form-control" style={{ width: 220, fontSize: 12 }}
          value={offerFilter} onChange={e => setOfferFilter(e.target.value)}>
          <option value="all">All Offers</option>
          {mockOffers.map(o => <option key={o.id} value={o.id}>{o.title}</option>)}
        </select>
        <input className="form-control" type="date" value={dateFilter}
          onChange={e => setDateFilter(e.target.value)}
          style={{ width: 180, fontSize: 12 }} />
        {(offerFilter !== 'all' || dateFilter) && (
          <button className="btn btn-ghost btn-sm" onClick={() => { setOfferFilter('all'); setDateFilter(''); }}>
            Clear filters
          </button>
        )}
        <div style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
          <Calendar size={14} /> {filtered.length} slots
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <EmptyState icon="📅" title="No slots found" sub="Add a slot or adjust your filters." />
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Offer</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Capacity</th>
                  <th>Booked</th>
                  <th>Available</th>
                  <th style={{ minWidth: 160 }}>Availability</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(s => (
                  <tr key={s.id}>
                    <td style={{ fontWeight: 500 }}>{s.offerTitle}</td>
                    <td style={{ fontSize: 12 }}>{s.slotDate}</td>
                    <td style={{ fontSize: 12, whiteSpace: 'nowrap' }}>{s.startTime} – {s.endTime}</td>
                    <td style={{ textAlign: 'center' }}>{s.capacity}</td>
                    <td style={{ textAlign: 'center', color: 'var(--accent)', fontWeight: 500 }}>{s.bookedCount}</td>
                    <td style={{ textAlign: 'center', color: s.availableCount === 0 ? 'var(--danger)' : 'var(--success)', fontWeight: 600 }}>
                      {s.availableCount}
                    </td>
                    <td style={{ minWidth: 120 }}>
                      <div style={{ background: 'var(--border)', borderRadius: 99, height: 6 }}>
                        <div style={{
                          height: '100%', borderRadius: 99,
                          background: s.bookedCount >= s.capacity ? 'var(--danger)' : s.bookedCount / s.capacity > 0.7 ? 'var(--warn)' : 'var(--accent)',
                          width: `${Math.min(100, Math.round(s.bookedCount / s.capacity * 100))}%`,
                        }} />
                      </div>
                    </td>
                    <td>
                      <select className="form-control" style={{ fontSize: 11, padding: '4px 6px', width: 'auto' }}
                        value={s.status}
                        onChange={e => handleStatusChange(s.id, e.target.value as SlotStatus)}>
                        {(['Available', 'Full', 'Closed', 'Cancelled'] as SlotStatus[]).map(st => (
                          <option key={st}>{st}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button className="btn btn-outline btn-sm" title="Edit"><Edit2 size={12} /></button>
                        <button className="btn btn-outline btn-sm" style={{ color: 'var(--danger)' }}
                          title="Delete" onClick={() => handleDelete(s.id)}><Trash2 size={12} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default ManageSlotsPage;
