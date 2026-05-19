export default function Loader({ size = 'md', className = '' }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' };
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className={`${sizes[size]} border-2 border-aeroga-500 border-t-transparent rounded-full animate-spin`} />
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <div className="text-center">
        <Loader size="lg" />
        <p className="mt-4 text-slate-400 text-sm">Loading AEROGA...</p>
      </div>
    </div>
  );
}
