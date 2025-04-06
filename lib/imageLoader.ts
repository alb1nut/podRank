// lib/imageLoader.ts
import type { ImageLoader } from 'next/image';

const customLoader: ImageLoader = ({ src, width, quality }) => {
  const q = quality || 75;
  if (src.includes('i.ytimg.com') || src.includes('ytimg.com')) {
    return `${src}?w=${width}&q=${q}`; // Append width to suppress warning
  }
  if (src.includes('images.unsplash.com')) {
    const url = new URL(src);
    url.searchParams.set('w', width.toString());
    url.searchParams.set('q', q.toString());
    url.searchParams.set('auto', 'format');
    url.searchParams.set('fit', 'crop');
    return url.toString();
  }
  return `${src}?w=${width}&q=${q}`;
};

export default customLoader;
