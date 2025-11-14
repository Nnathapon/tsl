function getYouTubeEmbedUrl(url: string | null): string | null {
  if (!url) return null;
  let videoId = '';
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname === 'youtu.be') {
      videoId = urlObj.pathname.slice(1);
    } else if (urlObj.hostname.includes('youtube.com')) {
      videoId = urlObj.searchParams.get('v') ?? '';
    }
  } catch (error) {
    console.error('Invalid YouTube URL:', error);
    return null;
  }
  
  return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
}
export default getYouTubeEmbedUrl;