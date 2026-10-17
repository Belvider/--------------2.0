export default function LoadingBrands() {
  return (
    <div className="mx-auto max-w-7xl space-y-5 px-4 py-6 sm:px-6 lg:px-8">
      <div className="skeleton h-72 rounded-[32px]" />
      <div className="skeleton h-72 rounded-[32px]" />
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="skeleton h-[520px] rounded-[32px]" />
        ))}
      </div>
      <div className="skeleton h-32 rounded-[32px]" />
    </div>
  );
}
