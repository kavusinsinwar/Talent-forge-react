import React from "react";

export function SkeletonJobCard() {
  return (
    <div className="bg-[var(--color-surface)] p-4 rounded-[var(--radius-md)] border border-[var(--color-border)] shadow-card space-y-3">
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-[var(--radius-sm)] skeleton-shimmer flex-shrink-0" />
        <div className="flex-1 space-y-1.5">
          <div className="h-4 w-3/4 rounded skeleton-shimmer" />
          <div className="h-3 w-1/2 rounded skeleton-shimmer" />
          <div className="h-3 w-1/3 rounded skeleton-shimmer" />
        </div>
      </div>
      <div className="h-3 w-full rounded skeleton-shimmer" />
      <div className="h-3 w-4/5 rounded skeleton-shimmer" />
      <div className="pt-2 flex items-center justify-between border-t border-[var(--color-border)]">
        <div className="h-5 w-20 rounded-full skeleton-shimmer" />
        <div className="h-4 w-12 rounded skeleton-shimmer" />
      </div>
    </div>
  );
}

export function SkeletonJobDetails() {
  return (
    <div className="bg-[var(--color-surface)] p-6 rounded-[var(--radius-md)] border border-[var(--color-border)] shadow-card space-y-5">
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 rounded-[var(--radius-md)] skeleton-shimmer flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-6 w-3/4 rounded skeleton-shimmer" />
          <div className="h-4 w-1/2 rounded skeleton-shimmer" />
          <div className="h-3 w-1/3 rounded skeleton-shimmer" />
        </div>
      </div>
      <div className="flex gap-2">
        <div className="h-9 w-28 rounded-full skeleton-shimmer" />
        <div className="h-9 w-28 rounded-full skeleton-shimmer" />
      </div>
      <div className="space-y-2 pt-4 border-t border-[var(--color-border)]">
        <div className="h-4 w-full rounded skeleton-shimmer" />
        <div className="h-4 w-5/6 rounded skeleton-shimmer" />
        <div className="h-4 w-4/6 rounded skeleton-shimmer" />
      </div>
    </div>
  );
}

export default SkeletonJobCard;
