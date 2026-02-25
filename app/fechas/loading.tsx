export default function FechasLoading() {
  return (
    <div className="px-4 pt-8">
      <div className="mb-4 h-8 w-32 skeleton" />
      <div className="space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-20 w-full skeleton" />
        ))}
      </div>
    </div>
  )
}
