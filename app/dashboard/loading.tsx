export default function LoadingDashboard() {
  return (
    <div className="space-y-4">
      <div className="skeleton h-[360px] rounded-[28px]" />
      <div className="skeleton h-[420px] rounded-[28px]" />
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_0.85fr]">
        <div className="skeleton h-[560px] rounded-[28px]" />
        <div className="skeleton h-[560px] rounded-[28px]" />
      </div>
      <div className="skeleton h-[420px] rounded-[28px]" />
      <div className="grid gap-4 xl:grid-cols-2">
        <div className="skeleton h-[420px] rounded-[28px]" />
        <div className="skeleton h-[420px] rounded-[28px]" />
      </div>
    </div>
  );
}
