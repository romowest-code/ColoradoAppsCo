export default function Loading() {
  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      {/* Skeleton header */}
      <div className="flex items-center justify-between">
        <div className="h-6 w-32 bg-surface-dark rounded-lg animate-pulse" />
        <div className="h-4 w-28 bg-surface-dark rounded-lg animate-pulse" />
      </div>
      {/* Skeleton cards */}
      {Array.from({ length: 4 }, (_, i) => (
        <div
          key={i}
          className="bg-surface-dark border border-border-dark rounded-xl p-5 space-y-3 animate-pulse"
        >
          <div className="h-5 w-2/3 bg-accent-dark rounded" />
          <div className="h-3 w-full bg-accent-dark rounded" />
          <div className="h-3 w-4/5 bg-accent-dark rounded" />
          <div className="flex gap-2">
            <div className="h-6 w-16 bg-accent-dark rounded-full" />
            <div className="h-6 w-20 bg-accent-dark rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
