import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Key, ScrollText, Gift, Users, Zap } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

// ── Layout constants (must match rendered heights exactly) ──────────────────
const COMPACT_W = 60;
const FULL_W     = 272;
const LOGO_H     = 72;   // logo section height (set explicitly below)
const SECT_H     = 32;   // "NAVIGATION" label row height
const ITEM_H     = 44;   // each nav item row height
const ADMIN_SEP  = 40;   // "ADMIN" separator row height
const ORB_D      = 14;   // orb diameter  →  radius = 7
const ORB_R      = 7;

// Alternating left / right orbX values produce the zig-zag
const L = 10;   // left  orb x
const R = 36;   // right orb x

const generalNav = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard',    orbX: L },
  { to: '/benefits',  icon: Gift,            label: 'Benefits',     orbX: R },
  { to: '/employees', icon: Users,           label: 'Employees',    orbX: L },
];

const adminNav = [
  { to: '/api-keys',  icon: Key,             label: 'API Keys',     orbX: R },
  { to: '/logs',      icon: ScrollText,      label: 'Request Logs', orbX: L },
];

// ── Orb centre-Y for SVG lines ──────────────────────────────────────────────
const baseY   = LOGO_H + SECT_H;
const genCY   = (i) => baseY + i * ITEM_H + ITEM_H / 2;         // general items
const admCY   = (i) => baseY + generalNav.length * ITEM_H + ADMIN_SEP + i * ITEM_H + ITEM_H / 2; // admin items

