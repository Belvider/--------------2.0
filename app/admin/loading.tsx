export default function AdminLoading() {
  return (
    <div className="space-y-4 animate-pulse">
      {/* Hero skeleton */}
      <div className="card px-6 py-7">
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_260px]">
          <div className="space-y-3">
            <div className="h-5 w-24 rounded-full bg-white/[0.06]" />
            <div className="h-10 w-64 rounded-[10px] bg-white/[0.06]" />
            <div className="h-4 w-96 rounded-[10px] bg-white/[0.04]" />
            <div className="mt-4 flex gap-3">
              <div className="h-10 w-36 rounded-full bg-white/[0.06]" />
              <div className="h-10 w-36 rounded-full bg-white/[0.04]" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-20 rounded-[14px] bg-white/[0.04]" style={{ animationDelay: `${i * 50}ms` }} />
            ))}
          </div>
        </div>
      </div>

      {/* Action Center skeleton */}
      <div className="card p-6">
        <div className="mb-5 flex items-center justify-between">
          <div className="h-6 w-48 rounded-[10px] bg-white/[0.06]" />
          <div className="h-6 w-24 rounded-full bg-white/[0.04]" />
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-20 rounded-[14px] bg-white/[0.04]" style={{ animationDelay: `${i * 60}ms` }} />
          ))}
        </div>
      </div>

      {/* KPI grid skeleton */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="card h-24 p-4" style={{ animationDelay: `${i * 40}ms` }}>
            <div className="h-3 w-20 rounded bg-white/[0.06]" />
            <div className="mt-3 h-7 w-12 rounded bg-white/[0.08]" />
          </div>
        ))}
      </div>

      {/* Activity skeleton */}
      <div className="grid gap-4 xl:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="card p-5">
            <div className="mb-4 h-5 w-36 rounded bg-white/[0.06]" />
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, j) => (
                <div key={j} className="h-14 rounded-[10px] bg-white/[0.04]" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
