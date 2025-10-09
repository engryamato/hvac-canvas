import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Architecture Tests
 * 
 * These tests validate the dependency flow rules of our 7-layer architecture:
 * 
 * Components → Hooks → Services → Utils → Constants/Types
 * 
 * Rules:
 * 1. Components can import from: Hooks, Services, Utils, Constants, Types
 * 2. Hooks can import from: Services, Utils, Constants, Types (NOT Components)
 * 3. Services can import from: Utils, Constants, Types (NOT Hooks or Components)
 * 4. Utils can import from: Constants, Types (NOT Services, Hooks, or Components)
 * 5. Constants can import from: Types only
 * 6. Types can import from: Nothing (foundation layer)
 * 7. No circular dependencies allowed
 */

describe('Architecture Tests', () => {
  const srcDir = path.join(__dirname, '../src');

  /**
   * Helper function to get all TypeScript files in a directory recursively
   */
  function getTypeScriptFiles(dir: string): string[] {
    const files: string[] = [];
    const items = fs.readdirSync(dir);

    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory() && item !== '__tests__' && item !== 'node_modules') {
        files.push(...getTypeScriptFiles(fullPath));
      } else if (item.endsWith('.ts') || item.endsWith('.tsx')) {
        files.push(fullPath);
      }
    }

    return files;
  }

  /**
   * Helper function to extract import statements from a file
   */
  function getImports(filePath: string): string[] {
    const content = fs.readFileSync(filePath, 'utf-8');
    const importRegex = /import\s+.*?\s+from\s+['"](.+?)['"]/g;
    const imports: string[] = [];
    let match;

    while ((match = importRegex.exec(content)) !== null) {
      imports.push(match[1]);
    }

    return imports;
  }

  /**
   * Helper function to determine the layer of a file
   */
  function getLayer(filePath: string): string {
    const relativePath = path.relative(srcDir, filePath);
    
    if (relativePath.startsWith('components/')) return 'components';
    if (relativePath.startsWith('hooks/')) return 'hooks';
    if (relativePath.startsWith('services/')) return 'services';
    if (relativePath.startsWith('utils/')) return 'utils';
    if (relativePath.startsWith('constants/')) return 'constants';
    if (relativePath.startsWith('types/')) return 'types';
    if (relativePath === 'DrawingCanvas.tsx' || relativePath === 'App.tsx') return 'components';
    
    return 'unknown';
  }

  /**
   * Helper function to check if an import violates dependency rules
   */
  function isViolation(fromLayer: string, importPath: string): boolean {
    // Ignore external imports (not starting with . or /)
    if (!importPath.startsWith('.') && !importPath.startsWith('/')) {
      return false;
    }

    // Determine the target layer from the import path
    let targetLayer = 'unknown';
    if (importPath.includes('/components/') || importPath.includes('../components')) {
      targetLayer = 'components';
    } else if (importPath.includes('/hooks/') || importPath.includes('../hooks')) {
      targetLayer = 'hooks';
    } else if (importPath.includes('/services/') || importPath.includes('../services')) {
      targetLayer = 'services';
    } else if (importPath.includes('/utils/') || importPath.includes('../utils')) {
      targetLayer = 'utils';
    } else if (importPath.includes('/constants/') || importPath.includes('../constants')) {
      targetLayer = 'constants';
    } else if (importPath.includes('/types/') || importPath.includes('../types')) {
      targetLayer = 'types';
    }

    // Check dependency rules
    const rules: Record<string, string[]> = {
      components: ['hooks', 'services', 'utils', 'constants', 'types'],
      hooks: ['services', 'utils', 'constants', 'types'],
      services: ['utils', 'constants', 'types'],
      utils: ['constants', 'types'],
      constants: ['types'],
      types: [],
    };

    const allowedDeps = rules[fromLayer] || [];
    return targetLayer !== 'unknown' && !allowedDeps.includes(targetLayer);
  }

  describe('Dependency Flow Rules', () => {
    it('should not have Components importing from other Components', () => {
      const componentFiles = getTypeScriptFiles(path.join(srcDir, 'components'));
      const violations: string[] = [];

      for (const file of componentFiles) {
        const imports = getImports(file);
        for (const imp of imports) {
          if (imp.includes('/components/') && !imp.includes('DrawingCanvas/index')) {
            violations.push(`${path.basename(file)} imports from ${imp}`);
          }
        }
      }

      expect(violations).toEqual([]);
    });

    it('should not have Hooks importing from Components', () => {
      const hookFiles = getTypeScriptFiles(path.join(srcDir, 'hooks'));
      const violations: string[] = [];

      for (const file of hookFiles) {
        const imports = getImports(file);
        for (const imp of imports) {
          if (imp.includes('/components/') || imp.includes('../components')) {
            violations.push(`${path.basename(file)} imports from ${imp}`);
          }
        }
      }

      expect(violations).toEqual([]);
    });

    it('should not have Services importing from Hooks', () => {
      const serviceFiles = getTypeScriptFiles(path.join(srcDir, 'services'));
      const violations: string[] = [];

      for (const file of serviceFiles) {
        const imports = getImports(file);
        for (const imp of imports) {
          if (imp.includes('/hooks/') || imp.includes('../hooks')) {
            violations.push(`${path.basename(file)} imports from ${imp}`);
          }
        }
      }

      expect(violations).toEqual([]);
    });

    it('should not have Services importing from Components', () => {
      const serviceFiles = getTypeScriptFiles(path.join(srcDir, 'services'));
      const violations: string[] = [];

      for (const file of serviceFiles) {
        const imports = getImports(file);
        for (const imp of imports) {
          if (imp.includes('/components/') || imp.includes('../components')) {
            violations.push(`${path.basename(file)} imports from ${imp}`);
          }
        }
      }

      expect(violations).toEqual([]);
    });

    it('should not have Utils importing from Services', () => {
      const utilFiles = getTypeScriptFiles(path.join(srcDir, 'utils'));
      const violations: string[] = [];

      for (const file of utilFiles) {
        const imports = getImports(file);
        for (const imp of imports) {
          if (imp.includes('/services/') || imp.includes('../services')) {
            violations.push(`${path.basename(file)} imports from ${imp}`);
          }
        }
      }

      expect(violations).toEqual([]);
    });

    it('should not have Utils importing from Hooks', () => {
      const utilFiles = getTypeScriptFiles(path.join(srcDir, 'utils'));
      const violations: string[] = [];

      for (const file of utilFiles) {
        const imports = getImports(file);
        for (const imp of imports) {
          if (imp.includes('/hooks/') || imp.includes('../hooks')) {
            violations.push(`${path.basename(file)} imports from ${imp}`);
          }
        }
      }

      expect(violations).toEqual([]);
    });

    it('should not have Utils importing from Components', () => {
      const utilFiles = getTypeScriptFiles(path.join(srcDir, 'utils'));
      const violations: string[] = [];

      for (const file of utilFiles) {
        const imports = getImports(file);
        for (const imp of imports) {
          if (imp.includes('/components/') || imp.includes('../components')) {
            violations.push(`${path.basename(file)} imports from ${imp}`);
          }
        }
      }

      expect(violations).toEqual([]);
    });

    it('should not have Constants importing from non-Type layers', () => {
      const constantFiles = getTypeScriptFiles(path.join(srcDir, 'constants'));
      const violations: string[] = [];

      for (const file of constantFiles) {
        const imports = getImports(file);
        for (const imp of imports) {
          if (
            (imp.includes('/utils/') || imp.includes('../utils')) ||
            (imp.includes('/services/') || imp.includes('../services')) ||
            (imp.includes('/hooks/') || imp.includes('../hooks')) ||
            (imp.includes('/components/') || imp.includes('../components'))
          ) {
            violations.push(`${path.basename(file)} imports from ${imp}`);
          }
        }
      }

      expect(violations).toEqual([]);
    });

    it('should not have Types importing from any other layer', () => {
      const typeFiles = getTypeScriptFiles(path.join(srcDir, 'types'));
      const violations: string[] = [];

      for (const file of typeFiles) {
        const imports = getImports(file);
        for (const imp of imports) {
          // Types should only import from external libraries or other type files
          if (
            imp.startsWith('.') &&
            !imp.includes('/types/') &&
            !imp.endsWith('.types')
          ) {
            violations.push(`${path.basename(file)} imports from ${imp}`);
          }
        }
      }

      expect(violations).toEqual([]);
    });
  });

  describe('Circular Dependency Detection', () => {
    it('should not have circular dependencies', () => {
      const allFiles = getTypeScriptFiles(srcDir);
      const graph: Record<string, string[]> = {};

      // Build dependency graph
      for (const file of allFiles) {
        const imports = getImports(file);
        const relativePath = path.relative(srcDir, file);
        graph[relativePath] = imports
          .filter(imp => imp.startsWith('.'))
          .map(imp => {
            const resolved = path.resolve(path.dirname(file), imp);
            return path.relative(srcDir, resolved);
          });
      }

      // Detect cycles using DFS
      const visited = new Set<string>();
      const recStack = new Set<string>();
      const cycles: string[] = [];

      function hasCycle(node: string, path: string[]): boolean {
        if (recStack.has(node)) {
          cycles.push(`Cycle detected: ${path.join(' → ')} → ${node}`);
          return true;
        }
        if (visited.has(node)) {
          return false;
        }

        visited.add(node);
        recStack.add(node);

        const neighbors = graph[node] || [];
        for (const neighbor of neighbors) {
          if (hasCycle(neighbor, [...path, node])) {
            return true;
          }
        }

        recStack.delete(node);
        return false;
      }

      for (const node in graph) {
        if (!visited.has(node)) {
          hasCycle(node, []);
        }
      }

      expect(cycles).toEqual([]);
    });
  });

  describe('File Organization', () => {
    it('should have all source files in appropriate directories', () => {
      const allFiles = getTypeScriptFiles(srcDir);
      const violations: string[] = [];

      for (const file of allFiles) {
        const layer = getLayer(file);
        if (layer === 'unknown') {
          const relativePath = path.relative(srcDir, file);
          // Allow root-level files like App.tsx, main.tsx, etc.
          if (!relativePath.includes('/') && !relativePath.startsWith('vite-env.d.ts')) {
            // Root level files are OK
            continue;
          }
          violations.push(`File in unknown layer: ${relativePath}`);
        }
      }

      expect(violations).toEqual([]);
    });

    it('should have test files only in __tests__ directories', () => {
      const allFiles = getTypeScriptFiles(srcDir);
      const violations: string[] = [];

      for (const file of allFiles) {
        const relativePath = path.relative(srcDir, file);
        if (relativePath.includes('.test.') || relativePath.includes('.spec.')) {
          if (!relativePath.includes('__tests__/')) {
            violations.push(`Test file not in __tests__ directory: ${relativePath}`);
          }
        }
      }

      expect(violations).toEqual([]);
    });
  });
});

