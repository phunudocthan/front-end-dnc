// Utility function để xử lý image URLs
export const getImageUrl = (imagePath: string): string => {
  if (!imagePath) return '/default-poster.jpg';
  
  // Nếu đã là full URL
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // Lấy base URL từ environment hoặc fallback
  const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
  
  // Loại bỏ /api nếu có
  const cleanBaseURL = baseURL.replace('/api', '');
  
  // Tạo full URL
  return `${cleanBaseURL}/${imagePath}`;
};

// Utility function cho poster
export const getPosterUrl = (posterPath: string): string => {
  return getImageUrl(posterPath);
};

// Utility function cho video
export const getVideoUrl = (videoPath: string): string => {
  return getImageUrl(videoPath);
}; 