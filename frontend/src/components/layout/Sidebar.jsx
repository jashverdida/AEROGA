import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Key, ScrollText, Gift, Users } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

// ── Layout constants ─────────────────────────────────────────────────────────
const COMPACT_W = 64;
const FULL_W    = 276;
const LOGO_H    = 72;   // logo section — set explicitly
const ITEM_H    = 54;   // each nav row — set explicitly
const ORB_D     = 30;   // orb diameter
const ORB_R     = 15;   // orb radius
const ICON_SZ   = 13;   // icon inside orb
const L         = 5;    // orbX for left  items (center = 5+15 = 20)
const R         = 29;   // orbX for right items (center = 29+15 = 44)

// All nav items in one list — zigzag alternates L/R
const allNav = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard',    orbX: L },
  { to: '/benefits',  icon: Gift,            label: 'Benefits',     orbX: R },
  { to: '/employees', icon: Users,           label: 'Employees',    orbX: L },
  { to: '/api-keys',  icon: Key,             label: 'API Keys',     orbX: R, adminOnly: true },
  { to: '/logs',      icon: ScrollText,      label: 'Request Logs', orbX: L, adminOnly: true },
];

// Center-Y of item i
const itemCY = (i) => LOGO_H + i * ITEM_H + ITEM_H / 2;

