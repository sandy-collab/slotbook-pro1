import React, { ReactNode } from 'react';
import { BookingStatus, OfferStatus, SlotStatus } from '../types';

// ── Status Badge ─────────────────────────────────────────────────────────────
interface StatusBadgeProps {
  status: BookingStatus | OfferStatus | SlotStatus;
}
export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const map: Record<string, string> = {
    Confirmed: 'badge-success',
    Completed: 'badge-info',
    Pending:   'badge-warn',
    NoShow:    'badge-warn',
    Cancelled: 'badge-danger',
    Active:    'badge-success',
    Paused:    'badge-warn',
    Draft:     'badge-neutral',
    Expired:   'badge-danger',
    Available: 'badge-success',
    Full:      'badge-danger',
    Closed:    'badge-neutral',
  };
  return (
    <span className={`badge ${map[status] ?? 'badge-neutral'}`}>
      {status === 'NoShow' ? 'No Show' : status}
    </span>
  );
};

// ── Stat Card ────────────────────────────────────────────────────────────────
interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  icon: ReactNode;
  iconBg: string;
  iconColor: string;
}
export const StatCard: React.FC<StatCardProps> = ({ label, value, sub, icon, iconBg, iconColor }) => (
  <div className="card" style={{ padding: '16px 18px' }}>
    <div style={{
      width: 36, height: 36, borderRadius: 10,
      background: iconBg, color: iconColor,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      marginBottom: 10,
    }}>{icon}</div>
    <div style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>
      {label}
    </div>
    <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 700, lineHeight: 1 }}>{value}</div>
    {sub && <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>{sub}</div>}
  </div>
);

// ── Section Header ────────────────────────────────────────────────────────────
interface SectionHeaderProps {
  title: string;
  sub?: string;
  actions?: ReactNode;
}
export const SectionHeader: React.FC<SectionHeaderProps> = ({ title, sub, actions }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
    <div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 600 }}>{title}</h2>
      {sub && <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{sub}</p>}
    </div>
    {actions && <div>{actions}</div>}
  </div>
);

// ── Seats Progress Bar ────────────────────────────────────────────────────────
interface SeatsBarProps {
  booked: number;
  capacity: number;
}
export const SeatsBar: React.FC<SeatsBarProps> = ({ booked, capacity }) => {
  const pct = capacity > 0 ? Math.round((booked / capacity) * 100) : 0;
  const color = pct >= 100 ? 'var(--danger)' : pct >= 70 ? 'var(--warn)' : 'var(--accent)';
  return (
    <div>
      <div style={{ background: 'var(--border)', borderRadius: 99, height: 5, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 99, transition: 'width 0.3s' }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 3, fontSize: 11, color: 'var(--muted)' }}>
        <span>{booked}/{capacity} booked</span>
        <span style={{ color: pct >= 100 ? 'var(--danger)' : 'var(--success)', fontWeight: 600 }}>
          {capacity - booked} left
        </span>
      </div>
    </div>
  );
};

// ── Loading Spinner ───────────────────────────────────────────────────────────
export const Spinner: React.FC = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 48 }}>
    <div style={{
      width: 32, height: 32, borderRadius: '50%',
      border: '3px solid var(--border)',
      borderTopColor: 'var(--accent)',
      animation: 'spin 0.7s linear infinite',
    }} />
  </div>
);

// ── Empty State ───────────────────────────────────────────────────────────────
interface EmptyStateProps {
  icon?: string;
  title: string;
  sub?: string;
  action?: ReactNode;
}
export const EmptyState: React.FC<EmptyStateProps> = ({ icon = '📭', title, sub, action }) => (
  <div style={{ textAlign: 'center', padding: '56px 24px' }}>
    <div style={{ fontSize: 40, marginBottom: 12 }}>{icon}</div>
    <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600, marginBottom: 6 }}>{title}</div>
    {sub && <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 20 }}>{sub}</div>}
    {action}
  </div>
);

// ── Filter Chip ───────────────────────────────────────────────────────────────
interface FilterChipProps {
  label: string;
  active: boolean;
  onClick: () => void;
}
export const FilterChip: React.FC<FilterChipProps> = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    style={{
      padding: '6px 14px',
      borderRadius: 99,
      border: `1px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
      background: active ? 'var(--accent)' : 'var(--surface)',
      color: active ? '#fff' : 'var(--muted)',
      fontSize: 12, fontWeight: 500, cursor: 'pointer',
      fontFamily: 'var(--font-body)',
      transition: 'all 0.15s',
    }}
  >{label}</button>
);

// ── Price Display ─────────────────────────────────────────────────────────────
interface PriceDisplayProps {
  original: number;
  offer: number;
  discount: number;
  size?: 'sm' | 'md' | 'lg';
}
export const PriceDisplay: React.FC<PriceDisplayProps> = ({ original, offer, discount, size = 'md' }) => {
  const mainSize = size === 'lg' ? 28 : size === 'sm' ? 16 : 20;
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
      <span style={{ fontFamily: 'var(--font-display)', fontSize: mainSize, fontWeight: 700, color: 'var(--accent)' }}>
        ₹{offer}
      </span>
      <span style={{ fontSize: 13, color: 'var(--muted)', textDecoration: 'line-through' }}>₹{original}</span>
      <span style={{ fontSize: 11, fontWeight: 600, color: '#15803d', background: '#f0fdf4', padding: '2px 7px', borderRadius: 99 }}>
        {discount}% off
      </span>
    </div>
  );
};

// ── Offer Thumb ───────────────────────────────────────────────────────────────
interface OfferThumbProps {
  bizType: string;
  emoji: string;
  image?: string;
  height?: number;
  children?: ReactNode;
}
export const OfferThumb: React.FC<OfferThumbProps> = ({ bizType, emoji, image, height = 100, children }) => {
  const classMap: Record<string, string> = {
    Gym: 'thumb-gym', Salon: 'thumb-salon',
    Restaurant: 'thumb-restaurant', Clinic: 'thumb-clinic',
    Turf: 'thumb-turf', Coaching: 'thumb-coaching', Other: 'thumb-other',
  };

  if (image) {
    return (
      <div style={{ height, position: 'relative', overflow: 'hidden' }}>
        <img
          src={image}
          alt={bizType}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
        />
        {/* Dark gradient overlay so badges/text stay readable */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.05) 60%)',
        }} />
        {children}
      </div>
    );
  }

  return (
    <div
      className={classMap[bizType] ?? 'thumb-other'}
      style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}
    >
      <span style={{ fontSize: height > 120 ? 56 : 36 }}>{emoji}</span>
      {children}
    </div>
  );
};
