import './SkeletonCard.css'

export function SkeletonCard() {
  return (
    <div className="skeleton-card" aria-hidden="true">
      <div className="skeleton-poster shimmer" />
      <div className="skeleton-body">
        <div className="skeleton-line shimmer" style={{ width: '78%' }} />
        <div className="skeleton-line shimmer" style={{ width: '45%' }} />
      </div>
    </div>
  )
}
