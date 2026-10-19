export default function LoadingHome() {
  return (
    <div className="space-y-5" aria-label="Завантаження головної сторінки" aria-busy="true">
      <div className="skeleton h-28 rounded-2xl" />
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
        <div className="skeleton h-96 rounded-3xl" />
        <div className="skeleton h-96 rounded-3xl" />
      </div>
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
        <div className="skeleton h-96 rounded-3xl" />
        <div className="skeleton h-96 rounded-3xl" />
      </div>
      <div className="skeleton h-56 rounded-3xl" />
    </div>
  );
}
