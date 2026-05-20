import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LogOut, Settings, HelpCircle, Shield } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const pageTitles = {
  '/dashboard': 'Dashboard',
  '/api-keys': 'API Keys',
  '/logs': 'Request Logs',
  '/benefits': 'Benefits',
  '/employees': 'Employees',
};

export default function TopBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);

  const title = pageTitles[location.pathname] ?? 'AEROGA';
  const initials = user?.username?.slice(0, 2).toUpperCase() ?? 'U';

  useEffect(() => {
    function handleClick(e) {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const handleLogout = () => {
    setOpen(false);
    logout();
    navigate('/');
  };

  return (
    <header
      className="h-14 flex items-center justify-between px-6 flex-shrink-0 border-b"
      style={{
        background: 'rgba(6,13,9,0.85)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        borderColor: 'rgba(34,197,94,0.07)',
        position: 'relative',
        zIndex: 40,
      }}
    >
      {/* Page title */}
      <h1 className="text-base font-semibold text-white tracking-wide">{title}</h1>

      {/* Avatar button — Facebook-style: just the circle */}
      <div ref={panelRef}>
        <button
          onClick={() => setOpen((v) => !v)}
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: open
              ? 'linear-gradient(135deg, #4ade80 0%, #15803d 100%)'
              : 'linear-gradient(135deg, #22c55e 0%, #15803d 100%)',
            boxShadow: open
              ? '0 0 0 3px rgba(74,222,128,0.35), 0 0 20px rgba(34,197,94,0.3)'
              : '0 0 0 2px rgba(34,197,94,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            border: 'none',
            transition: 'box-shadow 200ms, transform 150ms',
            transform: open ? 'scale(1.06)' : 'scale(1)',
            flexShrink: 0,
          }}
          onMouseEnter={(e) => {
            if (!open) e.currentTarget.style.boxShadow = '0 0 0 3px rgba(34,197,94,0.3), 0 0 16px rgba(34,197,94,0.2)';
          }}
          onMouseLeave={(e) => {
            if (!open) e.currentTarget.style.boxShadow = '0 0 0 2px rgba(34,197,94,0.2)';
          }}
        >
          <span style={{ fontSize: '12px', fontWeight: 700, color: 'white', letterSpacing: '0.02em' }}>
            {initials}
          </span>
        </button>

        {/* Fixed-position panel — escapes overflow:hidden on parent */}
        {open && (
          <div
            style={{
              position: 'fixed',
              top: '60px',
              right: '16px',
              width: '300px',
              zIndex: 9999,
              background: 'linear-gradient(160deg, #071912 0%, #040d09 100%)',
              border: '1px solid rgba(34,197,94,0.13)',
              borderRadius: '16px',
              boxShadow: '0 24px 60px rgba(0,0,0,0.75), 0 0 0 1px rgba(34,197,94,0.06)',
              overflow: 'hidden',
            }}
          >
            {/* Profile card */}
            <div style={{
              padding: '18px 18px 16px',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                {/* Large avatar */}
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #22c55e 0%, #15803d 100%)',
                  boxShadow: '0 0 22px rgba(34,197,94,0.35)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <span style={{ fontSize: '18px', fontWeight: 800, color: 'white' }}>{initials}</span>
                </div>
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontSize: '15px', fontWeight: 700, color: 'white', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user?.username}
                  </p>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    marginTop: '4px',
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    color: '#4ade80',
                    background: 'rgba(74,222,128,0.09)',
                    border: '1px solid rgba(74,222,128,0.2)',
                    borderRadius: '20px',
                    padding: '2px 8px',
                  }}>
                    <Shield style={{ width: '10px', height: '10px' }} />
                    {user?.role}
                  </div>
                </div>
              </div>
            </div>

            {/* Menu items */}
            <div style={{ padding: '8px' }}>
              {[
                { icon: Settings, label: 'Settings & privacy', sub: 'Account preferences', disabled: true },
                { icon: HelpCircle, label: 'Help & support', sub: 'Documentation, FAQs', disabled: true },
              ].map(({ icon: Icon, label, sub, disabled }) => (
                <button
                  key={label}
                  disabled={disabled}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    background: 'transparent',
                    border: 'none',
                    cursor: disabled ? 'default' : 'pointer',
                    transition: 'background 150ms',
                    opacity: disabled ? 0.45 : 1,
                    textAlign: 'left',
                  }}
                  onMouseEnter={(e) => { if (!disabled) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                >
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.07)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <Icon style={{ width: '17px', height: '17px', color: '#94a3b8' }} />
                  </div>
                  <div>
                    <p style={{ fontSize: '13px', fontWeight: 600, color: '#e2e8f0' }}>{label}</p>
                    <p style={{ fontSize: '11px', color: '#64748b', marginTop: '1px' }}>{sub}</p>
                  </div>
                </button>
              ))}

              {/* Divider */}
              <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)', margin: '6px 4px' }} />

              {/* Sign out */}
              <button
                onClick={handleLogout}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background 150ms',
                  textAlign: 'left',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.07)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
              >
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'rgba(239,68,68,0.09)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <LogOut style={{ width: '16px', height: '16px', color: '#f87171' }} />
                </div>
                <div>
                  <p style={{ fontSize: '13px', fontWeight: 600, color: '#f87171' }}>Log out</p>
                  <p style={{ fontSize: '11px', color: '#64748b', marginTop: '1px' }}>Sign out of AEROGA</p>
                </div>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
