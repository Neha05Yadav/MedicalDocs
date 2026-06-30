export default function Loading() {
  return (
    <div className="w-full h-full min-h-[500px] flex items-center justify-center bg-transparent">
      <div className="flex flex-col items-center gap-3">
        <div className="size-10 rounded-full border-4 border-slate-200 border-t-[#0891b2] animate-spin" />
        <p className="text-sm font-medium text-slate-500 animate-pulse">Loading module...</p>
      </div>
    </div>
  );
}
