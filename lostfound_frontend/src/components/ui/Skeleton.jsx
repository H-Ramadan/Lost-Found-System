import React from 'react';

export function SkeletonCard() {
  return (
    <div className="glass-card p-6 space-y-4">
      <div className="flex justify-between">
        <div className="shimmer h-5 w-16 rounded-full" />
        <div className="shimmer h-5 w-5 rounded-md" />
      </div>
      <div className="shimmer h-6 w-3/4 rounded-lg" />
      <div className="shimmer h-4 w-1/3 rounded-md" />
      <div className="space-y-2">
        <div className="shimmer h-3 w-full rounded" />
        <div className="shimmer h-3 w-5/6 rounded" />
        <div className="shimmer h-3 w-2/3 rounded" />
      </div>
      <div className="shimmer h-44 w-full rounded-xl" />
      <div className="flex justify-between pt-3 border-t border-white/5">
        <div className="shimmer h-4 w-28 rounded" />
        <div className="shimmer h-4 w-20 rounded" />
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
