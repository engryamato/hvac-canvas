/**
 * ID generation utility tests
 */

import { describe, it, expect } from 'vitest';
import { uid } from '../id';

describe('ID Utility', () => {
  describe('uid', () => {
    it('should generate a string', () => {
      const id = uid();
      expect(typeof id).toBe('string');
    });

    it('should generate a 7-character string', () => {
      const id = uid();
      expect(id.length).toBe(7);
    });

    it('should generate unique IDs', () => {
      const id1 = uid();
      const id2 = uid();
      const id3 = uid();
      
      expect(id1).not.toBe(id2);
      expect(id2).not.toBe(id3);
      expect(id1).not.toBe(id3);
    });

    it('should generate alphanumeric IDs', () => {
      const id = uid();
      expect(id).toMatch(/^[a-z0-9]+$/);
    });

    it('should generate many unique IDs', () => {
      const ids = new Set();
      for (let i = 0; i < 1000; i++) {
        ids.add(uid());
      }
      
      // Should have 1000 unique IDs (very unlikely to have collisions)
      expect(ids.size).toBe(1000);
    });
  });
});

