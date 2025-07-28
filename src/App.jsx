import './index.css'
import './App.css'
import { Routes, Route } from 'react-router'
import { BrowserRouter as BrouserRouter } from 'react-router-dom'
import Body from './Body.jsx'
import Login from './Login.jsx'
import Profile from './Profile.jsx'

function App() {

  return (
    <>
      <BrouserRouter>
        <Routes>
          <Route>
            <Route path="/" element={<Body />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Routes>
      </BrouserRouter >

    </>
  )
}

export default App
