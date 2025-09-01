import './index.css'
import { Routes, Route } from 'react-router'
import { BrowserRouter as BrowserRouter } from 'react-router-dom'
import Body from './components/Body.jsx'
import Login from './components/Login.jsx'
import Signup from './components/Signup.jsx'
import Profile from './components/Profile.jsx'
import HomePage from './components/HomePage.jsx'
import { Provider } from 'react-redux'
import appStore from './utils/appStore.js'
import Feed from './components/Feed.jsx'

// Placeholder components with modern design
const ComingSoonPage = ({ title, description, icon }) => (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 pt-20">
    {/* Background Elements */}
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute -top-40 -right-32 w-80 h-80 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 opacity-5 blur-3xl"></div>
      <div className="absolute -bottom-40 -left-32 w-80 h-80 rounded-full bg-gradient-to-r from-teal-400 to-blue-500 opacity-5 blur-3xl"></div>
    </div>

    <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-8">
        {/* Icon */}
        <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl">
          {icon}
        </div>

        {/* Content */}
        <div className="space-y-4">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {title}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            {description}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 w-full max-w-4xl">
          {[
            { title: "Real-time Updates", desc: "Stay connected with instant notifications" },
            { title: "Smart Matching", desc: "AI-powered developer connections" },
            { title: "Seamless Integration", desc: "Works across all your devices" }
          ].map((feature, index) => (
            <div key={index} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-8 border border-blue-200/50 dark:border-blue-700/50">
            <p className="text-lg text-blue-800 dark:text-blue-200 font-medium">
              🚀 This feature is coming soon! Stay tuned for updates.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

function App() {

  return (
    <>
      <Provider store={appStore}>
        <BrowserRouter basename="/">
          <Routes>
            <Route path="/" element={<Body />}>
              <Route path="/" element={<Feed />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/profile/edit" element={<Profile />} />
              <Route
                path="/connections"
                element={
                  <ComingSoonPage
                    title="Connections"
                    description="Discover and manage your professional developer network. Connect with like-minded developers, build meaningful relationships, and grow your career together."
                    icon={
                      <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    }
                  />
                }
              />
              <Route
                path="/messages"
                element={
                  <ComingSoonPage
                    title="Messages"
                    description="Start conversations with your connections. Share ideas, collaborate on projects, and build lasting professional relationships through seamless messaging."
                    icon={
                      <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    }
                  />
                }
              />
              <Route
                path="/notifications"
                element={
                  <ComingSoonPage
                    title="Notifications"
                    description="Stay updated with real-time notifications about new connections, messages, and opportunities. Never miss an important update in your developer journey."
                    icon={
                      <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-3.5-3.5a5.5 5.5 0 00-11 0L1 17h5m4 0v1a3 3 0 11-6 0v-1m6 0H9" />
                      </svg>
                    }
                  />
                }
              />
            </Route>
            <Route path="/home" element={<HomePage />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    </>
  )
}

export default App
