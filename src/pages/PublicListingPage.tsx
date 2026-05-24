import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockOffers } from '../data/mockData';
import { Offer } from '../types';
import { FilterChip, PriceDisplay, SeatsBar, OfferThumb } from '../components/UI';
import { Search, SlidersHorizontal, Clock, Calendar, ChevronRight, Tag } from 'lucide-react';

const CATEGORIES = ['All', 'Fitness', 'Beauty', 'Food', 'Health', 'Sports', 'Education'];
const BIZ_TYPES = ['All', 'Gym', 'Salon', 'Restaurant', 'Clinic', 'Turf', 'Coaching'];

function Countdown({ endDate }: { endDate: string }) {
  const [time, setTime] = useState('');
  useEffect(() => {
    const calc = () => {
      const diff = new Date(endDate + 'T23:59:59').getTime() - Date.now();
      if (diff <= 0) { setTime('Expired'); return; }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTime(`${h}h ${m}m ${s}s`);
    };
    calc();
    const t = setInterval(calc, 1000);
    return () => clearInterval(t);
  }, [endDate]);
  return <span style={{ color: 'var(--danger)', fontWeight: 600 }}>{time}</span>;
}

const PublicListingPage: React.FC = () => {
  const navigate = useNavigate();
  const activeOffers = mockOffers.filter(o => o.status === 'Active');

  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('All');
  const [bizFilter, setBizFilter] = useState('All');
  const [availOnly, setAvailOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);

  const filtered = activeOffers.filter(o => {
    const matchSearch = !search || o.title.toLowerCase().includes(search.toLowerCase()) || o.businessName.toLowerCase().includes(search.toLowerCase());
    const matchCat = catFilter === 'All' || o.category === catFilter;
    const matchBiz = bizFilter === 'All' || o.businessType === bizFilter;
    const matchPrice = o.offerPrice >= priceRange[0] && o.offerPrice <= priceRange[1];
    return matchSearch && matchCat && matchBiz && matchPrice;
  });

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Header */}
      <header style={{
        background: 'var(--brand)', padding: '0 24px',
        display: 'flex', alignItems: 'center', gap: 12,
        height: 60, position: 'sticky', top: 0, zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 22 }}>🏷️</span>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color: '#fff' }}>SlotBook</span>
        </div>
        <div style={{ flex: 1, maxWidth: 500, margin: '0 auto', position: 'relative' }}>
          <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.5)' }} />
          <input
            placeholder="Search offers, gyms, salons..."
            value={search} onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%', padding: '8px 12px 8px 36px',
              borderRadius: 99, border: '1px solid rgba(255,255,255,0.2)',
              background: 'rgba(255,255,255,0.1)', color: '#fff', fontSize: 13,
              fontFamily: 'var(--font-body)', outline: 'none',
            }}
          />
        </div>
        <button className="btn btn-sm" onClick={() => navigate('/admin/dashboard')}
          style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', gap: 6 }}>
          Admin <ChevronRight size={13} />
        </button>
      </header>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '28px 20px' }}>
        {/* Hero */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, marginBottom: 6 }}>
            🎯 Today's Best Offers
          </h1>
          <p style={{ fontSize: 14, color: 'var(--muted)' }}>
            {filtered.length} limited-time offers available — book before they're gone!
          </p>
        </div>

        {/* Filter bar */}
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 14, padding: '14px 18px', marginBottom: 20,
        }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted)', marginRight: 4 }}>Category:</span>
            {CATEGORIES.map(c => (
              <FilterChip key={c} label={c} active={catFilter === c} onClick={() => setCatFilter(c)} />
            ))}
            <button className="btn btn-outline btn-sm" style={{ marginLeft: 'auto' }}
              onClick={() => setShowFilters(!showFilters)}>
              <SlidersHorizontal size={13} /> More Filters
            </button>
          </div>

          {showFilters && (
            <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--border)', display: 'flex', gap: 20, flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted)', marginBottom: 8 }}>Business Type</div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {BIZ_TYPES.map(b => (
                    <FilterChip key={b} label={b} active={bizFilter === b} onClick={() => setBizFilter(b)} />
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: 13 }}>
                  <input type="checkbox" checked={availOnly} onChange={e => setAvailOnly(e.target.checked)} />
                  Available only
                </label>
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted)', marginBottom: 8 }}>
                  Max Price: ₹{priceRange[1]}
                </div>
                <input type="range" min={0} max={2000} step={50} value={priceRange[1]}
                  onChange={e => setPriceRange([0, Number(e.target.value)])}
                  style={{ width: 160 }} />
              </div>
            </div>
          )}
        </div>

        {/* Offer grid */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 60 }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 600 }}>No offers match your filters</div>
            <div style={{ fontSize: 14, color: 'var(--muted)', marginTop: 6 }}>Try clearing some filters</div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
            {filtered.map(o => (
              <OfferCard key={o.id} offer={o} onBook={() => navigate(`/offers/${o.id}`)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const OfferCard: React.FC<{ offer: Offer; onBook: () => void }> = ({ offer: o, onBook }) => {
  const booked = Math.floor(o.totalCapacity * 0.65);
  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden', cursor: 'pointer', transition: 'box-shadow 0.18s, transform 0.18s' }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-lg)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = ''; (e.currentTarget as HTMLElement).style.transform = ''; }}
      onClick={onBook}>
      <OfferThumb bizType={o.businessType} emoji={o.emoji} image={o.image} height={150}>
        <span style={{ position: 'absolute', top: 8, right: 8 }}>
          <span className="badge badge-success">Active</span>
        </span>
        <div style={{
          position: 'absolute', bottom: 8, left: 8,
          background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)',
          color: '#fff', fontSize: 11, padding: '4px 10px', borderRadius: 99,
          display: 'flex', alignItems: 'center', gap: 5,
        }}>
          <Clock size={11} /> Ends in: <Countdown endDate={o.endDate} />
        </div>
      </OfferThumb>

      <div style={{ padding: '14px 16px 10px' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 600, marginBottom: 3 }}>{o.title}</div>
        <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
          {o.businessName}
          <span style={{ display: 'flex', alignItems: 'center', gap: 3, padding: '1px 8px', background: 'var(--bg)', borderRadius: 99, border: '1px solid var(--border)' }}>
            <Tag size={10} />{o.category}
          </span>
        </div>
        <PriceDisplay original={o.originalPrice} offer={o.offerPrice} discount={o.discountPercentage} />
        <div style={{ display: 'flex', gap: 14, fontSize: 11, color: 'var(--muted)', marginTop: 10 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Calendar size={12} /> {o.startDate}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={12} /> {o.startTime}–{o.endTime}</span>
        </div>
      </div>

      <div style={{ padding: '10px 16px' }}>
        <SeatsBar booked={booked} capacity={o.totalCapacity} />
      </div>

      <div style={{ padding: '10px 16px 14px' }}>
        <button className="btn btn-primary btn-full" onClick={e => { e.stopPropagation(); onBook(); }}>
          Book Now — ₹{o.offerPrice}
        </button>
      </div>
    </div>
  );
};

export default PublicListingPage;
