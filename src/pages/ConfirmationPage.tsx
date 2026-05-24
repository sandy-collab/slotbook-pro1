import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, Download, Share2, Home, Calendar, Clock, User, Tag, Users } from 'lucide-react';

const ConfirmationPage: React.FC = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const ref = params.get('ref') ?? 'SLT-2025-0001';
  const offer = params.get('offer') ?? 'Gym Trial Slot';
  const biz = params.get('biz') ?? 'FitZone Gym';
  const date = params.get('date') ?? '2025-05-25';
  const time = (params.get('time') ?? '15:00-17:00').replace('-', ' – ');
  const name = params.get('name') ?? 'Customer';
  const people = params.get('people') ?? '1';

  const details = [
    { icon: <Tag size={15} />,      label: 'Offer',    val: offer },
    { icon: <Home size={15} />,     label: 'Business', val: biz },
    { icon: <Calendar size={15} />, label: 'Date',     val: date },
    { icon: <Clock size={15} />,    label: 'Time',     val: time },
    { icon: <User size={15} />,     label: 'Customer', val: decodeURIComponent(name) },
    { icon: <Users size={15} />,    label: 'People',   val: people },
    { icon: <CheckCircle size={15} />, label: 'Status', val: 'Confirmed' },
  ];

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24, position: 'relative', overflow: 'hidden',
    }}>
      {/* Confetti-like decoration */}
      {['🎉', '✨', '🎊', '⭐', '🎈'].map((e, i) => (
        <div key={i} style={{
          position: 'absolute', fontSize: 28, opacity: 0.15,
          top: `${10 + i * 18}%`,
          left: i % 2 === 0 ? `${5 + i * 3}%` : 'auto',
          right: i % 2 !== 0 ? `${5 + i * 3}%` : 'auto',
          transform: `rotate(${i * 30}deg)`,
          pointerEvents: 'none',
        }}>{e}</div>
      ))}

      <div style={{ width: '100%', maxWidth: 480 }}>
        {/* Success icon */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            width: 80, height: 80, borderRadius: '50%',
            background: 'var(--success-bg)', border: '2px solid rgba(34,197,94,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
          }}>
            <CheckCircle size={40} style={{ color: 'var(--success)' }} />
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 800, marginBottom: 6 }}>
            Booking Confirmed! 🎉
          </h1>
          <p style={{ fontSize: 14, color: 'var(--muted)' }}>
            Your slot is reserved. Show this at the venue.
          </p>
        </div>

        {/* Reference number */}
        <div style={{
          background: 'var(--brand)', borderRadius: 14, padding: '18px 24px',
          textAlign: 'center', marginBottom: 20,
        }}>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', letterSpacing: 1, marginBottom: 8, textTransform: 'uppercase' }}>
            Booking Reference
          </div>
          <div style={{
            fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800,
            color: '#fff', letterSpacing: 3,
          }}>{ref}</div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 8 }}>
            Show this number at the venue for entry
          </div>
        </div>

        {/* Details card */}
        <div className="card" style={{ marginBottom: 20 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 600, marginBottom: 14 }}>Booking Details</div>
          {details.map(d => (
            <div key={d.label} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '9px 0', borderBottom: '1px solid var(--border)',
              fontSize: 13,
            }}>
              <span style={{ color: 'var(--accent)', flexShrink: 0 }}>{d.icon}</span>
              <span style={{ color: 'var(--muted)', width: 80, flexShrink: 0 }}>{d.label}</span>
              <span style={{ fontWeight: d.label === 'Status' ? 600 : 400, color: d.label === 'Status' ? 'var(--success)' : 'var(--text)' }}>
                {d.val}
              </span>
            </div>
          ))}
          <div style={{ paddingTop: 10, fontSize: 11, color: 'var(--faint)' }}>
            Booked on {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
          <button className="btn btn-outline" style={{ flex: 1, justifyContent: 'center' }}
            onClick={() => {
              const text = `Booking: ${ref}\nOffer: ${offer}\nBusiness: ${biz}\nDate: ${date}\nTime: ${time}`;
              navigator.clipboard?.writeText(text);
            }}>
            <Download size={14} /> Copy Details
          </button>
          <button className="btn btn-outline" style={{ flex: 1, justifyContent: 'center' }}
            onClick={() => {
              if (navigator.share) navigator.share({ title: `Booking ${ref}`, text: `Booked: ${offer} at ${biz}` });
            }}>
            <Share2 size={14} /> Share
          </button>
        </div>

        <button className="btn btn-dark btn-full btn-lg" onClick={() => navigate('/offers')}>
          <Home size={16} /> Browse More Offers
        </button>

        <div style={{ textAlign: 'center', marginTop: 16, fontSize: 12, color: 'var(--faint)' }}>
          Have questions? Contact the business directly.
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPage;
