export default function LoadingState() {
  return (
    <div className="loading-state">
      <div className="loading-grid">
        {/* Profile skeleton */}
        <div className="skeleton-card skeleton-profile">
          <div className="skeleton-avatar" />
          <div className="skeleton-lines">
            <div className="skeleton-line skeleton-w60" />
            <div className="skeleton-line skeleton-w40" />
            <div className="skeleton-line skeleton-w80" />
          </div>
        </div>

        {/* Stats skeleton */}
        <div className="skeleton-card skeleton-stats">
          <div className="skeleton-stat-row">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="skeleton-stat-block">
                <div className="skeleton-circle" />
                <div className="skeleton-line skeleton-w60" />
              </div>
            ))}
          </div>
        </div>

        {/* Tasks skeleton */}
        <div className="skeleton-card skeleton-tasks">
          <div className="skeleton-line skeleton-w40" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton-task-row">
              <div className="skeleton-line skeleton-w80" />
              <div className="skeleton-line skeleton-w60" />
            </div>
          ))}
        </div>
      </div>

      <div className="loading-spinner-row">
        <div className="loading-spinner" />
        <span className="loading-text">Loading action center…</span>
      </div>
    </div>
  );
}
