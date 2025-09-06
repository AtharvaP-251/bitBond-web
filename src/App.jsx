import './index.css'
import { Routes, Route } from 'react-router'
import { BrowserRouter as BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import appStore from './utils/appStore.js'

import Body from './components/Body.jsx'
import Login from './components/Login.jsx'
import Signup from './components/Signup.jsx'
import Profile from './components/Profile.jsx'
import Home from './components/Home.jsx'
import Feed from './components/Feed.jsx'

// Extracted pages
import ConnectionsPage from './components/Connections.jsx'
import MessagesPage from './components/Messages.jsx'
import NotificationsPage from './components/Notifications.jsx'

function App() {
  return (
    <Provider store={appStore}>
      <BrowserRouter basename="/">
        <Routes>
          <Route path="/" element={<Body />}>
            <Route index element={<Home />} />
            <Route path="/feed" element={<Feed />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/edit" element={<Profile />} />
            <Route path="/connections" element={<ConnectionsPage />} />
            <Route path="/messages" element={<MessagesPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
          </Route>
          <Route path="/home" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  )
}

export default App
