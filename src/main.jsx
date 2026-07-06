import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* BrowserRouter는 브라우저 주소창의 URL을 React Router가 읽고 관리하게 해줍니다. */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
