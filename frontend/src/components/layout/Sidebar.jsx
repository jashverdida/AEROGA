import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Key, ScrollText, Gift, Users, LogOut, Zap } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/api-keys', icon: Key, label: 'API Keys', adminOnly: true },
  { to: '/logs', icon: ScrollText, label: 'Request Logs', adminOnly: true },
  { to: '/benefits', icon: Gift, label: 'Benefits' },
  { to: '/employees', icon: Users, label: 'Employees' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  const isAdmin = user?.role === 'ADMIN';
  const initials = user?.username?.slice(0, 2).toUpperCase() ?? 'U';

  return (
    <aside
      className="w-64 flex-shrink-0 h-screen sticky top-0 flex flex-col overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #071912 0%, #040d09 55%, #071510 100%)' }}
    >
      {/* Dot grid texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(34,197,94,0.12) 1px, transparent 1px)',
          backgroundSize: '22px 22px',
        }}
      />

      {/* Top-left aurora glow */}
      <div
        className="absolute -top-20 -left-12 w-56 h-56 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(34,197,94,0.22) 0%, transparent 70%)' }}
      />

      {/* Bottom-right aurora glow */}
      <div
        className="absolute -bottom-28 -right-10 w-72 h-72 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(21,128,61,0.18) 0%, transparent 70%)' }}
      />

      {/* Decorative arc */}
      <div
        className="absolute top-0 right-0 w-40 h-40 pointer-events-none opacity-10"
        style={{
          background: 'conic-gradient(from 180deg at 100% 0%, rgba(34,197,94,0.6) 0deg, transparent 90deg)',
        }}
      />

      {/* Logo */}
      <div className="relative px-5 py-5 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              background: 'linear-gradient(135deg, #22c55e 0%, #15803d 100%)',
              boxShadow: '0 0 24px rgba(34,197,94,0.35)',
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

      {/* Nav */}
      <nav className="relative flex-1 px-3 py-5 overflow-y-auto">
        <p className="text-[9px] font-bold text-slate-600 uppercase tracking-[0.2em] px-4 mb-3">
          Navigation
        </p>

        <div className="space-y-0.5">
          {navItems.map(({ to, icon: Icon, label, adminOnly }) => {
            if (adminOnly && !isAdmin) return null;
            return (
              <NavLink key={to} to={to} className="block">
                {({ isActive }) => (
                  <span
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer select-none ${
                      isActive ? 'text-white' : 'text-slate-400 hover:text-slate-100'
                    }`}
                    style={
                      isActive
                        ? {
                            background:
                              'linear-gradient(90deg, rgba(34,197,94,0.18) 0%, rgba(34,197,94,0.04) 100%)',
                            borderLeft: '2.5px solid rgba(74,222,128,0.75)',
                            paddingLeft: '13.5px',
                            boxShadow: 'inset 0 0 20px rgba(34,197,94,0.04)',
                          }
                        : {
                            borderLeft: '2.5px solid transparent',
                          }
                    }
                  >
                    <Icon
                      className={`w-4 h-4 flex-shrink-0 transition-colors ${
                        isActive ? 'text-emerald-400' : 'text-slate-500 group-hover:text-slate-300'
                      }`}
                    />
                    <span className="relative">{label}</span>
                    {isActive && (
                      <span
                        className="ml-auto w-1.5 h-1.5 rounded-full"
                        style={{ background: '#4ade80', boxShadow: '0 0 6px #4ade80' }}
                      />
                    )}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>

        {isAdmin && (
          <div className="mt-5 pt-5 border-t border-white/[0.04]">
            <p className="text-[9px] font-bold text-slate-600 uppercase tracking-[0.2em] px-4 mb-3">
              Admin Only
            </p>
          </div>
        )}
      </nav>

      {/* User section */}
      <div className="relative px-3 py-4 border-t border-white/[0.06]">
        <div
          className="flex items-center gap-3 px-3 py-3 mb-2 rounded-xl"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.07)',
          }}
        >
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #22c55e 0%, #15803d 100%)' }}
          >
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-white truncate">{user?.username}</p>
            <p className="text-[11px] font-semibold text-emerald-400 tracking-wide">{user?.role}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:text-red-400 transition-all duration-150"
          style={{ '--tw-ring-color': 'transparent' }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(239,68,68,0.05)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
