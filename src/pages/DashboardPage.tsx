import React from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import { StatCard, StatusBadge, SectionHeader } from '../components/UI';
import { mockDashboard, mockBookings, mockOffers } from '../data/mockData';
import {
  Tag, CheckCircle, Calendar, TrendingUp, Plus,
} from 'lucide-react';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const d = mockDashboard;
  const recentBookings = mockBookings.slice(0, 5);
  const activeOffers = mockOffers.filter(o => o.status === 'Active').slice(0, 3);

  const maxBar = Math.max(...d.weeklyData.map(w => w.count));

  return (
    <AdminLayout
      title="Dashboard"
      actions={
        <button className="btn btn-primary btn-sm" onClick={() => navigate('/admin/offers/create')}>
          <Plus size={14} /> New Offer
        </button>
      }
    >
      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 20 }}>
        <StatCard
          label="Total Offers" value={d.totalOffers}
          sub={`${d.activeOffers} active`}
          icon={<Tag size={18} />}
          iconBg="var(--info-bg)" iconColor="var(--info)"
        />
        <StatCard
          label="Total Bookings" value={d.totalBookings}
          sub="↑ 12% vs last week"
          icon={<CheckCircle size={18} />}
          iconBg="var(--success-bg)" iconColor="var(--success)"
        />
        <StatCard
          label="Today's Bookings" value={d.todaysBookings}
          sub="6 confirmed, 8 pending"
          icon={<Calendar size={18} />}
          iconBg="var(--warn-bg)" iconColor="var(--warn)"
        />
        <StatCard
          label="Conversion Rate" value={`${d.conversionRate}%`}
          sub="Seats booked / capacity"
          icon={<TrendingUp size={18} />}
          iconBg="var(--danger-bg)" iconColor="var(--accent)"
        />
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, marginBottom: 20 }}>
        {/* Weekly bookings chart */}
        <div className="card">
          <SectionHeader
            title="Weekly Bookings"
            sub="May 19–25, 2025"
          />
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 100 }}>
            {d.weeklyData.map((item) => (
              <div key={item.day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, height: '100%', justifyContent: 'flex-end' }}>
                <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 500 }}>{item.count}</div>
                <div style={{
                  width: '100%', background: 'var(--accent)',
                  borderRadius: '4px 4px 0 0', opacity: 0.85,
                  height: `${Math.round((item.count / maxBar) * 75)}px`,
                  minHeight: 4, transition: 'height 0.4s ease',
                }} />
                <div style={{ fontSize: 10, color: 'var(--faint)' }}>{item.day}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Capacity overview */}
        <div className="card">
          <SectionHeader title="Capacity Overview" />
          {[
            { label: 'Total Capacity', val: d.totalCapacity, color: 'var(--info)', pct: 100 },
            { label: 'Booked Seats', val: d.bookedSeats, color: 'var(--accent)', pct: Math.round(d.bookedSeats / d.totalCapacity * 100) },
            { label: 'Available', val: d.availableSeats, color: 'var(--success)', pct: Math.round(d.availableSeats / d.totalCapacity * 100) },
          ].map(r => (
            <div key={r.label} style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6 }}>
                <span style={{ color: 'var(--muted)' }}>{r.label}</span>
                <span style={{ fontWeight: 600 }}>{r.val}</span>
              </div>
              <div style={{ background: 'var(--border)', borderRadius: 99, height: 6 }}>
                <div style={{ height: '100%', borderRadius: 99, background: r.color, width: `${r.pct}%`, transition: 'width 0.5s' }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent bookings & active offers */}
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 16 }}>
        {/* Recent bookings */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 600 }}>Recent Bookings</h3>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/admin/bookings')}>View all →</button>
          </div>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Offer</th>
                  <th>Slot</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map(b => (
                  <tr key={b.id} style={{ cursor: 'pointer' }} onClick={() => navigate('/admin/bookings')}>
                    <td>
                      <div style={{ fontWeight: 500 }}>{b.customerName}</div>
                      <div style={{ fontSize: 11, color: 'var(--muted)' }}>{b.customerPhone}</div>
                    </td>
                    <td style={{ fontSize: 12 }}>{b.offerTitle}</td>
                    <td style={{ fontSize: 11, color: 'var(--muted)' }}>{b.slotDate}</td>
                    <td><StatusBadge status={b.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Active offers */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 600 }}>Active Offers</h3>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/admin/offers')}>View all →</button>
          </div>
          {activeOffers.map(o => (
            <div key={o.id} style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', display: 'flex', gap: 12, alignItems: 'center' }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
                background: 'var(--bg)',
              }}>{o.emoji}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 500, fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{o.title}</div>
                <div style={{ fontSize: 11, color: 'var(--muted)' }}>{o.businessName}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                  <div style={{ flex: 1, background: 'var(--border)', borderRadius: 99, height: 3 }}>
                    <div style={{ height: '100%', borderRadius: 99, background: 'var(--accent)', width: `${Math.round((mockDashboard.bookedSeats / mockDashboard.totalCapacity) * 100)}%` }} />
                  </div>
                  <span style={{ fontSize: 10, color: 'var(--muted)', whiteSpace: 'nowrap' }}>₹{o.offerPrice}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default DashboardPage;
