export default function LoadingHome() {
  return (
    <div className="space-y-5" aria-label="Завантаження головної сторінки" aria-busy="true">
      <div className="skeleton h-28 rounded-2xl" />
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,0.85fr)]">
        <div className="skeleton h-80 rounded-[20px]" />
        <div className="skeleton h-80 rounded-[20px]" />
      </div>
      <div className="grid grid-cols-3 gap-3 sm:gap-5">
        {[0, 1, 2].map((item) => <div key={item} className="skeleton h-40 rounded-2xl" />)}
      </div>
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <div className="skeleton h-80 rounded-[20px]" />
        <div className="skeleton h-80 rounded-[20px]" />
      </div>
    </div>
  );
}
