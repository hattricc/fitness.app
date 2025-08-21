export class YouTubeHelper {
  /**
   * Extracts the video ID from various YouTube URL formats
   * @param url - YouTube URL (watch, shorts, youtu.be, etc.)
   * @returns Video ID or null if invalid
   */
  static extractVideoId(url: string): string | null {
    if (!url) return null;
    
    // Regular expressions for different YouTube URL formats
    const patterns = [
      /^.*(?:youtu\.be\/|v\/|u\/\w\/|shorts\/|watch\?v=|&v=)([^#&?]*).*/,
      /^.*(?:embed\/)([^#&?]*).*/,
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1] && match[1].length === 11) {
        return match[1];
      }
    }
    
    return null;
  }

  /**
   * Generates YouTube thumbnail URL
   * @param url - YouTube URL
   * @param quality - Thumbnail quality (default, mqdefault, hqdefault, sddefault, maxresdefault)
   * @returns Thumbnail URL or null if invalid
   */
  static getThumbnailUrl(url: string, quality: 'default' | 'mqdefault' | 'hqdefault' | 'sddefault' | 'maxresdefault' = 'mqdefault'): string | null {
    const videoId = this.extractVideoId(url);
    if (!videoId) return null;
    
    return `https://img.youtube.com/vi/${videoId}/${quality}.jpg`;
  }

  /**
   * Generates YouTube embed URL for iframes
   * @param url - YouTube URL
   * @param autoplay - Whether to autoplay the video (default: false)
   * @param additionalParams - Additional URL parameters
   * @returns Embed URL or null if invalid
   */
  static getEmbedUrl(
    url: string, 
    autoplay: boolean = false, 
    additionalParams: Record<string, string> = {}
  ): string | null {
    const videoId = this.extractVideoId(url);
    if (!videoId) return null;
    
    const params = new URLSearchParams();
    
    if (autoplay) {
      params.append('autoplay', '1');
    }
    
    // Add additional parameters
    Object.entries(additionalParams).forEach(([key, value]) => {
      params.append(key, value);
    });
    
    const queryString = params.toString();
    return `https://www.youtube.com/embed/${videoId}${queryString ? `?${queryString}` : ''}`;
  }

  /**
   * Generates YouTube watch URL
   * @param videoId - YouTube video ID
   * @returns Watch URL
   */
  static getWatchUrl(videoId: string): string {
    return `https://www.youtube.com/watch?v=${videoId}`;
  }

  /**
   * Generates YouTube Shorts URL
   * @param videoId - YouTube video ID
   * @returns Shorts URL
   */
  static getShortsUrl(videoId: string): string {
    return `https://www.youtube.com/shorts/${videoId}`;
  }

  /**
   * Checks if a URL is a valid YouTube URL
   * @param url - URL to check
   * @returns True if valid YouTube URL
   */
  static isValidYouTubeUrl(url: string): boolean {
    return this.extractVideoId(url) !== null;
  }

  /**
   * Gets the best available thumbnail URL (tries maxresdefault first, falls back to hqdefault)
   * @param url - YouTube URL
   * @returns Best available thumbnail URL or null if invalid
   */
  static getBestThumbnailUrl(url: string): string | null {
    const videoId = this.extractVideoId(url);
    if (!videoId) return null;
    
    // Try maxresdefault first, then hqdefault as fallback
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  }

  /**
   * Gets a fallback thumbnail URL (hqdefault) if maxresdefault is not available
   * @param url - YouTube URL
   * @returns Fallback thumbnail URL or null if invalid
   */
  static getFallbackThumbnailUrl(url: string): string | null {
    return this.getThumbnailUrl(url, 'hqdefault');
  }
}
