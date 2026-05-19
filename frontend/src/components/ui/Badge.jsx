const variants = {
  green:  'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  red:    'bg-red-500/20 text-red-400 border-red-500/30',
  amber:  'bg-amber-500/20 text-amber-400 border-amber-500/30',
  blue:   'bg-blue-500/20 text-blue-400 border-blue-500/30',
  indigo: 'bg-aeroga-500/20 text-aeroga-400 border-aeroga-500/30',
  slate:  'bg-slate-700/50 text-slate-300 border-slate-600/30',
  purple: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
};

export default function Badge({ children, variant = 'slate', className = '' }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}

export function methodBadge(method) {
  const map = { GET: 'blue', POST: 'indigo', PUT: 'amber', DELETE: 'red', PATCH: 'purple' };
  return map[method?.toUpperCase()] ?? 'slate';
}

export function statusBadge(status) {
  if (status >= 200 && status < 300) return 'green';
  if (status >= 400 && status < 500) return 'amber';
  if (status >= 500) return 'red';
  return 'slate';
}
