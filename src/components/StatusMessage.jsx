import { AlertCircle, CheckCircle2, CloudSun, Info, LoaderCircle } from 'lucide-react'

function renderStatusIcon(type) {
  if (type === 'loading') {
    return <LoaderCircle className="spin-icon" />
  }

  if (type === 'success') {
    return <CheckCircle2 />
  }

  if (type === 'error') {
    return <AlertCircle />
  }

  if (type === 'empty') {
    return <CloudSun />
  }

  return <Info />
}

function StatusMessage({ type = 'info', title, children }) {
  return (
    <section
      className={`status-card status-card-${type}`}
      role={type === 'error' ? 'alert' : 'status'}
      aria-live={type === 'error' || type === 'loading' ? 'assertive' : 'polite'}
    >
      <div className="status-icon" aria-hidden="true">
        {renderStatusIcon(type)}
      </div>
      <div className="status-content">
        <p>{title}</p>
        {children ? <div className="status-description">{children}</div> : null}
      </div>
    </section>
  )
}

export default StatusMessage
