import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, Tag, CalendarDays, ClipboardList,
  Building2, Eye, LogOut, Menu, X, ChevronRight,
} from 'lucide-react';

interface NavItem {
  to: string;
  icon: React.ReactNode;
  label: string;
  badge?: number;
  section?: string;
}

const NAV_ITEMS: NavItem[] = [
  { section: 'Admin Panel', to: '', icon: null, label: '' },
  { to: '/admin/dashboard',         icon: <LayoutDashboard size={16} />, label: 'Dashboard' },
  { to: '/admin/offers',            icon: <Tag size={16} />,             label: 'Manage Offers' },
  { to: '/admin/slots',             icon: <CalendarDays size={16} />,    label: 'Manage Slots' },
  { to: '/admin/bookings',          icon: <ClipboardList size={16} />,   label: 'Manage Bookings', badge: 2 },
  { to: '/admin/business',          icon: <Building2 size={16} />,       label: 'Business Profile' },
  { section: 'Public', to: '', icon: null, label: '' },
  { to: '/offers',                  icon: <Eye size={16} />,             label: 'Public Listing' },
];

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside
      style={{
        width: collapsed ? 64 : 'var(--sidebar-w)',
        background: 'var(--brand)',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        transition: 'width 0.25s ease',
        overflow: 'hidden',
        zIndex: 100,
      }}
    >
      {/* Logo */}
      <div style={{
        padding: collapsed ? '20px 16px' : '20px',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        minHeight: 72,
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: 'var(--accent)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 16, flexShrink: 0,
        }}>🏷️</div>
        {!collapsed && (
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, color: '#fff' }}>
              SlotBook Pro
            </div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>Smart Offer Booking</div>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)', flexShrink: 0, padding: 4 }}
        >
          {collapsed ? <ChevronRight size={16} /> : <Menu size={16} />}
        </button>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 0', overflowY: 'auto', overflowX: 'hidden' }}>
        {NAV_ITEMS.map((item, idx) => {
          if (item.section) {
            if (collapsed) return null;
            return (
              <div key={idx} style={{
                fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.3)',
                letterSpacing: '0.8px', textTransform: 'uppercase',
                padding: '12px 20px 6px',
              }}>{item.section}</div>
            );
          }
          return (
            <NavLink
              key={item.to}
              to={item.to}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: 10,
                padding: collapsed ? '10px 20px' : '9px 20px',
                color: isActive ? 'var(--accent)' : 'rgba(255,255,255,0.6)',
                borderLeft: `3px solid ${isActive ? 'var(--accent)' : 'transparent'}`,
                background: isActive ? 'rgba(233,69,96,0.1)' : 'transparent',
                textDecoration: 'none', fontSize: 13, fontWeight: 400,
                transition: 'all 0.15s',
                whiteSpace: 'nowrap', justifyContent: collapsed ? 'center' : 'flex-start',
              })}
            >
              <span style={{ flexShrink: 0 }}>{item.icon}</span>
              {!collapsed && <span style={{ flex: 1 }}>{item.label}</span>}
              {!collapsed && item.badge && (
                <span style={{
                  background: 'var(--accent)', color: '#fff',
                  fontSize: 10, padding: '1px 6px', borderRadius: 99, fontWeight: 600,
                }}>{item.badge}</span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div style={{ padding: '14px 20px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: '50%',
            background: 'var(--accent)', color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, fontWeight: 700, flexShrink: 0,
          }}>{user?.name?.[0] ?? 'A'}</div>
          {!collapsed && (
            <>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 500, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user?.name}
                </div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>Administrator</div>
              </div>
              <button onClick={handleLogout} title="Logout"
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)', padding: 4 }}>
                <LogOut size={15} />
              </button>
            </>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
