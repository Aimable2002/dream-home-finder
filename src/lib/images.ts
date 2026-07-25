import type { Orientation } from "@/lib/api";

/**
 * Reads a File's natural width/height in the browser to classify it as
 * landscape or portrait before it's uploaded. This is what lets the admin
 * and the hero slideshow treat portrait and landscape images differently
 * instead of forcing every image into the same crop.
 */
export function getImageOrientation(file: File): Promise<Orientation> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const orientation: Orientation = img.width >= img.height ? "landscape" : "portrait";
      URL.revokeObjectURL(url);
      resolve(orientation);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not read image dimensions"));
    };
    img.src = url;
  });
}