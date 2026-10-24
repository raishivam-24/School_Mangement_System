import { describe, it, expect } from 'vitest';
import { cn } from './utils';

describe('Utility cn() helper', () => {
  it('should merge classes and resolve tailwind conflicts', () => {
    const result = cn('px-4 py-2', 'bg-blue-500', { 'text-white': true, 'hidden': false });
    expect(result).toContain('px-4');
    expect(result).toContain('bg-blue-500');
    expect(result).toContain('text-white');
    expect(result).not.toContain('hidden');
  });

  it('should overwrite conflicting tailwind classes cleanly', () => {
    const result = cn('text-sm', 'text-lg');
    expect(result).toBe('text-lg');
  });
});
