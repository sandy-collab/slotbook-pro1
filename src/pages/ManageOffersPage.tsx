import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import { StatusBadge, SeatsBar, PriceDisplay, OfferThumb, FilterChip, EmptyState } from '../components/UI';
import { mockOffers } from '../data/mockData';
import { Offer, OfferStatus } from '../types';
import { Plus, Search, Edit2, Trash2, MoreVertical, Calendar, Clock } from 'lucide-react';

const TABS: { label: string; filter: OfferStatus | 'All' }[] = [
  { label: 'All', filter: 'All' },
  { label: 'Active', filter: 'Active' },
  { label: 'Draft', filter: 'Draft' },
  { label: 'Paused', filter: 'Paused' },
  { label: 'Expired', filter: 'Expired' },
];

const ManageOffersPage: React.FC = () => {
  const navigate = useNavigate();
  const [offers, setOffers] = useState<Offer[]>(mockOffers);
  const [activeTab, setActiveTab] = useState<OfferStatus | 'All'>('All');
  const [search, setSearch] = useState('');
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  const filtered = offers.filter(o => {
    const matchTab = activeTab === 'All' || o.status === activeTab;
    const matchSearch = !search || o.title.toLowerCase().includes(search.toLowerCase()) || o.businessName.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const counts: Record<string, number> = { All: offers.length };
  TABS.slice(1).forEach(t => { counts[t.filter] = offers.filter(o => o.status === t.filter).length; });

  const handleStatusChange = (id: string, status: OfferStatus) => {
    setOffers(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    setMenuOpen(null);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this offer?')) setOffers(prev => prev.filter(o => o.id !== id));
    setMenuOpen(null);
  };

  return (
    <AdminLayout
      title="Manage Offers"
      actions={
        <button className="btn btn-primary btn-sm" onClick={() => navigate('/admin/offers/create')}>
          <Plus size={14} /> Create Offer
        </button>
      }
    >
      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', marginBottom: 20, gap: 0, overflowX: 'auto' }}>
        {TABS.map(t => (
          <button key={t.filter} onClick={() => setActiveTab(t.filter)}
            style={{
              padding: '10px 18px', fontSize: 13, cursor: 'pointer', background: 'none', border: 'none',
              borderBottom: `2px solid ${activeTab === t.filter ? 'var(--accent)' : 'transparent'}`,
              color: activeTab === t.filter ? 'var(--accent)' : 'var(--muted)',
              fontWeight: activeTab === t.filter ? 600 : 400,
              fontFamily: 'var(--font-body)', whiteSpace: 'nowrap',
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
            {t.label}
            <span style={{
              fontSize: 11, padding: '1px 6px', borderRadius: 99, fontWeight: 600,
              background: activeTab === t.filter ? 'var(--accent-glow)' : 'var(--bg)',
              color: activeTab === t.filter ? 'var(--accent)' : 'var(--faint)',
            }}>{counts[t.filter] ?? 0}</span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div style={{ position: 'relative', maxWidth: 320, marginBottom: 20 }}>
        <Search size={15} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--faint)' }} />
        <input className="form-control" placeholder="Search offers..."
          value={search} onChange={e => setSearch(e.target.value)}
          style={{ paddingLeft: 34 }} />
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <EmptyState icon="🏷️" title="No offers found"
          sub="Try a different filter or create your first offer."
          action={<button className="btn btn-primary" onClick={() => navigate('/admin/offers/create')}><Plus size={14} /> Create Offer</button>} />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
          {filtered.map(o => (
            <div key={o.id} className="card" style={{ padding: 0, overflow: 'hidden', transition: 'box-shadow 0.18s, transform 0.18s', cursor: 'pointer' }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = 'var(--shadow-lg)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = ''; (e.currentTarget as HTMLDivElement).style.transform = ''; }}>
              <OfferThumb bizType={o.businessType} emoji={o.emoji} image={o.image} height={130}>
                <span style={{
                  position: 'absolute', top: 8, right: 8,
                  backdropFilter: 'blur(6px)',
                  borderRadius: 99, padding: '2px 0',
                }}>
                  <StatusBadge status={o.status} />
                </span>
              </OfferThumb>

              <div style={{ padding: '14px 14px 10px' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{o.title}</div>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 10 }}>{o.businessName}</div>
                <PriceDisplay original={o.originalPrice} offer={o.offerPrice} discount={o.discountPercentage} size="sm" />
                <div style={{ display: 'flex', gap: 12, fontSize: 11, color: 'var(--muted)', marginTop: 8 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Calendar size={12} /> {o.startDate}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={12} /> {o.startTime}–{o.endTime}</span>
                </div>
              </div>

              <div style={{ padding: '10px 14px', borderTop: '1px solid var(--border)' }}>
                <SeatsBar booked={Math.floor(o.totalCapacity * 0.6)} capacity={o.totalCapacity} />
              </div>

              <div style={{ padding: '8px 14px 12px', display: 'flex', gap: 8 }}>
                <button className="btn btn-outline btn-sm" style={{ flex: 1 }}
                  onClick={() => navigate('/admin/offers/create')}>
                  <Edit2 size={12} /> Edit
                </button>
                <div style={{ position: 'relative' }}>
                  <button className="btn btn-outline btn-sm"
                    onClick={() => setMenuOpen(menuOpen === o.id ? null : o.id)}>
                    <MoreVertical size={12} />
                  </button>
                  {menuOpen === o.id && (
                    <div style={{
                      position: 'absolute', right: 0, bottom: '110%', background: 'var(--surface)',
                      border: '1px solid var(--border)', borderRadius: 10, boxShadow: 'var(--shadow-lg)',
                      zIndex: 50, minWidth: 160, padding: '4px 0',
                    }}>
                      {(['Active', 'Paused', 'Draft'] as OfferStatus[]).filter(s => s !== o.status).map(s => (
                        <button key={s} onClick={() => handleStatusChange(o.id, s)}
                          style={{ display: 'block', width: '100%', padding: '8px 14px', background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, textAlign: 'left', fontFamily: 'var(--font-body)', color: 'var(--text)' }}
                          onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg)')}
                          onMouseLeave={e => (e.currentTarget.style.background = 'none')}>
                          Mark as {s}
                        </button>
                      ))}
                      <div style={{ height: 1, background: 'var(--border)', margin: '4px 0' }} />
                      <button onClick={() => handleDelete(o.id)}
                        style={{ display: 'block', width: '100%', padding: '8px 14px', background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, textAlign: 'left', fontFamily: 'var(--font-body)', color: 'var(--danger)' }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'var(--danger-bg)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'none')}>
                        <Trash2 size={12} style={{ marginRight: 6 }} />Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
};

export default ManageOffersPage;
