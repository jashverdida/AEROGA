import { useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Badge from '../ui/Badge';

const pageTitles = {
  '/dashboard': 'Dashboard',
  '/api-keys': 'API Keys',
  '/logs': 'Request Logs',
  '/benefits': 'Benefits',
  '/employees': 'Employees',
};

export default function TopBar() {
  const location = useLocation();
  const { user } = useAuth();
  const title = pageTitles[location.pathname] ?? 'AEROGA';
  const initials = user?.username?.slice(0, 2).toUpperCase() ?? 'U';

  return (
    <header className="h-14 border-b border-slate-800 bg-slate-950 flex items-center justify-between px-6 flex-shrink-0">
      <h1 className="text-base font-semibold text-white">{title}</h1>
      <div className="flex items-center gap-3">
        <Badge variant={user?.role === 'ADMIN' ? 'green' : 'slate'}>{user?.role}</Badge>
        <div className="w-8 h-8 bg-aeroga-700 rounded-full flex items-center justify-center text-white text-xs font-bold">
          {initials}
        </div>
      </div>
    </header>
  );
}
