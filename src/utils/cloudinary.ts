/**
 * Barmantra — Responsive Media Transformer
 */


/**
 * Cloudinary & Dynamic Responsive Image Utility
 * Takes an image URL (Cloudinary, Unsplash, or generic) and applies responsive
 * size, format, and quality parameters based on target viewport width.
 */
export function getResponsiveImageUrl(
  url: string,
  width: number = 800,
  quality: string | number = 'auto',
  format: string = 'auto'
): string {
  if (!url) return url;

  // Cloudinary image transformation
  if (url.includes('cloudinary.com')) {
    const uploadIndex = url.indexOf('/upload/');
    if (uploadIndex !== -1) {
      const prefix = url.substring(0, uploadIndex + 8);
      const suffix = url.substring(uploadIndex + 8);
      const transforms = `w_${width},q_${quality},f_${format},c_limit`;
      return `${prefix}${transforms}/${suffix}`;
    }
  }

  // Unsplash dynamic responsive parameter transformation
  if (url.includes('images.unsplash.com')) {
    try {
      const parsedUrl = new URL(url);
      parsedUrl.searchParams.set('w', width.toString());
      parsedUrl.searchParams.set('q', typeof quality === 'number' ? quality.toString() : '80');
      parsedUrl.searchParams.set('auto', 'format');
      parsedUrl.searchParams.set('fit', 'crop');
      return parsedUrl.toString();
    } catch {
      return url;
    }
  }

  return url;
}
