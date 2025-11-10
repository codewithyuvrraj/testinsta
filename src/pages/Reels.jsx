import React, { useEffect, useState } from 'react'
import { nhost } from '../lib/nhost'

const Reels = () => {
  const [stories, setStories] = useState([])

  const loadStories = async () => {
    const query = `
      query {
        stories(where: {expires_at: {_gt: "now()"}}, order_by: {created_at: desc}) {
          id
          media_url
          media_type
          music_name
          music_artist
          created_at
          user_id
        }
      }
    `
    const res = await nhost.graphql.request(query)
    setStories(res.data?.stories || [])
  }

  useEffect(() => {
    loadStories()
  }, [])

  return (
    <div style={{ padding: 20 }}>
      <h2>Reels/Stories</h2>
      
      {stories.length === 0 ? (
        <p>No active stories</p>
      ) : (
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {stories.map(story => (
            <div key={story.id} style={{ border: '1px solid #ccc', padding: 10, width: 200 }}>
              {story.media_type === 'video' ? (
                <video src={story.media_url} controls style={{ width: '100%' }} />
              ) : (
                <img src={story.media_url} alt="" style={{ width: '100%' }} />
              )}
              {story.music_name && (
                <p>🎵 {story.music_name} - {story.music_artist}</p>
              )}
              <small>{new Date(story.created_at).toLocaleString()}</small>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Reels