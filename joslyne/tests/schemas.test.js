import { describe, expect, it } from 'vitest';
import { aboutSchema, loginSchema, photoSchema, setupPasswordSchema } from '../lib/security.js';

describe('cms schemas', () => {
  it('requires a valid static username login shape', () => {
    expect(() => loginSchema.parse({ username: '../../admin', password: 'password' })).toThrow();
    expect(loginSchema.parse({ username: 'joslyne', password: 'password' }).username).toBe('joslyne');
  });

  it('requires matching strong setup passwords', () => {
    expect(() => setupPasswordSchema.parse({ username: 'joslyne', password: 'short', confirmPassword: 'short' })).toThrow();
    expect(() => setupPasswordSchema.parse({ username: 'joslyne', password: 'long-password-123', confirmPassword: 'different-password-123' })).toThrow();
  });

  it('accepts valid photo metadata', () => {
    const data = photoSchema.parse({ title: 'Portrait', categoryId: 'cat_1', isFeatured: false, isVisible: true });
    expect(data.title).toBe('Portrait');
  });

  it('accepts short in-progress about body', () => {
    const about = aboutSchema.parse({ headline: 'About', body: 'In progress' });
    expect(about.body).toBe('In progress');
  });
});
