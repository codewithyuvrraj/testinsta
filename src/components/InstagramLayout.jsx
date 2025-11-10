import React, { useState, useEffect } from 'react'
import { nhost } from '../lib/nhost'
import { uploadToCloudinary } from '../lib/cloudinary'

// Clear localStorage to prevent quota errors
if (typeof window !== 'undefined') {
  localStorage.removeItem('instagram_posts')
  
  // Add progress animation CSS
  const style = document.createElement('style')
  style.textContent = `
    @keyframes progress {
      0% { transform: translateX(-100%); }
      50% { transform: translateX(0%); }
      100% { transform: translateX(100%); }
    }
  `
  document.head.appendChild(style)
}

const InstagramLayout = () => {
  const [activeTab, setActiveTab] = useState('home')
  const [searchQuery, setSearchQuery] = useState('')
  const [users, setUsers] = useState([])
  const [posts, setPosts] = useState([])
  const [currentUser, setCurrentUser] = useState(null)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [uploadType, setUploadType] = useState('post')
  const [uploadData, setUploadData] = useState({ caption: '', file: null, preview: '' })
  const [likedPosts, setLikedPosts] = useState(new Set())
  const [postLikes, setPostLikes] = useState({})
  const [followers, setFollowers] = useState({})
  const [following, setFollowing] = useState(new Set())
  const [uploadProgress, setUploadProgress] = useState({ isUploading: false, message: '', startTime: null })

  useEffect(() => {
    loadCurrentUser()
    loadUsers()
    loadPosts()
    generateRealTimeData()
  }, [])

  const generateRealTimeData = () => {
    const likes = {}
    const followersData = {}
    
    // Generate random likes for posts
    posts.forEach(post => {
      likes[post.id] = Math.floor(Math.random() * 1000) + 10
    })
    
    // Generate random followers for users
    users.forEach(user => {
      followersData[user.id] = Math.floor(Math.random() * 5000) + 100
    })
    
    setPostLikes(likes)
    setFollowers(followersData)
  }

  const loadCurrentUser = async () => {
    try {
      if (nhost.auth.isAuthenticated) {
        const user = nhost.auth.getUser()
        setCurrentUser(user)
      }
    } catch (error) {
      console.log('Error loading user:', error)
    }
  }

  const loadUsers = async () => {
    // Mock users for demo
    const mockUsers = [
      { id: '1', displayName: 'John Doe', email: 'john@example.com' },
      { id: '2', displayName: 'Jane Smith', email: 'jane@example.com' },
      { id: '3', displayName: 'Mike Johnson', email: 'mike@example.com' },
      { id: '4', displayName: 'Sarah Wilson', email: 'sarah@example.com' }
    ]
    setUsers(mockUsers)
  }

  const loadPosts = async () => {
    // Posts will be loaded from uploads only
    setPosts([])
  }

  const handleLogout = async () => {
    await nhost.auth.signOut()
    window.location.reload()
  }

  const HomeIcon = ({ active }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill={active ? '#FFD700' : 'none'} stroke={active ? '#FFD700' : '#D4AF37'} strokeWidth="2">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9,22 9,12 15,12 15,22"/>
    </svg>
  )

  const SearchIcon = ({ active }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? '#FFD700' : '#D4AF37'} strokeWidth="2">
      <circle cx="11" cy="11" r="8"/>
      <path d="m21 21-4.35-4.35"/>
    </svg>
  )

  const ReelsIcon = ({ active }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill={active ? '#FFD700' : 'none'} stroke={active ? '#FFD700' : '#D4AF37'} strokeWidth="2">
      <polygon points="23 7 16 12 23 17 23 7"/>
      <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
    </svg>
  )

  const MessageIcon = ({ active }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill={active ? '#FFD700' : 'none'} stroke={active ? '#FFD700' : '#D4AF37'} strokeWidth="2">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  )

  const ProfileIcon = ({ active }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill={active ? '#FFD700' : 'none'} stroke={active ? '#FFD700' : '#D4AF37'} strokeWidth="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  )

  const HeartIcon = ({ filled, onClick }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill={filled ? '#FFD700' : 'none'} stroke={filled ? '#FFD700' : '#D4AF37'} strokeWidth="2" onClick={onClick} style={{ cursor: 'pointer' }}>
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  )

  const CommentIcon = ({ onClick }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2" onClick={onClick} style={{ cursor: 'pointer' }}>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  )

  const ShareIcon = ({ onClick }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2" onClick={onClick} style={{ cursor: 'pointer' }}>
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
      <polyline points="16,6 12,2 8,6"/>
      <line x1="12" y1="2" x2="12" y2="15"/>
    </svg>
  )

  const PlusIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2">
      <line x1="12" y1="5" x2="12" y2="19"/>
      <line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  )

  const CameraIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F8FAFC" strokeWidth="2">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
      <circle cx="12" cy="13" r="4"/>
    </svg>
  )

  const VideoIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F8FAFC" strokeWidth="2">
      <polygon points="23 7 16 12 23 17 23 7"/>
      <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
    </svg>
  )

  const tabs = [
    { id: 'home', icon: HomeIcon, label: 'Home' },
    { id: 'search', icon: SearchIcon, label: 'Search' },
    { id: 'reels', icon: ReelsIcon, label: 'Reels' },
    { id: 'messages', icon: MessageIcon, label: 'Messages' },
    { id: 'profile', icon: ProfileIcon, label: 'Profile' }
  ]

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div style={{ padding: '0', background: 'linear-gradient(135deg, #000000, #1a1a1a, #333333)', minHeight: '100vh' }}>
            <div style={{ background: 'rgba(0, 0, 0, 0.9)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(212, 175, 55, 0.3)', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ margin: 0, color: '#FFD700', fontFamily: 'cursive', fontSize: '1.5rem' }}>Instagram</h2>
              <button
                onClick={() => setShowUploadModal(true)}
                style={{
                  background: 'linear-gradient(45deg, #FFD700, #FFA500)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(255, 215, 0, 0.3)'
                }}
              >
                <PlusIcon />
              </button>
            </div>
            
            {/* Stories */}
            <div style={{ background: 'rgba(0, 0, 0, 0.8)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(212, 175, 55, 0.3)', padding: '1rem 0' }}>
              <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', padding: '0 1rem' }}>
                {users.slice(0, 8).map((user, i) => (
                  <div key={user.id || i} style={{
                    minWidth: '66px',
                    textAlign: 'center'
                  }}>
                    <div style={{
                      width: '66px',
                      height: '66px',
                      borderRadius: '50%',
                      background: 'linear-gradient(45deg, #FFD700, #FFA500)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#000',
                      fontWeight: 'bold',
                      marginBottom: '0.25rem',
                      cursor: 'pointer',
                      border: '2px solid #D4AF37'
                    }}>
                      {user.displayName?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <span style={{ fontSize: '0.75rem', color: '#FFD700' }}>
                      {user.displayName?.split(' ')[0] || `user${i+1}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Posts */}
            <div style={{ paddingBottom: '2rem' }}>
              {posts.length > 0 ? posts.map((post, i) => {
                const postId = post.id || i
                const isLiked = likedPosts.has(postId)
                const likesCount = postLikes[postId] || Math.floor(Math.random() * 1000) + 10
                
                return (
                  <div key={postId} style={{
                    background: 'rgba(0, 0, 0, 0.9)',
                    backdropFilter: 'blur(10px)',
                    marginBottom: '1rem',
                    border: '1px solid rgba(212, 175, 55, 0.3)',
                    borderRadius: '12px',
                    overflow: 'hidden'
                  }}>
                    <div style={{ padding: '1rem', borderBottom: '1px solid rgba(212, 175, 55, 0.2)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(45deg, #FFD700, #FFA500)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontSize: '0.9rem', fontWeight: 'bold' }}>
                          {post.user?.displayName?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div>
                          <span style={{ color: '#FFD700', fontWeight: '600', fontSize: '0.9rem' }}>
                            {post.user?.displayName || 'User'}
                          </span>
                          <div style={{ color: '#D4AF37', fontSize: '0.7rem' }}>
                            {followers[post.user?.id] || Math.floor(Math.random() * 5000) + 100} followers
                          </div>
                        </div>
                      </div>
                    </div>
                    <div style={{ height: '300px', background: !post.imageUrl ? 'rgba(212, 175, 55, 0.1)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D4AF37', overflow: 'hidden' }}>
                      {post.imageUrl ? (
                        post.fileType === 'video' ? (
                          <video 
                            src={post.imageUrl} 
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                            controls 
                            muted
                          />
                        ) : (
                          <img 
                            src={post.imageUrl} 
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                            alt={post.title}
                          />
                        )
                      ) : (
                        '📷 ' + (post.title || 'Post')
                      )}
                    </div>
                    <div style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.75rem' }}>
                        <HeartIcon 
                          filled={isLiked} 
                          onClick={() => {
                            const newLiked = new Set(likedPosts)
                            const newLikes = { ...postLikes }
                            
                            if (isLiked) {
                              newLiked.delete(postId)
                              newLikes[postId] = (newLikes[postId] || likesCount) - 1
                            } else {
                              newLiked.add(postId)
                              newLikes[postId] = (newLikes[postId] || likesCount) + 1
                            }
                            
                            setLikedPosts(newLiked)
                            setPostLikes(newLikes)
                          }}
                        />
                        <CommentIcon onClick={() => alert('Comments feature coming soon!')} />
                        <ShareIcon onClick={() => alert('Share feature coming soon!')} />
                      </div>
                      <div style={{ color: '#FFD700', fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: '600' }}>
                        {postLikes[postId] || likesCount} likes
                      </div>
                      <p style={{ color: '#FFD700', margin: 0, fontSize: '0.9rem' }}>
                        <strong>{post.user?.displayName || 'User'}</strong> <span style={{ color: '#D4AF37' }}>{post.content || 'Sample post caption...'}</span>
                      </p>
                    </div>
                  </div>
                )
              }) : (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#D4AF37' }}>
                  No posts yet. Start following people to see their posts!
                </div>
              )}
            </div>
          </div>
        )

      case 'search':
        const filteredUsers = users.filter(user => 
          user.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchQuery.toLowerCase())
        )
        
        return (
          <div style={{ background: 'linear-gradient(135deg, #000000, #1a1a1a, #333333)', minHeight: '100vh' }}>
            <div style={{ background: 'rgba(0, 0, 0, 0.9)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(212, 175, 55, 0.3)', padding: '1rem' }}>
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: '1px solid rgba(212, 175, 55, 0.5)',
                  background: 'rgba(0, 0, 0, 0.7)',
                  color: '#FFD700',
                  fontSize: '1rem'
                }}
              />
            </div>
            
            <div style={{ padding: '1rem' }}>
              <h3 style={{ color: '#FFD700', marginBottom: '1rem', fontSize: '1rem', fontWeight: '600' }}>Suggested for you</h3>
              {filteredUsers.length > 0 ? filteredUsers.map((user, i) => {
                const userId = user.id || i
                const isFollowing = following.has(userId)
                
                return (
                  <div key={userId} style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0.75rem 0',
                    borderBottom: '1px solid rgba(212, 175, 55, 0.2)'
                  }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'linear-gradient(45deg, #FFD700, #FFA500)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', marginRight: '0.75rem', fontSize: '0.9rem', fontWeight: 'bold' }}>
                      {user.displayName?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ color: '#FFD700', fontWeight: '600', fontSize: '0.9rem' }}>
                        {user.displayName || 'User'}
                      </div>
                      <div style={{ color: '#D4AF37', fontSize: '0.8rem' }}>
                        {followers[userId] || Math.floor(Math.random() * 5000) + 100} followers
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        const newFollowing = new Set(following)
                        if (isFollowing) {
                          newFollowing.delete(userId)
                        } else {
                          newFollowing.add(userId)
                        }
                        setFollowing(newFollowing)
                      }}
                      style={{
                        padding: '0.5rem 1rem',
                        background: isFollowing ? 'rgba(212, 175, 55, 0.2)' : 'linear-gradient(45deg, #FFD700, #FFA500)',
                        border: isFollowing ? '1px solid #D4AF37' : 'none',
                        borderRadius: '4px',
                        color: isFollowing ? '#D4AF37' : '#000',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        fontWeight: '600'
                      }}
                    >
                      {isFollowing ? 'Following' : 'Follow'}
                    </button>
                  </div>
                )
              }) : (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#D4AF37' }}>
                  {searchQuery ? 'No users found' : 'No users available'}
                </div>
              )}
            </div>
          </div>
        )

      case 'reels':
        return (
          <div style={{ padding: '1rem', background: 'linear-gradient(135deg, #000000, #1a1a1a, #333333)', minHeight: '100vh' }}>
            <h2 style={{ color: '#FFD700', textAlign: 'center', marginBottom: '1rem' }}>🎬 Reels</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
              {[1,2,3,4,5,6].map(i => (
                <div key={i} style={{
                  aspectRatio: '9/16',
                  background: 'linear-gradient(45deg, #000, #333)',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFD700',
                  cursor: 'pointer',
                  position: 'relative'
                }}>
                  <span style={{ fontSize: '2rem' }}>▶️</span>
                  <div style={{ position: 'absolute', bottom: '0.5rem', left: '0.5rem', fontSize: '0.8rem', color: '#D4AF37' }}>
                    Reel {i}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case 'messages':
        return (
          <div style={{ padding: '1rem', background: 'linear-gradient(135deg, #000000, #1a1a1a, #333333)', minHeight: '100vh' }}>
            <h2 style={{ color: '#FFD700', marginBottom: '1rem' }}>💬 Messages</h2>
            {[1,2,3,4].map(i => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'center',
                padding: '1rem',
                background: 'rgba(212, 175, 55, 0.1)',
                border: '1px solid rgba(212, 175, 55, 0.3)',
                borderRadius: '12px',
                marginBottom: '0.5rem',
                cursor: 'pointer'
              }}>
                <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'linear-gradient(45deg, #FFD700, #FFA500)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', marginRight: '1rem', fontWeight: 'bold' }}>
                  U{i}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: '#FFD700', fontWeight: '600' }}>user{i}</div>
                  <div style={{ color: '#D4AF37', fontSize: '0.9rem' }}>Last message preview...</div>
                </div>
                <div style={{ color: '#D4AF37', fontSize: '0.8rem' }}>2m</div>
              </div>
            ))}
          </div>
        )

      case 'profile':
        return (
          <div style={{ padding: '1rem', background: 'linear-gradient(135deg, #000000, #1a1a1a, #333333)', minHeight: '100vh' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'linear-gradient(45deg, #FFD700, #FFA500)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', margin: '0 auto 1rem', fontSize: '2rem' }}>
                👤
              </div>
              <h2 style={{ color: '#FFD700', margin: '0 0 0.5rem 0' }}>Your Profile</h2>
              <p style={{ color: '#D4AF37', margin: 0 }}>@{currentUser?.displayName?.toLowerCase().replace(' ', '') || 'username'}</p>
              
              <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', margin: '1rem 0' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ color: '#FFD700', fontWeight: '600' }}>{posts.length}</div>
                  <div style={{ color: '#D4AF37', fontSize: '0.9rem' }}>Posts</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ color: '#FFD700', fontWeight: '600' }}>{Math.floor(Math.random() * 2000) + 500}</div>
                  <div style={{ color: '#D4AF37', fontSize: '0.9rem' }}>Followers</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ color: '#FFD700', fontWeight: '600' }}>{following.size}</div>
                  <div style={{ color: '#D4AF37', fontSize: '0.9rem' }}>Following</div>
                </div>
              </div>

              <button
                onClick={handleLogout}
                style={{
                  padding: '0.5rem 1rem',
                  background: 'rgba(212, 175, 55, 0.2)',
                  border: '1px solid rgba(212, 175, 55, 0.5)',
                  borderRadius: '6px',
                  color: '#FFD700',
                  cursor: 'pointer',
                  marginBottom: '1rem'
                }}
              >
                Settings
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
              {posts.filter(post => post.user?.id === currentUser?.id).slice(0, 6).map((post, i) => (
                <div key={post.id || i} style={{
                  aspectRatio: '1',
                  background: !post.imageUrl ? 'linear-gradient(45deg, #000, #333)' : 'transparent',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFD700',
                  cursor: 'pointer',
                  overflow: 'hidden'
                }}>
                  {post.imageUrl ? (
                    post.fileType === 'video' ? (
                      <video 
                        src={post.imageUrl} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        muted
                      />
                    ) : (
                      <img 
                        src={post.imageUrl} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        alt={post.title}
                      />
                    )
                  ) : (
                    '📷'
                  )}
                </div>
              ))}
              {Array.from({ length: Math.max(0, 6 - posts.filter(post => post.user?.id === currentUser?.id).length) }, (_, i) => (
                <div key={`empty-${i}`} style={{
                  aspectRatio: '1',
                  background: 'linear-gradient(45deg, #000, #333)',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#D4AF37'
                }}>
                  📷
                </div>
              ))}
            </div>
          </div>
        )

      default:
        return null
    }
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setUploadData(prev => ({ ...prev, file }))
      const reader = new FileReader()
      reader.onload = (e) => setUploadData(prev => ({ ...prev, preview: e.target.result }))
      reader.readAsDataURL(file)
    }
  }

  const handleUpload = async () => {
    if (!uploadData.file || !uploadData.caption) {
      setUploadProgress({ isUploading: false, message: 'Please add a file and caption', startTime: null })
      setTimeout(() => setUploadProgress({ isUploading: false, message: '', startTime: null }), 3000)
      return
    }
    
    const startTime = Date.now()
    setUploadProgress({ isUploading: true, message: 'Preparing upload...', startTime })
    
    try {
      // Upload to Cloudinary
      setUploadProgress({ isUploading: true, message: 'Uploading to Cloudinary...', startTime })
      const fileType = uploadData.file.type.startsWith('video/') ? 'video' : 'image'
      const cloudinaryUrl = await uploadToCloudinary(uploadData.file, fileType)
      
      setUploadProgress({ isUploading: true, message: 'Saving to database...', startTime })
      
      // Save to database if it's a reel
      if (uploadType === 'reel' && fileType === 'video') {
        console.log('🎥 Starting reel database save...')
        
        // Check authentication
        const user = nhost.auth.getUser()
        if (!user) {
          throw new Error('User not logged in. Please sign in first.')
        }
        
        const mutation = `
          mutation InsertReel($video_url: String!, $caption: String, $user_id: uuid!) {
            insert_reels_one(object: { video_url: $video_url, caption: $caption, user_id: $user_id }) {
              id
              video_url
              created_at
            }
          }
        `
        
        const variables = {
          video_url: cloudinaryUrl,
          caption: uploadData.caption || '',
          user_id: user.id
        }
        
        console.log('🔍 Debug Variables:', variables)
        
        const { data, error } = await nhost.graphql.request({
          query: mutation,
          variables
        })
        
        if (error) {
          console.error('❌ GraphQL Error:', error)
          throw error
        }
        
        console.log('✅ Reel saved in database:', data.insert_reels_one)
      }
      
      // Create new post object with Cloudinary URL
      const newPost = {
        id: Date.now().toString(),
        title: uploadData.caption,
        content: uploadData.caption,
        type: uploadType,
        imageUrl: cloudinaryUrl,
        fileType: fileType,
        user: {
          displayName: currentUser?.displayName || 'You',
          id: currentUser?.id || 'current-user'
        },
        createdAt: new Date().toISOString(),
        likes: Math.floor(Math.random() * 50) + 1
      }
      
      setUploadProgress({ isUploading: true, message: 'Finalizing upload...', startTime })
      
      // Add to posts state immediately
      const updatedPosts = [newPost, ...posts]
      setPosts(updatedPosts)
      
      // Initialize likes for new post
      setPostLikes(prev => ({ ...prev, [newPost.id]: newPost.likes }))
      
      const uploadTime = ((Date.now() - startTime) / 1000).toFixed(1)
      setUploadProgress({ isUploading: false, message: `${uploadType} uploaded successfully in ${uploadTime}s!`, startTime: null })
      
      // Reset and close modal after delay
      setTimeout(() => {
        setUploadData({ caption: '', file: null, preview: '' })
        setShowUploadModal(false)
        setUploadProgress({ isUploading: false, message: '', startTime: null })
      }, 2000)
      
    } catch (error) {
      console.error('Upload error:', error)
      const uploadTime = ((Date.now() - startTime) / 1000).toFixed(1)
      setUploadProgress({ isUploading: false, message: `Upload failed after ${uploadTime}s. Please try again.`, startTime: null })
      setTimeout(() => setUploadProgress({ isUploading: false, message: '', startTime: null }), 4000)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #000000, #1a1a1a, #333333)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Main Content */}
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: '60px' }}>
        {renderContent()}
      </div>

      {/* Bottom Navigation */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'rgba(0, 0, 0, 0.9)',
        backdropFilter: 'blur(10px)',
        borderTop: '1px solid rgba(212, 175, 55, 0.3)',
        display: 'flex',
        justifyContent: 'space-around',
        padding: '0.75rem 0',
        zIndex: 1000
      }}>
        {tabs.map(tab => {
          const IconComponent = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.25rem',
                padding: '0.5rem'
              }}
            >
              <IconComponent active={activeTab === tab.id} />
            </button>
          )
        })}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000
        }}>
          <div style={{
            background: 'rgba(0, 0, 0, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '16px',
            padding: '2rem',
            width: '90%',
            maxWidth: '400px',
            border: '1px solid rgba(212, 175, 55, 0.5)'
          }}>
            <h3 style={{ color: '#FFD700', marginBottom: '1rem', textAlign: 'center' }}>Create New {uploadType}</h3>
            
            {/* Upload Progress */}
            {(uploadProgress.isUploading || uploadProgress.message) && (
              <div style={{
                background: 'rgba(212, 175, 55, 0.1)',
                border: '1px solid rgba(212, 175, 55, 0.3)',
                borderRadius: '8px',
                padding: '1rem',
                marginBottom: '1rem',
                textAlign: 'center'
              }}>
                {uploadProgress.isUploading && (
                  <div style={{
                    width: '100%',
                    height: '4px',
                    background: 'rgba(212, 175, 55, 0.2)',
                    borderRadius: '2px',
                    marginBottom: '0.5rem',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: '100%',
                      height: '100%',
                      background: 'linear-gradient(45deg, #FFD700, #FFA500)',
                      borderRadius: '2px',
                      animation: 'progress 2s ease-in-out infinite'
                    }} />
                  </div>
                )}
                <div style={{ color: '#FFD700', fontSize: '0.9rem' }}>
                  {uploadProgress.message}
                  {uploadProgress.startTime && (
                    <span style={{ color: '#D4AF37', marginLeft: '0.5rem' }}>
                      ({((Date.now() - uploadProgress.startTime) / 1000).toFixed(1)}s)
                    </span>
                  )}
                </div>
              </div>
            )}
            
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
              <button
                onClick={() => setUploadType('post')}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  background: uploadType === 'post' ? 'linear-gradient(45deg, #FFD700, #FFA500)' : 'rgba(212, 175, 55, 0.2)',
                  border: '1px solid rgba(212, 175, 55, 0.5)',
                  borderRadius: '8px',
                  color: uploadType === 'post' ? '#000' : '#FFD700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                <CameraIcon /> Post
              </button>
              <button
                onClick={() => setUploadType('reel')}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  background: uploadType === 'reel' ? 'linear-gradient(45deg, #FFD700, #FFA500)' : 'rgba(212, 175, 55, 0.2)',
                  border: '1px solid rgba(212, 175, 55, 0.5)',
                  borderRadius: '8px',
                  color: uploadType === 'reel' ? '#000' : '#FFD700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                <VideoIcon /> Reel
              </button>
            </div>

            <input
              type="file"
              accept={uploadType === 'reel' ? 'video/*' : 'image/*,video/*'}
              onChange={handleFileUpload}
              style={{
                width: '100%',
                padding: '0.75rem',
                background: 'rgba(212, 175, 55, 0.1)',
                border: '1px solid rgba(212, 175, 55, 0.5)',
                borderRadius: '8px',
                color: '#FFD700',
                marginBottom: '1rem'
              }}
            />

            {uploadData.preview && (
              <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
                {uploadType === 'reel' ? (
                  <video src={uploadData.preview} style={{ width: '100%', maxHeight: '200px', borderRadius: '8px' }} controls />
                ) : (
                  <img src={uploadData.preview} style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '8px' }} />
                )}
              </div>
            )}

            <textarea
              placeholder="Write a caption..."
              value={uploadData.caption}
              onChange={(e) => setUploadData(prev => ({ ...prev, caption: e.target.value }))}
              style={{
                width: '100%',
                padding: '0.75rem',
                background: 'rgba(212, 175, 55, 0.1)',
                border: '1px solid rgba(212, 175, 55, 0.5)',
                borderRadius: '8px',
                color: '#FFD700',
                resize: 'vertical',
                minHeight: '80px',
                marginBottom: '1rem'
              }}
            />

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={() => setShowUploadModal(false)}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  background: 'rgba(212, 175, 55, 0.1)',
                  border: '1px solid rgba(212, 175, 55, 0.5)',
                  borderRadius: '8px',
                  color: '#D4AF37',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={uploadProgress.isUploading}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  background: uploadProgress.isUploading ? 'rgba(212, 175, 55, 0.3)' : 'linear-gradient(45deg, #FFD700, #FFA500)',
                  border: 'none',
                  borderRadius: '8px',
                  color: uploadProgress.isUploading ? '#D4AF37' : '#000',
                  cursor: uploadProgress.isUploading ? 'not-allowed' : 'pointer',
                  fontWeight: '600',
                  opacity: uploadProgress.isUploading ? 0.6 : 1
                }}
              >
                {uploadProgress.isUploading ? 'Uploading...' : 'Share'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default InstagramLayout