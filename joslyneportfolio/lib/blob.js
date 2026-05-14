import { put, del } from '@vercel/blob';
import sharp from 'sharp';
import { safeRandomName } from './security';

export async function uploadCompressedImage(file) {
  const originalBuffer = Buffer.from(await file.arrayBuffer());
  const baseName = safeRandomName(file.name).replace(/\.(jpg|jpeg|png|webp)$/i, '');

  const image = sharp(originalBuffer, { failOn: 'warning' }).rotate();
  const metadata = await image.metadata();

  const fullBuffer = await image
    .resize({ width: 2200, withoutEnlargement: true })
    .webp({ quality: 82, effort: 5 })
    .toBuffer();

  const thumbBuffer = await sharp(originalBuffer, { failOn: 'warning' })
    .rotate()
    .resize({ width: 700, height: 700, fit: 'cover', withoutEnlargement: true })
    .webp({ quality: 76, effort: 5 })
    .toBuffer();

  const photoPath = `photos/${baseName}.webp`;
  const thumbPath = `thumbs/${baseName}.webp`;

  const [photo, thumb] = await Promise.all([
    put(photoPath, fullBuffer, { access: 'public', contentType: 'image/webp', addRandomSuffix: false }),
    put(thumbPath, thumbBuffer, { access: 'public', contentType: 'image/webp', addRandomSuffix: false })
  ]);

  return {
    imageUrl: photo.url,
    thumbUrl: thumb.url,
    pathname: photo.pathname,
    thumbPath: thumb.pathname,
    width: metadata.width || null,
    height: metadata.height || null
  };
}

export async function deleteBlobPair(photo) {
  const targets = [photo?.pathname, photo?.thumbPath].filter(Boolean);
  if (targets.length) await del(targets);
}
