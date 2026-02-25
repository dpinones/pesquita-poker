export default function Loading() {
  return (
    <div className="px-4 pt-8">
      <div className="mx-auto mb-6 h-8 w-48 skeleton" />
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-16 w-full skeleton" />
        ))}
      </div>
    </div>
  )
}
