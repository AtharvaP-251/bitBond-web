import './index.css'
import { Routes, Route } from 'react-router'
import { BrowserRouter as BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { Suspense, lazy } from 'react'
import appStore from './utils/appStore.js'

import Body from './components/Body.jsx'

// Lazy load components for better performance
const Login = lazy(() => import('./components/Login.jsx'))
const Signup = lazy(() => import('./components/Signup.jsx'))
const Profile = lazy(() => import('./components/Profile.jsx'))
const Home = lazy(() => import('./components/Home.jsx'))
const Feed = lazy(() => import('./components/Feed.jsx'))
const ConnectionsPage = lazy(() => import('./components/Connections.jsx'))
const MessagesPage = lazy(() => import('./components/Messages.jsx'))
const NotificationsPage = lazy(() => import('./components/Notifications.jsx'))
const SearchPage = lazy(() => import('./components/Search.jsx'))

// Loading component
const LoadingFallback = () => (
  <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 flex items-center justify-center">
    <div className="text-center animate-fade-in">
      <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-white text-lg">Loading...</p>
    </div>
  </div>
)

function App() {
  return (
    <Provider store={appStore}>
      <BrowserRouter basename="/">
        <Suspense fallback={<LoadingFallback />}>
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
              <Route path="/search" element={<SearchPage />} />
            </Route>
            <Route path="/home" element={<Home />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </Provider>
  )
}

export default App
