import React, { useState, useEffect } from 'react'
import { nhost } from './lib/nhost'
import Login from './pages/Login'
import InstagramLayout from './components/InstagramLayout'

const App = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if user is authenticated
        const isAuthenticated = nhost.auth.isAuthenticated()
        if (isAuthenticated) {
          const userData = nhost.auth.getUser()
          setUser(userData)
        } else {
          setUser(null)
        }
      } catch (error) {
        console.log('Auth check error:', error)
        setUser(null)
      }
      setLoading(false)
    }
    checkAuth()
  }, [])

  const handleLogin = () => {
    const userData = nhost.auth.getUser()
    setUser(userData)
  }

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: '#fff'
      }}>
        Loading...
      </div>
    )
  }

  return user ? <InstagramLayout /> : <Login onLogin={handleLogin} />
}

export default App