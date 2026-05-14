import { describe, expect, it } from 'vitest';
import { assertSafeImage, categorySchema, contactSchema, constantTimeEqual, safeRandomName } from '../lib/security.js';

describe('security validation', () => {
  it('rejects invalid contact messages', () => {
    expect(() => contactSchema.parse({ name: 'A', email: 'bad', message: 'short' })).toThrow();
  });

  it('accepts valid categories and coerces sort order', () => {
    const category = categorySchema.parse({ name: 'Weddings', sortOrder: '2', isVisible: true });
    expect(category.sortOrder).toBe(2);
  });

  it('generates safe randomized image names', () => {
    const name = safeRandomName('../../evil.php');
    expect(name).toMatch(/^[0-9]+-[a-f0-9]{24}\.jpg$/);
    expect(name).not.toContain('..');
  });

  it('uses constant-time equality for equal strings', () => {
    expect(constantTimeEqual('abc', 'abc')).toBe(true);
    expect(constantTimeEqual('abc', 'abd')).toBe(false);
  });

  it('rejects unsafe image mime types', () => {
    const file = { type: 'image/svg+xml', size: 10 };
    expect(() => assertSafeImage(file)).toThrow();
  });
});
