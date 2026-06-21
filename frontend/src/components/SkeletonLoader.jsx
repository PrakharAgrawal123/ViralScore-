export default function SkeletonLoader() {
  return (
    <div className="space-y-6 animate-pulse p-1">
      {/* Circle Shimmer */}
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="h-40 w-40 rounded-full shimmer-bg" />
        <div className="h-5 w-28 rounded-lg shimmer-bg" />
      </div>

      {/* Reach Badge Shimmer */}
      <div className="flex justify-center">
        <div className="h-6 w-44 rounded-lg shimmer-bg" />
      </div>

      <hr className="border-slate-200 dark:border-slate-800" />

      {/* Sentences Highlight Shimmer */}
      <div className="space-y-3">
        <div className="h-4 w-32 rounded-lg shimmer-bg" />
        <div className="h-12 w-full rounded-2xl shimmer-bg" />
        <div className="h-14 w-full rounded-2xl shimmer-bg" />
        <div className="h-10 w-full rounded-2xl shimmer-bg" />
      </div>

      <hr className="border-slate-200 dark:border-slate-800" />

      {/* AI Rewrite suggestions shimmer */}
      <div className="space-y-3">
        <div className="h-4 w-44 rounded-lg shimmer-bg" />
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-3">
          <div className="h-3 w-1/4 rounded shimmer-bg" />
          <div className="h-8 w-full rounded-xl shimmer-bg" />
          <div className="h-8 w-full rounded-xl shimmer-bg" />
          <div className="h-10 w-full rounded-xl shimmer-bg" />
        </div>
      </div>
    </div>
  );
}
