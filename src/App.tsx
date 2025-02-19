import { Routes, Route, Navigate } from "react-router-dom"
import { SignInPage } from "./pages/sign-in-page"
import { ChatPage } from "./pages/chat-page"

function App() {

  return (
    <div className='app'>
        <Routes>
          <Route path="/sign-in" element={<SignInPage />} />
          <Route path="/" element={<Navigate replace to="/sign-in" />} />
          <Route path="/chat-page" element={<ChatPage />} />
        </Routes>
    </div>
  )
}

export default App
