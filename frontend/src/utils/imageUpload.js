import api from './api'

export const uploadImage = async (file) => {
  try {
    // Convert file to base64
    const base64 = await convertToBase64(file)
    
    // Upload to Cloudinary via backend
    const response = await api.post('/upload', { image: base64 })
    
    return {
      success: true,
      data: response.data.data
    }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Image upload failed'
    }
  }
}

export const deleteImage = async (publicId) => {
  try {
    await api.delete(`/upload/${publicId}`)
    return { success: true }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Image deletion failed'
    }
  }
}

const convertToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })
}

export const validateImage = (file) => {
  // Check file type
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  if (!validTypes.includes(file.type)) {
    return {
      valid: false,
      message: 'Please upload a valid image file (JPEG, PNG, or WebP)'
    }
  }
  
  // Check file size (max 5MB)
  const maxSize = 5 * 1024 * 1024 // 5MB in bytes
  if (file.size > maxSize) {
    return {
      valid: false,
      message: 'Image size should not exceed 5MB'
    }
  }
  
  return { valid: true }
}
