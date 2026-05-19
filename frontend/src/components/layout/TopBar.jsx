import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LogOut, ChevronDown } from 'lucide-react';
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
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef(null);

  const title = pageTitles[location.pathname] ?? 'AEROGA';
  const initials = user?.username?.slice(0, 2).toUpperCase() ?? 'U';

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    }
    if (profileOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [profileOpen]);

  const handleLogout = () => {
    setProfileOpen(false);
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
      }}
    >
      {/* Page title */}
      <h1 className="text-base font-semibold text-white tracking-wide">{title}</h1>

      {/* Profile button */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setProfileOpen((v) => !v)}
          className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl transition-all duration-200"
          style={{
            background: profileOpen ? 'rgba(34,197,94,0.1)' : 'rgba(255,255,255,0.04)',
            border: `1px solid ${profileOpen ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.07)'}`,
            boxShadow: profileOpen ? '0 0 16px rgba(34,197,94,0.1)' : 'none',
          }}
        >
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #22c55e 0%, #15803d 100%)' }}
          >
            {initials}
          </div>
          <span className="text-sm font-medium text-slate-300 hidden sm:block">
            {user?.username}
          </span>
          <ChevronDown
            className="w-3.5 h-3.5 text-slate-500 transition-transform duration-200"
            style={{ transform: profileOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
          />
        </button>

        {/* Dropdown */}
        {profileOpen && (
          <div
            className="absolute right-0 top-full mt-2 w-52 rounded-xl overflow-hidden z-50"
            style={{
              background: 'linear-gradient(160deg, #071912 0%, #040d09 100%)',
              border: '1px solid rgba(34,197,94,0.12)',
              boxShadow: '0 24px 48px rgba(0,0,0,0.6), 0 0 0 1px rgba(34,197,94,0.06)',
            }}
          >
            {/* User info */}
            <div className="px-4 py-4 border-b border-white/[0.05]">
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #22c55e 0%, #15803d 100%)', boxShadow: '0 0 16px rgba(34,197,94,0.3)' }}
                >
                  {initials}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{user?.username}</p>
                  <p className="text-xs font-semibold text-emerald-400 tracking-wide">{user?.role}</p>
                </div>
              </div>
            </div>

            {/* Sign out */}
            <div className="p-2">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 transition-all duration-150"
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(239,68,68,0.07)';
                  e.currentTarget.style.color = '#f87171';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#94a3b8';
                }}
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
