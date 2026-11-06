const BLOG_IMAGE = /^(\/assets\/images\/blog\/.+?)(?<!-800)\.webp$/;

/** Width of the downscaled `-800.webp` variant generated next to every wide blog image. */
const VARIANT_WIDTH = 800;

/**
 * Width declared for the original file. Blog hero images are exported at 1600px or wider;
 * a wider original only makes the browser pick it a bit later, never render it wrong.
 */
const ORIGINAL_WIDTH = 1600;

/** `sizes` for images that span the article column (920px on desktop, full width on mobile). */
export const BLOG_IMAGE_SIZES = '(min-width: 1100px) 920px, min(100vw - 3rem, 752px)';

/** Builds the `srcset` for a local blog webp, or `undefined` when it has no 800px variant. */
export function blogImageSrcset(url: string): string | undefined {
  const match = BLOG_IMAGE.exec(url);
  if (!match) return undefined;

  return `${match[1]}-${VARIANT_WIDTH}.webp ${VARIANT_WIDTH}w, ${url} ${ORIGINAL_WIDTH}w`;
}