// ── Single nav item ──────────────────────────────────────────────────────────
function NavItem({ to, icon: Icon, label, orbX, expanded }) {
  const [hovered, setHovered] = useState(false);

  return (
    <NavLink
      to={to}
      className="relative block"
      style={{ height: `${ITEM_H}px` }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {({ isActive }) => {
        const lit = isActive || hovered;
        return (
          <span
            className="flex items-center h-full"
            style={{
              paddingLeft: `${orbX}px`,
              background: isActive
                ? 'linear-gradient(90deg, rgba(34,197,94,0.13), rgba(34,197,94,0.02))'
                : hovered
                  ? 'rgba(255,255,255,0.03)'
                  : 'transparent',
              transition: 'background 200ms ease',
            }}
          >
            {/* ── Orb with icon inside ── */}
            <span
              style={{
                width:  `${ORB_D}px`,
                height: `${ORB_D}px`,
                borderRadius: '50%',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 300ms ease',
                background: lit
                  ? 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)'
                  : 'rgba(34,197,94,0.12)',
                boxShadow: isActive
                  ? '0 0 12px #4ade80, 0 0 28px rgba(74,222,128,0.55), 0 0 52px rgba(74,222,128,0.2)'
                  : hovered
                    ? '0 0 9px #4ade80, 0 0 20px rgba(74,222,128,0.38)'
                    : '0 0 0 1px rgba(34,197,94,0.2)',
                transform: lit ? 'scale(1.1)' : 'scale(1)',
              }}
            >
              <Icon
                style={{
                  width:  `${ICON_SZ}px`,
                  height: `${ICON_SZ}px`,
                  flexShrink: 0,
                  transition: 'all 250ms ease',
                  // Black on bright orb, glowing green on dim orb
                  color: lit ? '#000000' : '#22c55e',
                  filter: lit
                    ? 'none'
                    : 'drop-shadow(0 0 3px rgba(34,197,94,0.7))',
                }}
              />
            </span>

            {/* ── Label (visible only when expanded) ── */}
            <span
              style={{
                marginLeft: '14px',
                fontSize: '13.5px',
                fontWeight: '500',
                letterSpacing: '0.01em',
                color: lit ? '#ffffff' : '#94a3b8',
                whiteSpace: 'nowrap',
                opacity: expanded ? 1 : 0,
                transition: expanded
                  ? 'opacity 180ms ease 160ms, color 200ms ease'
                  : 'opacity 60ms ease, color 200ms ease',
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

// ── Sidebar ──────────────────────────────────────────────────────────────────
export default function Sidebar() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const isAdmin = user?.role === 'ADMIN';

  const visibleNav = allNav.filter((item) => !item.adminOnly || isAdmin);

  // Build SVG line segments connecting adjacent orb centres
  const lines = visibleNav.slice(0, -1).map((item, i) => ({
    x1: item.orbX + ORB_R,
    y1: itemCY(i),
    x2: visibleNav[i + 1].orbX + ORB_R,
    y2: itemCY(i + 1),
  }));

  return (
    <aside
      className="fixed left-0 top-0 h-screen z-50 flex flex-col overflow-hidden"
      style={{
        width: open ? `${FULL_W}px` : `${COMPACT_W}px`,
        transition: 'width 320ms cubic-bezier(0.4, 0, 0.2, 1)',
        background: 'linear-gradient(165deg, #071912 0%, #040d09 52%, #071510 100%)',
        WebkitMaskImage: `linear-gradient(to right, black 0%, black ${open ? '84%' : '90%'}, transparent 100%)`,
        maskImage:       `linear-gradient(to right, black 0%, black ${open ? '84%' : '90%'}, transparent 100%)`,
        boxShadow: open
          ? '12px 0 48px rgba(0,0,0,0.65), 4px 0 16px rgba(34,197,94,0.06)'
          : '4px 0 20px rgba(0,0,0,0.45)',
      }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {/* Dot-grid texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(34,197,94,0.11) 1px, transparent 1px)',
          backgroundSize: '22px 22px',
        }}
      />

      {/* Aurora glow blobs */}
      <div className="absolute pointer-events-none" style={{ top: '-80px', left: '-50px', width: '224px', height: '224px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(34,197,94,0.2) 0%, transparent 70%)' }} />
      <div className="absolute pointer-events-none" style={{ bottom: '-110px', right: '-44px', width: '288px', height: '288px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(21,128,61,0.15) 0%, transparent 70%)' }} />

      {/* ── SVG zigzag connector lines ── */}
      <svg
        className="absolute pointer-events-none"
        style={{ top: 0, left: 0, width: `${FULL_W}px`, height: '100%', overflow: 'visible', zIndex: 1 }}
        aria-hidden="true"
      >
        <defs>
          <filter id="lg">
            <feGaussianBlur stdDeviation="1.8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {lines.map((ln, i) => (
          <line
            key={i}
            x1={ln.x1} y1={ln.y1}
            x2={ln.x2} y2={ln.y2}
            stroke="rgba(74,222,128,0.4)"
            strokeWidth="1.5"
            strokeLinecap="round"
            filter="url(#lg)"
          />
        ))}
      </svg>

      {/* ── Logo ── */}
      <div
        className="relative border-b border-white/[0.06] flex items-center"
        style={{ height: `${LOGO_H}px`, paddingLeft: '12px', flexShrink: 0, zIndex: 2 }}
      >
        <img
          src="/AEROGA.png"
          alt="AEROGA"
          style={{
            width: '52px',
            height: '52px',
            objectFit: 'contain',
            flexShrink: 0,
            filter: 'drop-shadow(0 0 10px rgba(74,222,128,0.85)) drop-shadow(0 0 22px rgba(34,197,94,0.4))',
          }}
        />

        <div
          style={{
            marginLeft: '11px',
            opacity: open ? 1 : 0,
            transition: open ? 'opacity 180ms ease 140ms' : 'opacity 70ms ease',
            whiteSpace: 'nowrap',
          }}
        >
          <p style={{ color: 'white', fontWeight: '700', fontSize: '15px', letterSpacing: '0.12em' }}>AEROGA</p>
          <p style={{ color: 'rgba(74,222,128,0.6)', fontSize: '10px', fontWeight: '600', letterSpacing: '0.18em', textTransform: 'uppercase', marginTop: '1px' }}>by VERPTO</p>
        </div>
      </div>

      {/* ── Nav items (single continuous zigzag) ── */}
      <div style={{ position: 'relative', zIndex: 2, flexShrink: 0 }}>
        {visibleNav.map((item) => (
          <NavItem key={item.to} {...item} expanded={open}  />
        ))}
      </div>
    </aside>
  );
}
