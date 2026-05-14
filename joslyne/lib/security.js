import crypto from 'crypto';
import { z } from 'zod';

export const loginSchema = z.object({
  username: z.string().trim().min(1, 'Username is required.').max(120),
  password: z.string().min(1, 'Password is required.').max(200)
});

export const setupPasswordSchema = z.object({
  password: z.string().min(12, 'Password must be at least 12 characters.').max(200),
  confirmPassword: z.string().min(12, 'Confirm password must be at least 12 characters.').max(200)
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match.',
  path: ['confirmPassword']
});

export const categorySchema = z.object({
  name: z.string().trim().min(2).max(80),
  description: z.string().trim().max(800).optional().or(z.literal('')),
  sortOrder: z.coerce.number().int().min(0).max(9999).default(0),
  isVisible: z.coerce.boolean().default(true)
});

export const photoSchema = z.object({
  title: z.string().trim().min(1).max(120),
  alt: z.string().trim().max(180).optional().or(z.literal('')),
  description: z.string().trim().max(1000).optional().or(z.literal('')),
  categoryId: z.string().min(1),
  sortOrder: z.coerce.number().int().min(0).max(9999).default(0),
  isFeatured: z.coerce.boolean().default(false),
  isVisible: z.coerce.boolean().default(true)
});

export const aboutSchema = z.object({
  headline: z.string().trim().min(2).max(120),
  body: z.string().trim().min(2).max(8000),
  imageUrl: z.string().url().optional().or(z.literal(''))
});


export const siteSettingsSchema = z.object({
  brandName: z.string().trim().min(2).max(80),
  instagramUrl: z.string().url().optional().or(z.literal('')),
  contactEmail: z.string().trim().email().optional().or(z.literal('')),
  homepageTitle: z.string().trim().min(2).max(140),
  homepageIntro: z.string().trim().min(2).max(500),
  heroEyebrow: z.string().trim().min(2).max(120),
  heroButtonText: z.string().trim().min(2).max(40),
  heroImageUrl: z.string().url().optional().or(z.literal('')),
  heroImageAlt: z.string().trim().max(160).optional().or(z.literal('')),
  heroLeftImageUrl: z.string().url().optional().or(z.literal('')),
  heroLeftImageAlt: z.string().trim().max(160).optional().or(z.literal('')),
  heroRightImageUrl: z.string().url().optional().or(z.literal('')),
  heroRightImageAlt: z.string().trim().max(160).optional().or(z.literal('')),
  aboutPreviewTitle: z.string().trim().max(120).optional().or(z.literal('')),
  aboutPreviewBody: z.string().trim().max(900).optional().or(z.literal('')),
  aboutPreviewImageUrl: z.string().url().optional().or(z.literal('')),
  gallerySliderTitle: z.string().trim().min(2).max(120),
  gallerySliderIntro: z.string().trim().min(2).max(500)
});

export const contactSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(160),
  message: z.string().trim().min(10).max(4000),
  website: z.string().max(0).optional().or(z.literal(''))
});

export function getAdminUsername() {
  return (process.env.ADMIN_USERNAME || 'joslyne').trim();
}

export function safeRandomName(originalName = 'photo.jpg') {
  const ext = originalName.toLowerCase().match(/\.(jpg|jpeg|png|webp)$/)?.[0] || '.jpg';
  return `${Date.now()}-${crypto.randomBytes(12).toString('hex')}${ext}`;
}

export function assertSafeImage(file) {
  const maxMb = Number(process.env.MAX_UPLOAD_MB || 4);
  const allowed = ['image/jpeg', 'image/png', 'image/webp'];
  if (!file) throw new Error('No image file was uploaded.');
  if (!allowed.includes(file.type)) throw new Error('Only JPG, PNG, and WebP images are allowed.');
  if (file.size > maxMb * 1024 * 1024) throw new Error(`Image must be ${maxMb} MB or smaller after browser compression.`);
}

export function constantTimeEqual(a = '', b = '') {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}
