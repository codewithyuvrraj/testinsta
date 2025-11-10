export const CLOUD_NAME = 'dn7cpjfyz'
export const UPLOAD_PRESET = 'unsigned_upload'

export async function uploadToCloudinary(file, type = 'image') {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', UPLOAD_PRESET)
  formData.append('cloud_name', CLOUD_NAME)
  
  const endpoint = type === 'video' ? 'video/upload' : 'image/upload'
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${endpoint}`, {
    method: 'POST',
    body: formData
  })

  if (!res.ok) {
    const error = await res.text()
    console.error('❌ Cloudinary upload failed:', error)
    throw new Error('Upload failed')
  }

  const data = await res.json()
  
  if (!data.secure_url) {
    throw new Error('Cloudinary upload failed - no URL returned')
  }
  
  console.log('✅ Uploaded to Cloudinary:', data.secure_url)
  return data.secure_url
}