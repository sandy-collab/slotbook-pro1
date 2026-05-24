import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, LogIn } from 'lucide-react';

const LoginPage: React.FC = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('admin@fitzonegym.in');
  const [password, setPassword] = useState('password123');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (isAuthenticated) return <Navigate to="/admin/dashboard" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const ok = await login(email, password);
    setLoading(false);
    if (ok) {
      navigate('/admin/dashboard');
    } else {
      setError('Invalid credentials. Try admin@fitzonegym.in / password123');
    }
  };

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24, position: 'relative', overflow: 'hidden',
    }}>
      {/* Background decoration */}
      <div style={{
        position: 'absolute', top: -120, right: -120,
        width: 480, height: 480, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(233,69,96,0.07) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: -100, left: -80,
        width: 320, height: 320, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(26,26,46,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ display: 'flex', width: '100%', maxWidth: 900, gap: 0, borderRadius: 24, overflow: 'hidden', boxShadow: 'var(--shadow-lg)' }}>
        {/* Left panel */}
        <div style={{
          flex: 1, background: 'var(--brand)',
          padding: '52px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 48 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 10, background: 'var(--accent)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
              }}>🏷️</div>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: '#fff' }}>
                  SlotBook Pro
                </div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>Smart Offer Booking System</div>
              </div>
            </div>

            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, color: '#fff', lineHeight: 1.3, marginBottom: 16 }}>
              Manage offers.<br />Fill every slot.
            </h2>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.8 }}>
              The all-in-one booking platform for gyms, salons, clinics, restaurants, and service businesses.
            </p>
          </div>

          <div>
            {[
              { emoji: '⚡', text: 'Create time-limited offer slots in minutes' },
              { emoji: '📊', text: 'Real-time dashboard & booking analytics' },
              { emoji: '🔔', text: 'Manage bookings, statuses & customer data' },
            ].map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 16 }}>
                <span style={{ fontSize: 18, flexShrink: 0, marginTop: 1 }}>{f.emoji}</span>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', lineHeight: 1.6 }}>{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right panel - form */}
        <div style={{ width: 400, background: 'var(--surface)', padding: '52px 40px' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, marginBottom: 6 }}>
            Admin Login
          </h3>
          <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 32 }}>
            Sign in to manage your business
          </p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                className="form-control"
                type="email"
                placeholder="admin@business.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  className="form-control"
                  type={showPass ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  style={{ paddingRight: 40 }}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{
                    position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)',
                    padding: 4,
                  }}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div style={{
                background: 'var(--danger-bg)', border: '1px solid rgba(239,68,68,0.2)',
                borderRadius: 8, padding: '10px 14px', fontSize: 12, color: 'var(--danger)', marginBottom: 16,
              }}>
                {error}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
              <span style={{ fontSize: 12, color: 'var(--accent)', cursor: 'pointer' }}>Forgot password?</span>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-full btn-lg"
              disabled={loading}
              style={{ gap: 8 }}
            >
              {loading ? (
                <>
                  <div style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', animation: 'spin 0.7s linear infinite' }} />
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn size={16} /> Sign In to Dashboard
                </>
              )}
            </button>
          </form>

          <div style={{ marginTop: 32, padding: 14, background: 'var(--bg)', borderRadius: 10, fontSize: 12, color: 'var(--muted)' }}>
            <div style={{ fontWeight: 600, marginBottom: 4, color: 'var(--text)' }}>Demo credentials</div>
            <div>Email: <code style={{ color: 'var(--accent)' }}>admin@fitzonegym.in</code></div>
            <div>Password: <code style={{ color: 'var(--accent)' }}>password123</code></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
