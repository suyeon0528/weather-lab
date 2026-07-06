function StatusMessage({ type = 'info', title, children }) {
  const icons = {
    info: 'ℹ️',
    loading: '',
    success: '✓',
    error: '!',
    empty: '☁️',
  }

  return (
    <section
      className={`status-card status-card-${type}`}
      role={type === 'error' ? 'alert' : 'status'}
      aria-live={type === 'error' || type === 'loading' ? 'assertive' : 'polite'}
    >
      <div className="status-icon" aria-hidden="true">
        {type === 'loading' ? <span className="spinner"></span> : icons[type]}
      </div>
      <div>
        <p>{title}</p>
        {children ? <span>{children}</span> : null}
      </div>
    </section>
  )
}

export default StatusMessage
