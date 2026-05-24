import React, { useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import { StatusBadge, FilterChip, EmptyState } from '../components/UI';
import { mockBookings } from '../data/mockData';
import { Booking, BookingStatus } from '../types';
import { Search, Download, Users, Clock, Hash } from 'lucide-react';

const STATUS_FILTERS: (BookingStatus | 'All')[] = ['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled', 'NoShow'];

const ManageBookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>(mockBookings);
  const [statusFilter, setStatusFilter] = useState<BookingStatus | 'All'>('All');
  const [search, setSearch] = useState('');

  const filtered = bookings.filter(b => {
    const matchStatus = statusFilter === 'All' || b.status === statusFilter;
    const matchSearch = !search || b.customerName.toLowerCase().includes(search.toLowerCase())
      || b.customerPhone.includes(search)
      || b.bookingReference.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const updateStatus = (id: string, status: BookingStatus) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
  };

  const handleExport = () => {
    const rows = [
      ['Ref', 'Customer', 'Phone', 'Offer', 'Business', 'Slot Date', 'Slot Time', 'People', 'Status', 'Created'],
      ...filtered.map(b => [b.bookingReference, b.customerName, b.customerPhone, b.offerTitle, b.businessName, b.slotDate, b.slotTime, String(b.peopleCount), b.status, b.createdAt]),
    ];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'bookings.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  // Summary stats
  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'Pending').length,
    confirmed: bookings.filter(b => b.status === 'Confirmed').length,
    completed: bookings.filter(b => b.status === 'Completed').length,
  };

  return (
    <AdminLayout
      title="Manage Bookings"
      actions={
        <button className="btn btn-outline btn-sm" onClick={handleExport}>
          <Download size={14} /> Export CSV
        </button>
      }
    >
      {/* Mini stats */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        {[
          { label: 'Total', val: stats.total, color: 'var(--text)' },
          { label: 'Pending', val: stats.pending, color: 'var(--warn)' },
          { label: 'Confirmed', val: stats.confirmed, color: 'var(--success)' },
          { label: 'Completed', val: stats.completed, color: 'var(--info)' },
        ].map(s => (
          <div key={s.label} style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 10, padding: '10px 18px', display: 'flex', gap: 10, alignItems: 'center',
          }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: s.color }}>{s.val}</span>
            <span style={{ fontSize: 12, color: 'var(--muted)' }}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        {STATUS_FILTERS.map(s => (
          <FilterChip key={s} label={s === 'NoShow' ? 'No Show' : s} active={statusFilter === s} onClick={() => setStatusFilter(s)} />
        ))}
        <div style={{ marginLeft: 'auto', position: 'relative' }}>
          <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--faint)' }} />
          <input className="form-control" placeholder="Search name / phone / ref..."
            value={search} onChange={e => setSearch(e.target.value)}
            style={{ paddingLeft: 32, width: 240, fontSize: 12 }} />
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <EmptyState icon="📋" title="No bookings found" sub="Try adjusting your filters." />
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th><Hash size={12} style={{ marginRight: 4 }} />Ref No.</th>
                  <th><Users size={12} style={{ marginRight: 4 }} />Customer</th>
                  <th>Offer</th>
                  <th><Clock size={12} style={{ marginRight: 4 }} />Slot</th>
                  <th style={{ textAlign: 'center' }}>People</th>
                  <th>Status</th>
                  <th>Booked On</th>
                  <th>Update Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(b => (
                  <tr key={b.id}>
                    <td>
                      <span style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 600, color: 'var(--accent)' }}>
                        {b.bookingReference}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 500 }}>{b.customerName}</div>
                      <div style={{ fontSize: 11, color: 'var(--muted)' }}>{b.customerPhone}</div>
                      {b.customerEmail && <div style={{ fontSize: 11, color: 'var(--muted)' }}>{b.customerEmail}</div>}
                    </td>
                    <td>
                      <div style={{ fontSize: 13 }}>{b.offerTitle}</div>
                      <div style={{ fontSize: 11, color: 'var(--muted)' }}>{b.businessName}</div>
                    </td>
                    <td>
                      <div style={{ fontSize: 12 }}>{b.slotDate}</div>
                      <div style={{ fontSize: 11, color: 'var(--muted)' }}>{b.slotTime}</div>
                    </td>
                    <td style={{ textAlign: 'center', fontWeight: 600 }}>{b.peopleCount}</td>
                    <td><StatusBadge status={b.status} /></td>
                    <td style={{ fontSize: 12, color: 'var(--muted)' }}>
                      {new Date(b.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td>
                      <select
                        className="form-control"
                        style={{ fontSize: 12, padding: '5px 8px', width: 'auto', cursor: 'pointer' }}
                        value={b.status}
                        onChange={e => updateStatus(b.id, e.target.value as BookingStatus)}
                      >
                        {(['Pending', 'Confirmed', 'Cancelled', 'Completed', 'NoShow'] as BookingStatus[]).map(s => (
                          <option key={s} value={s}>{s === 'NoShow' ? 'No Show' : s}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ padding: '12px 20px', background: 'var(--surface2)', borderTop: '1px solid var(--border)', fontSize: 12, color: 'var(--muted)' }}>
            Showing {filtered.length} of {bookings.length} bookings
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default ManageBookingsPage;
