import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Key, ScrollText, Gift, Users, Zap } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const generalNav = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/benefits', icon: Gift, label: 'Benefits' },
  { to: '/employees', icon: Users, label: 'Employees' },
];

const adminNav = [
  { to: '/api-keys', icon: Key, label: 'API Keys' },
  { to: '/logs', icon: ScrollText, label: 'Request Logs' },
];

function NavItem({ to, icon: Icon, label, onNavigate }) {
  const [hovered, setHovered] = useState(false);

  return (
    <NavLink
      to={to}
      className="block"
      onClick={onNavigate}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {({ isActive }) => {
        const lit = isActive || hovered;
        return (
          <span
            className="flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
            style={{
              color: lit ? '#ffffff' : '#94a3b8',
              background: isActive
                ? 'linear-gradient(90deg, rgba(34,197,94,0.14), rgba(34,197,94,0.02))'
                : hovered
                  ? 'rgba(255,255,255,0.04)'
                  : 'transparent',
            }}
          >
            {/* Glowing orb */}
            <span
              className="flex-shrink-0 rounded-full"
              style={{
                width: '8px',
                height: '8px',
                flexShrink: 0,
                transition: 'all 300ms ease',
                background: lit ? '#4ade80' : 'rgba(34,197,94,0.18)',
                boxShadow: isActive
                  ? '0 0 10px #4ade80, 0 0 22px rgba(74,222,128,0.5), 0 0 40px rgba(74,222,128,0.2)'
                  : hovered
                    ? '0 0 7px #4ade80, 0 0 14px rgba(74,222,128,0.35)'
                    : 'none',
                transform: lit ? 'scale(1.4)' : 'scale(1)',
              }}
            />

            {/* Icon */}
            <Icon
              className="flex-shrink-0 w-4 h-4"
              style={{
                color: lit ? '#4ade80' : '#475569',
                transition: 'color 200ms ease',
                filter: isActive ? 'drop-shadow(0 0 4px rgba(74,222,128,0.5))' : 'none',
              }}
            />

            {/* Label */}
            <span
              style={{
                transition: 'all 200ms ease',
                textShadow: isActive
                  ? '0 0 14px rgba(74,222,128,0.55)'
                  : hovered
                    ? '0 0 10px rgba(74,222,128,0.3)'
                    : 'none',
              }}
            >
              {label}
            </span>
          </span>
        );
      }}
    </NavLink>
  );
}

export default function Sidebar() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const isAdmin = user?.role === 'ADMIN';

  // Close on route change (back/forward nav)
  useEffect(() => { setOpen(false); }, [location.pathname]);

  return (
    // Outer div: acts as trigger (8px) when closed, container (256px) when open
    <div
      className="fixed left-0 top-0 h-screen z-50"
      style={{ width: open ? '256px' : '8px' }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <aside
        className="absolute left-0 top-0 h-full w-64 flex flex-col overflow-hidden"
        style={{
          transform: open ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 320ms cubic-bezier(0.4, 0, 0.2, 1)',
          background: 'linear-gradient(160deg, #071912 0%, #040d09 55%, #071510 100%)',
          // Fade the right edge into transparency
          WebkitMaskImage: 'linear-gradient(to right, black 0%, black 78%, transparent 100%)',
          maskImage: 'linear-gradient(to right, black 0%, black 78%, transparent 100%)',
          boxShadow: open
            ? '16px 0 48px rgba(0,0,0,0.7), 4px 0 20px rgba(34,197,94,0.06)'
            : 'none',
        }}
      >
        {/* Dot grid texture */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(34,197,94,0.13) 1px, transparent 1px)',
            backgroundSize: '22px 22px',
          }}
        />

        {/* Top-left aurora glow */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: '-80px', left: '-48px',
            width: '220px', height: '220px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(34,197,94,0.24) 0%, transparent 70%)',
          }}
        />

        {/* Bottom-right aurora glow */}
        <div
          className="absolute pointer-events-none"
          style={{
            bottom: '-112px', right: '-40px',
            width: '288px', height: '288px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(21,128,61,0.18) 0%, transparent 70%)',
          }}
        />

        {/* Decorative top-right arc */}
        <div
          className="absolute top-0 right-0 pointer-events-none opacity-[0.08]"
          style={{
            width: '160px', height: '160px',
            background: 'conic-gradient(from 180deg at 100% 0%, rgba(34,197,94,0.8) 0deg, transparent 90deg)',
          }}
        />

        {/* ── Logo ── */}
        <div className="relative px-5 py-5 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                background: 'linear-gradient(135deg, #22c55e 0%, #15803d 100%)',
                boxShadow: '0 0 24px rgba(34,197,94,0.38)',
              }}
            >
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-base tracking-widest">AEROGA</p>
              <p
                className="text-[10px] font-semibold tracking-[0.2em] uppercase"
                style={{ color: 'rgba(74,222,128,0.6)' }}
              >
                by VERPTO
              </p>
            </div>
          </div>
        </div>

        {/* ── Navigation ── */}
        <nav className="relative flex-1 px-3 py-5 overflow-y-auto">
          <p className="text-[9px] font-bold text-slate-600 uppercase tracking-[0.22em] px-4 mb-3">
            Navigation
          </p>
          <div className="space-y-0.5">
            {generalNav.map((item) => (
              <NavItem key={item.to} {...item} onNavigate={() => setOpen(false)} />
            ))}
          </div>

          {isAdmin && (
            <div className="mt-5">
              <div className="border-t border-white/[0.05] pt-5">
                <p className="text-[9px] font-bold text-slate-600 uppercase tracking-[0.22em] px-4 mb-3">
                  Admin
                </p>
              </div>
              <div className="space-y-0.5">
                {adminNav.map((item) => (
                  <NavItem key={item.to} {...item} onNavigate={() => setOpen(false)} />
                ))}
              </div>
            </div>
          )}
        </nav>
      </aside>
    </div>
  );
}
