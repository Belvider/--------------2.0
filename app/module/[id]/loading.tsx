export default function LoadingModule() {
  return (
    <div className="mx-auto max-w-7xl space-y-4 px-4 py-6 sm:px-6 lg:px-8">
      <div className="skeleton h-32 rounded-2xl" />
      <div className="grid gap-4 lg:grid-cols-[260px_1fr]">
        <div className="skeleton h-72 rounded-2xl" />
        <div className="skeleton h-72 rounded-2xl" />
      </div>
      <div className="skeleton h-80 rounded-2xl" />
    </div>
  );
}
