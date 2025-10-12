/**
 * Vitest Setup File
 * 
 * This file is run before all tests to set up the testing environment.
 */

import '@testing-library/jest-dom/vitest';

// Mock scrollIntoView for jsdom (not available in jsdom)
Element.prototype.scrollIntoView = vi.fn();

