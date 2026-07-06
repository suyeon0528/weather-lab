import { NavLink } from 'react-router'

function NotFoundPage() {
  return (
    <main className="page">
      <section className="info-card">
        <p className="card-label">404</p>
        <h2>페이지를 찾을 수 없습니다.</h2>
        <NavLink className="home-link" to="/">
          홈으로 돌아가기
        </NavLink>
      </section>
    </main>
  )
}

export default NotFoundPage
