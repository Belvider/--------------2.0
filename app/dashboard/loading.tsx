export default function LoadingHome() {
  return (
    <div className="space-y-5" aria-label="Завантаження головної сторінки" aria-busy="true">
      <div className="skeleton h-24 rounded-2xl" />
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
        <div className="skeleton h-80 rounded-3xl" />
        <div className="skeleton h-64 rounded-3xl xl:h-80" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <div className="skeleton h-44 rounded-2xl" />
        <div className="skeleton h-44 rounded-2xl" />
        <div className="skeleton hidden h-44 rounded-2xl xl:block" />
      </div>
      <div className="skeleton h-56 rounded-3xl" />
    </div>
  );
}
