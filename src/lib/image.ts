// Robust photo decode + downscale for iOS/Android/desktop (HEIC, EXIF-rotated, huge camera files).
async function decode(file: File): Promise<CanvasImageSource & { width: number; height: number }> {
  if (typeof createImageBitmap !== "undefined") {
    try {
      return await createImageBitmap(file, { imageOrientation: "from-image" } as ImageBitmapOptions);
    } catch {
      /* fall through to <img> decoding */
    }
  }
  const url = URL.createObjectURL(file);
  try {
    return await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("decode"));
      img.src = url;
    });
  } finally {
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
}

export async function resizeToCanvas(file: File, max: number) {
  if (file.type && !file.type.startsWith("image/")) throw new Error("not-image");
  const img = await decode(file);
  const scale = Math.min(1, max / Math.max(img.width, img.height));
  const c = document.createElement("canvas");
  c.width = Math.max(1, Math.round(img.width * scale));
  c.height = Math.max(1, Math.round(img.height * scale));
  const ctx = c.getContext("2d");
  if (!ctx) throw new Error("canvas");
  ctx.drawImage(img, 0, 0, c.width, c.height);
  return c;
}

export async function resizeToDataUrl(file: File, max = 1024) {
  return (await resizeToCanvas(file, max)).toDataURL("image/jpeg", 0.85);
}

export async function resizeToBlob(file: File, max = 1600) {
  const c = await resizeToCanvas(file, max);
  return new Promise<Blob>((r, j) => c.toBlob((b) => (b ? r(b) : j(new Error("encode"))), "image/jpeg", 0.85));
}

export const PHOTO_ERROR = "Couldn't read that photo. Try a JPG or PNG, or take a new photo.";
