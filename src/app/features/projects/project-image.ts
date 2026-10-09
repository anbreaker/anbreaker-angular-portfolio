const SMALL_WIDTH = 800;
const ORIGINAL_WIDTH = 1600;

/**
 * Builds the srcset for a project screenshot: a `-800` variant sits next to every original file.
 */
export const projectImageSrcset = (url: string): string => {
  const small = url.replace(/\.webp$/, `-${SMALL_WIDTH}.webp`);

  return `${small} ${SMALL_WIDTH}w, ${url} ${ORIGINAL_WIDTH}w`;
};
