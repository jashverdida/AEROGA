import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Zap } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import Loader from '../components/ui/Loader';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message ?? 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="glass-card p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="w-10 h-10 bg-aeroga-600 rounded-xl flex items-center justify-center mb-4">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Welcome back</h1>
            <p className="text-slate-400 text-sm mt-1">Sign in to your AEROGA account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Email</label>
              <input
                type="email"
                className="input-field"
                placeholder="admin@aeroga.dev"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
              <input
                type="password"
                className="input-field"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <button type="submit" className="btn-primary w-full py-2.5 flex items-center justify-center gap-2" disabled={loading}>
              {loading ? <Loader size="sm" /> : 'Sign in'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-400 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-aeroga-400 hover:text-aeroga-300 font-medium">
              Create one
            </Link>
          </p>

          <div className="mt-6 p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Demo Credentials</p>
            <div className="space-y-1.5 text-xs text-slate-400">
              <div className="flex justify-between">
                <span>Admin access</span>
                <span className="font-mono text-aeroga-400">admin@email.com · any password</span>
              </div>
              <div className="flex justify-between">
                <span>Client access</span>
                <span className="font-mono text-aeroga-400">client@email.com · any password</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
