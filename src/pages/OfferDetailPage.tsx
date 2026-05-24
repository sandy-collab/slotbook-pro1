import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { mockOffers, mockSlots } from '../data/mockData';
import { OfferThumb, PriceDisplay, SeatsBar, StatusBadge } from '../components/UI';
import { ArrowLeft, MapPin, Clock, Calendar, Users, Shield, ChevronRight } from 'lucide-react';

function Countdown({ endDate }: { endDate: string }) {
  const [time, setTime] = useState({ h: 0, m: 0, s: 0 });
  useEffect(() => {
    const calc = () => {
      const diff = new Date(endDate + 'T23:59:59').getTime() - Date.now();
      if (diff <= 0) return;
      setTime({ h: Math.floor(diff / 3600000), m: Math.floor((diff % 3600000) / 60000), s: Math.floor((diff % 60000) / 1000) });
    };
    calc();
    const t = setInterval(calc, 1000);
    return () => clearInterval(t);
  }, [endDate]);
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      {[{ val: time.h, label: 'hrs' }, { val: time.m, label: 'min' }, { val: time.s, label: 'sec' }].map(u => (
        <div key={u.label} style={{ textAlign: 'center' }}>
          <div style={{
            fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700,
            background: 'var(--brand)', color: '#fff', padding: '6px 10px', borderRadius: 8, minWidth: 50,
          }}>{String(u.val).padStart(2, '0')}</div>
          <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 3 }}>{u.label}</div>
        </div>
      ))}
    </div>
  );
}

const OfferDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const offer = mockOffers.find(o => o.id === id) ?? mockOffers[0];
  const offerSlots = mockSlots.filter(s => s.offerId === offer.id);
  const booked = Math.floor(offer.totalCapacity * 0.65);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Top nav */}
      <header style={{
        background: 'var(--surface)', borderBottom: '1px solid var(--border)',
        padding: '0 20px', height: 56,
        display: 'flex', alignItems: 'center', gap: 12, position: 'sticky', top: 0, zIndex: 50,
      }}>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/offers')} style={{ gap: 6 }}>
          <ArrowLeft size={15} /> Back to Offers
        </button>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 12, color: 'var(--muted)' }}>
          {offer.businessName} <ChevronRight size={12} style={{ verticalAlign: 'middle' }} /> {offer.title}
        </span>
      </header>

      <div style={{ maxWidth: 820, margin: '0 auto', padding: '28px 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 20, alignItems: 'start' }}>

          {/* Left column */}
          <div>
            <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: 16 }}>
              <OfferThumb bizType={offer.businessType} emoji={offer.emoji} image={offer.image} height={240}>
                <span style={{ position: 'absolute', top: 14, right: 14 }}>
                  <StatusBadge status={offer.status} />
                </span>
              </OfferThumb>
              <div style={{ padding: '20px 22px' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, marginBottom: 4 }}>{offer.title}</div>
                <div style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 16 }}>{offer.businessName}</div>
                <PriceDisplay original={offer.originalPrice} offer={offer.offerPrice} discount={offer.discountPercentage} size="lg" />
                <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.8, marginTop: 16 }}>{offer.description}</p>
              </div>
            </div>

            {/* Details grid */}
            <div className="card" style={{ marginBottom: 16 }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 600, marginBottom: 14 }}>Offer Details</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                {[
                  { icon: <Calendar size={15} />, label: 'Start Date', val: offer.startDate },
                  { icon: <Calendar size={15} />, label: 'End Date', val: offer.endDate },
                  { icon: <Clock size={15} />, label: 'Time', val: `${offer.startTime} – ${offer.endTime}` },
                  { icon: <MapPin size={15} />, label: 'City', val: 'Rourkela, Odisha' },
                  { icon: <Users size={15} />, label: 'Total Capacity', val: String(offer.totalCapacity) },
                  { icon: <Users size={15} />, label: 'Max Per Customer', val: String(offer.maxBookingPerCustomer) },
                ].map(d => (
                  <div key={d.label} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <div style={{ color: 'var(--accent)', marginTop: 1 }}>{d.icon}</div>
                    <div>
                      <div style={{ fontSize: 11, color: 'var(--faint)' }}>{d.label}</div>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{d.val}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Available Slots */}
            {offerSlots.length > 0 && (
              <div className="card" style={{ marginBottom: 16 }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 600, marginBottom: 14 }}>Available Slots</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {offerSlots.map(s => (
                    <div key={s.id} style={{
                      display: 'flex', alignItems: 'center', gap: 14, padding: '10px 14px',
                      background: s.status === 'Full' ? 'var(--bg)' : 'var(--surface2)',
                      borderRadius: 10, border: '1px solid var(--border)',
                      opacity: s.status === 'Full' ? 0.65 : 1,
                    }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 500, fontSize: 13 }}>{s.slotDate}</div>
                        <div style={{ fontSize: 12, color: 'var(--muted)' }}>{s.startTime} – {s.endTime}</div>
                      </div>
                      <SeatsBar booked={s.bookedCount} capacity={s.capacity} />
                      <StatusBadge status={s.status} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Terms */}
            <div className="card" style={{ background: 'var(--warn-bg)', borderColor: 'rgba(245,158,11,0.3)' }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <Shield size={16} style={{ color: 'var(--warn)', marginTop: 1, flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#92400e', marginBottom: 4 }}>Terms & Conditions</div>
                  <div style={{ fontSize: 13, color: '#92400e', lineHeight: 1.7 }}>{offer.termsAndConditions}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right column - sticky booking card */}
          <div style={{ position: 'sticky', top: 76 }}>
            <div className="card" style={{ marginBottom: 14 }}>
              <div style={{ marginBottom: 14, paddingBottom: 14, borderBottom: '1px solid var(--border)' }}>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 4 }}>Offer expires in</div>
                <Countdown endDate={offer.endDate} />
              </div>

              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Availability</div>
                <SeatsBar booked={booked} capacity={offer.totalCapacity} />
              </div>

              <div style={{ marginBottom: 20 }}>
                <PriceDisplay original={offer.originalPrice} offer={offer.offerPrice} discount={offer.discountPercentage} size="lg" />
              </div>

              <button className="btn btn-primary btn-full btn-lg"
                onClick={() => navigate(`/offers/${offer.id}/book`)}>
                Book This Slot →
              </button>
              <div style={{ fontSize: 11, color: 'var(--faint)', textAlign: 'center', marginTop: 8 }}>
                Instant confirmation · No hidden charges
              </div>
            </div>

            {/* Business card */}
            <div className="card">
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>About the Business</div>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                  {offer.emoji}
                </div>
                <div>
                  <div style={{ fontWeight: 500, fontSize: 13 }}>{offer.businessName}</div>
                  <div style={{ fontSize: 11, color: 'var(--muted)' }}>{offer.businessType}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center', fontSize: 12, color: 'var(--muted)' }}>
                <MapPin size={13} /> Rourkela, Odisha
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfferDetailPage;
