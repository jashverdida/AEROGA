import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { PageLoader } from '../ui/Loader';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import { ShieldAlert } from 'lucide-react';

export default function ProtectedRoute({ children, requiredRole }) {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) return <PageLoader />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (requiredRole && user?.role !== requiredRole) {
    return (
      <>
        <Sidebar />
        <div className="h-screen flex flex-col" style={{ paddingLeft: '64px' }}>
          <TopBar />
          <main className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <ShieldAlert className="w-12 h-12 text-red-400 mx-auto mb-3" />
              <p className="text-lg font-semibold text-white">Access Denied</p>
              <p className="text-slate-400 text-sm mt-1">You don't have permission to view this page.</p>
            </div>
          </main>
        </div>
      </>
    );
  }

  return (
    <>
      <Sidebar />
      <div className="h-screen flex flex-col overflow-hidden" style={{ paddingLeft: '64px' }}>
        <TopBar />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </>
  );
}
