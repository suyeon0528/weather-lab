import { NavLink } from 'react-router'
import StatusMessage from '../components/StatusMessage'

function NotFoundPage() {
  return (
    <main className="page">
      <StatusMessage type="empty" title="페이지를 찾을 수 없습니다.">
        <NavLink className="btn btn-primary home-link" to="/">
          홈으로 돌아가기
        </NavLink>
      </StatusMessage>
    </main>
  )
}

export default NotFoundPage
