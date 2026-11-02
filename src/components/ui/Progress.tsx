export function Progress({ value }: { value: number }) {
  const width = Math.min(100, Math.max(0, value))
  return (
    <div
      className="h-1.5 overflow-hidden rounded-full bg-zinc-100"
      role="progressbar"
      aria-valuenow={width}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div className="h-full rounded-full bg-indigo-500" style={{ width: `${width}%` }} />
    </div>
  )
}