// ── Single nav item ──────────────────────────────────────────────────────────
function NavItem({ to, icon: Icon, label, orbX, expanded, onNavigate }) {
  const [hovered, setHovered] = useState(false);

  return (
    <NavLink
      to={to}
      className="relative block"
      style={{ height: `${ITEM_H}px` }}
      onClick={onNavigate}
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
            {/* Glowing orb */}
            <span
              style={{
                width:  `${ORB_D}px`,
                height: `${ORB_D}px`,
                borderRadius: '50%',
                flexShrink: 0,
                transition: 'all 300ms ease',
                background: lit ? '#4ade80' : 'rgba(34,197,94,0.18)',
                boxShadow: isActive
                  ? '0 0 10px #4ade80, 0 0 24px rgba(74,222,128,0.55), 0 0 48px rgba(74,222,128,0.2)'
                  : hovered
                    ? '0 0 8px #4ade80, 0 0 18px rgba(74,222,128,0.38)'
                    : 'none',
                transform: lit ? 'scale(1.35)' : 'scale(1)',
              }}
            />

            {/* Icon */}
            <Icon
              style={{
                marginLeft: '14px',
                width: '15px',
                height: '15px',
                flexShrink: 0,
                color: lit ? '#4ade80' : '#475569',
                filter: isActive ? 'drop-shadow(0 0 5px rgba(74,222,128,0.65))' : 'none',
                opacity: expanded ? 1 : 0,
                transition: expanded
                  ? 'opacity 160ms ease 120ms, color 200ms ease, filter 200ms ease'
                  : 'opacity 80ms ease, color 200ms ease',
              }}
            />

            {/* Label */}
            <span
              style={{
                marginLeft: '9px',
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

// ── Main sidebar ─────────────────────────────────────────────────────────────
export default function Sidebar() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const isAdmin = user?.role === 'ADMIN';

  useEffect(() => { setOpen(false); }, [location.pathname]);

  return (
    <aside
      className="fixed left-0 top-0 h-screen z-50 flex flex-col overflow-hidden"
      style={{
        width: open ? `${FULL_W}px` : `${COMPACT_W}px`,
        transition: 'width 320ms cubic-bezier(0.4, 0, 0.2, 1)',
        background: 'linear-gradient(165deg, #071912 0%, #040d09 52%, #071510 100%)',
        WebkitMaskImage: `linear-gradient(to right, black 0%, black ${open ? '84%' : '88%'}, transparent 100%)`,
        maskImage:       `linear-gradient(to right, black 0%, black ${open ? '84%' : '88%'}, transparent 100%)`,
        boxShadow: open
          ? '12px 0 48px rgba(0,0,0,0.65), 4px 0 16px rgba(34,197,94,0.06)'
          : '4px 0 16px rgba(0,0,0,0.4)',
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

      {/* Aurora glows */}
      <div className="absolute pointer-events-none" style={{ top: '-80px', left: '-50px', width: '224px', height: '224px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(34,197,94,0.22) 0%, transparent 70%)' }} />
      <div className="absolute pointer-events-none" style={{ bottom: '-110px', right: '-44px', width: '288px', height: '288px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(21,128,61,0.16) 0%, transparent 70%)' }} />

      {/* ── SVG zig-zag connector lines ──────────────────────────────── */}
      <svg
        className="absolute pointer-events-none"
        style={{ top: 0, left: 0, width: `${FULL_W}px`, height: '100%', overflow: 'visible', zIndex: 1 }}
        aria-hidden="true"
      >
        <defs>
          <filter id="line-glow">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* General nav: Dashboard→Benefits, Benefits→Employees */}
        {generalNav.slice(0, -1).map((item, i) => (
          <line
            key={`gen-${i}`}
            x1={item.orbX + ORB_R}     y1={genCY(i)}
            x2={generalNav[i + 1].orbX + ORB_R} y2={genCY(i + 1)}
            stroke="rgba(74,222,128,0.38)"
            strokeWidth="1.5"
            strokeLinecap="round"
            filter="url(#line-glow)"
          />
        ))}

        {/* Admin nav: API Keys→Request Logs */}
        {isAdmin && adminNav.slice(0, -1).map((item, i) => (
          <line
            key={`adm-${i}`}
            x1={item.orbX + ORB_R}    y1={admCY(i)}
            x2={adminNav[i + 1].orbX + ORB_R} y2={admCY(i + 1)}
            stroke="rgba(74,222,128,0.28)"
            strokeWidth="1.5"
            strokeLinecap="round"
            filter="url(#line-glow)"
          />
        ))}
      </svg>

      {/* ── Logo ─────────────────────────────────────────────────────── */}
      <div
        className="relative border-b border-white/[0.06] flex items-center"
        style={{ height: `${LOGO_H}px`, paddingLeft: '11px', flexShrink: 0, zIndex: 2 }}
      >
        <div
          style={{
            width: '38px', height: '38px', borderRadius: '11px', flexShrink: 0,
            background: 'linear-gradient(135deg, #22c55e 0%, #15803d 100%)',
            boxShadow: '0 0 22px rgba(34,197,94,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <Zap style={{ width: '20px', height: '20px', color: 'white' }} />
        </div>

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

      {/* ── "NAVIGATION" label ───────────────────────────────────────── */}
      <div
        style={{ height: `${SECT_H}px`, paddingLeft: '14px', paddingTop: '14px', flexShrink: 0, position: 'relative', zIndex: 2 }}
      >
        <p style={{ fontSize: '9px', fontWeight: '700', color: '#3f5145', textTransform: 'uppercase', letterSpacing: '0.22em' }}>
          Navigation
        </p>
      </div>

      {/* ── General nav items ────────────────────────────────────────── */}
      <div style={{ position: 'relative', zIndex: 2, flexShrink: 0 }}>
        {generalNav.map((item) => (
          <NavItem key={item.to} {...item} expanded={open} onNavigate={() => setOpen(false)} />
        ))}
      </div>

      {/* ── Admin section ────────────────────────────────────────────── */}
      {isAdmin && (
        <div style={{ position: 'relative', zIndex: 2, flexShrink: 0 }}>
          {/* Admin separator row */}
          <div
            style={{
              height: `${ADMIN_SEP}px`,
              paddingLeft: '14px',
              paddingTop: '16px',
              borderTop: '1px solid rgba(255,255,255,0.04)',
              marginTop: '2px',
            }}
          >
            <p style={{ fontSize: '9px', fontWeight: '700', color: '#3f5145', textTransform: 'uppercase', letterSpacing: '0.22em' }}>
              Admin
            </p>
          </div>

          {adminNav.map((item) => (
            <NavItem key={item.to} {...item} expanded={open} onNavigate={() => setOpen(false)} />
          ))}
        </div>
      )}
    </aside>
  );
}
