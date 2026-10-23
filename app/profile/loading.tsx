export default function LoadingProfile() {
  return (
    <div className="space-y-4" aria-label="Завантаження профілю" aria-busy="true">
      <div className="skeleton h-48 rounded-2xl sm:h-40" />
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <div className="skeleton h-24 rounded-2xl" />
        <div className="skeleton h-24 rounded-2xl" />
        <div className="skeleton h-24 rounded-2xl" />
        <div className="skeleton h-24 rounded-2xl" />
      </div>
      <div className="skeleton h-72 rounded-2xl" />
    </div>
  );
}
