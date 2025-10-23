# Connection Detection - Code Examples & Implementation Details

## Type Definitions

### Complete Type Structure

```typescript
// src/types/drawing.types.ts

/**
 * Represents a single endpoint of a line
 */
export type LineEndpoint = 'a' | 'b';

/**
 * Represents a connection between two line endpoints
 * Example: Line A's endpoint 'b' connects to Line B's endpoint 'a'
 */
export interface LineConnection {
  /** ID of the connected line */
  lineId: string;
  /** Which endpoint of the connected line ('a' or 'b') */
  endpoint: LineEndpoint;
}

/**
 * Connection map for a single line
 * Shows all lines connected at each endpoint
 */
export interface LineConnectionMap {
  /** Lines connected at endpoint 'a' */
  a: LineConnection[];
  /** Lines connected at endpoint 'b' */
  b: LineConnection[];
}

/**
 * Complete connection graph for all lines
 * Example:
 * {
 *   'line-1': { a: [], b: [{lineId: 'line-2', endpoint: 'a'}] },
 *   'line-2': { a: [{lineId: 'line-1', endpoint: 'b'}], b: [] }
 * }
 */
export type ConnectionGraph = Record<string, LineConnectionMap>;
```

---

## ConnectionService Implementation

### Core Algorithm: buildConnectionGraph

```typescript
// src/services/drawing/ConnectionService.ts

import type { Line, LineEndpoint, LineConnection, LineConnectionMap, ConnectionGraph } from '../../types';
import { CONNECTION_TOLERANCE_PX } from '../../constants';

/**
 * Normalize a coordinate to the nearest tolerance bucket
 * Enables grouping endpoints that are within tolerance of each other
 * 
 * Example: With tolerance=20
 * - normalizeCoordinate(105, 20) = 100
 * - normalizeCoordinate(115, 20) = 120
 * - normalizeCoordinate(100, 20) = 100
 */
export function normalizeCoordinate(value: number, tolerance: number): number {
  return Math.round(value / tolerance) * tolerance;
}

/**
 * Build complete connection graph for all lines
 * 
 * Algorithm:
 * 1. Group all endpoints by normalized coordinates
 * 2. For each group with 2+ endpoints, create bidirectional connections
 * 3. Return complete graph
 */
export function buildConnectionGraph(
  lines: Line[],
  tolerance: number = CONNECTION_TOLERANCE_PX
): ConnectionGraph {
  // Step 1: Group endpoints by normalized coordinates
  const coordinateGroups: Record<string, Array<{lineId: string; endpoint: LineEndpoint}>> = {};
  
  for (const line of lines) {
    // Process endpoint 'a'
    const normalizedA = `${normalizeCoordinate(line.a.x, tolerance)},${normalizeCoordinate(line.a.y, tolerance)}`;
    if (!coordinateGroups[normalizedA]) {
      coordinateGroups[normalizedA] = [];
    }
    coordinateGroups[normalizedA].push({lineId: line.id, endpoint: 'a'});
    
    // Process endpoint 'b'
    const normalizedB = `${normalizeCoordinate(line.b.x, tolerance)},${normalizeCoordinate(line.b.y, tolerance)}`;
    if (!coordinateGroups[normalizedB]) {
      coordinateGroups[normalizedB] = [];
    }
    coordinateGroups[normalizedB].push({lineId: line.id, endpoint: 'b'});
  }
  
  // Step 2: Initialize graph with empty connections for all lines
  const graph: ConnectionGraph = {};
  for (const line of lines) {
    graph[line.id] = {a: [], b: []};
  }
  
  // Step 3: Create bidirectional connections for grouped endpoints
  for (const endpoints of Object.values(coordinateGroups)) {
    if (endpoints.length < 2) continue; // No connections if only one endpoint
    
    // For each endpoint in this group
    for (const source of endpoints) {
      // Connect to all other endpoints in the group
      for (const target of endpoints) {
        if (source.lineId === target.lineId && source.endpoint === target.endpoint) {
          continue; // Skip self-connections
        }
        
        // Add connection from source to target
        graph[source.lineId][source.endpoint].push({
          lineId: target.lineId,
          endpoint: target.endpoint,
        });
      }
    }
  }
  
  return graph;
}

/**
 * Get all connections for a specific line endpoint
 */
export function getConnectedEndpoints(
  graph: ConnectionGraph,
  lineId: string,
  endpoint: LineEndpoint
): LineConnection[] {
  return graph[lineId]?.[endpoint] ?? [];
}

/**
 * Get all connections for a line
 */
export function getConnectionsForLine(
  graph: ConnectionGraph,
  lineId: string
): LineConnectionMap | null {
  return graph[lineId] ?? null;
}
```

---

## useLineStore Integration

### Hook Implementation

```typescript
// src/hooks/useLineStore.ts (additions)

import { useMemo } from 'react';
import { buildConnectionGraph, getConnectedEndpoints as getConnectedEndpointsService } from '../services/drawing/ConnectionService';
import { CONNECTION_TOLERANCE_PX } from '../constants';
import type { ConnectionGraph, LineEndpoint, LineConnection } from '../types';

export interface UseLineStoreReturn {
  // ... existing properties
  
  /** Connection graph for all lines */
  connections: ConnectionGraph;
  
  /** Get connected endpoints for a specific line endpoint */
  getConnectedEndpoints: (lineId: string, endpoint: LineEndpoint) => LineConnection[];
}

export function useLineStore(initialLines: Line[] = []): UseLineStoreReturn {
  // ... existing state
  
  // Compute connection graph whenever lines change
  const connections = useMemo(() => {
    return buildConnectionGraph(lines, CONNECTION_TOLERANCE_PX);
  }, [lines]);
  
  // Helper to get connections for a specific endpoint
  const getConnectedEndpoints = useCallback(
    (lineId: string, endpoint: LineEndpoint) => {
      return getConnectedEndpointsService(connections, lineId, endpoint);
    },
    [connections]
  );
  
  return {
    // ... existing returns
    connections,
    getConnectedEndpoints,
  };
}
```

---

## Usage Examples

### Example 1: Display Connections in Modal

```typescript
// src/components/LinePropertiesModal.tsx

function ConnectionInfo({ lineId, connections, getConnectedEndpoints }: Props) {
  const endpointAConnections = getConnectedEndpoints(lineId, 'a');
  const endpointBConnections = getConnectedEndpoints(lineId, 'b');
  
  return (
    <div className="connections-section">
      <h3>Connections</h3>
      
      {endpointAConnections.length > 0 && (
        <div>
          <strong>Endpoint A connected to:</strong>
          {endpointAConnections.map(conn => (
            <div key={`${conn.lineId}-${conn.endpoint}`}>
              Line {conn.lineId} at endpoint {conn.endpoint}
            </div>
          ))}
        </div>
      )}
      
      {endpointBConnections.length > 0 && (
        <div>
          <strong>Endpoint B connected to:</strong>
          {endpointBConnections.map(conn => (
            <div key={`${conn.lineId}-${conn.endpoint}`}>
              Line {conn.lineId} at endpoint {conn.endpoint}
            </div>
          ))}
        </div>
      )}
      
      {endpointAConnections.length === 0 && endpointBConnections.length === 0 && (
        <p>No connections</p>
      )}
    </div>
  );
}
```

### Example 2: Check if Endpoints are Connected

```typescript
// Utility function to check if two endpoints are connected

function areEndpointsConnected(
  connections: ConnectionGraph,
  lineId1: string,
  endpoint1: LineEndpoint,
  lineId2: string,
  endpoint2: LineEndpoint
): boolean {
  const connections1 = connections[lineId1]?.[endpoint1] ?? [];
  return connections1.some(
    conn => conn.lineId === lineId2 && conn.endpoint === endpoint2
  );
}
```

### Example 3: Get All Lines Connected to a Line

```typescript
// Get all unique lines connected to a given line

function getConnectedLines(
  connections: ConnectionGraph,
  lineId: string
): string[] {
  const connMap = connections[lineId];
  if (!connMap) return [];
  
  const connectedIds = new Set<string>();
  connMap.a.forEach(conn => connectedIds.add(conn.lineId));
  connMap.b.forEach(conn => connectedIds.add(conn.lineId));
  
  return Array.from(connectedIds);
}
```

---

## Test Examples

### Unit Test: buildConnectionGraph

```typescript
// src/services/drawing/__tests__/ConnectionService.test.ts

describe('buildConnectionGraph', () => {
  it('should detect connection between two lines at same endpoint', () => {
    const lineA = createLine({id: 'a', a: {x: 0, y: 0}, b: {x: 100, y: 0}});
    const lineB = createLine({id: 'b', a: {x: 100, y: 0}, b: {x: 100, y: 100}});
    
    const graph = buildConnectionGraph([lineA, lineB], 20);
    
    // lineA.b should connect to lineB.a
    expect(graph['a'].b).toContainEqual({lineId: 'b', endpoint: 'a'});
    expect(graph['b'].a).toContainEqual({lineId: 'a', endpoint: 'b'});
  });
  
  it('should handle multi-branch junctions', () => {
    const lineA = createLine({id: 'a', b: {x: 100, y: 100}});
    const lineB = createLine({id: 'b', a: {x: 100, y: 100}});
    const lineC = createLine({id: 'c', a: {x: 100, y: 100}});
    
    const graph = buildConnectionGraph([lineA, lineB, lineC], 20);
    
    // All three should be connected at that point
    expect(graph['a'].b).toHaveLength(2);
    expect(graph['b'].a).toHaveLength(2);
    expect(graph['c'].a).toHaveLength(2);
  });
});
```

---

## Performance Considerations

### Complexity Analysis

- **buildConnectionGraph:** O(n) where n = number of lines
  - Single pass through all lines
  - Coordinate grouping is O(1) average case
  - Connection creation is O(k²) per group, where k = endpoints in group (typically 2-3)

- **Memory:** O(n) for graph storage
  - Each line has at most 2 endpoints
  - Each endpoint typically has 1-3 connections

### Optimization Notes

- Graph is memoized in useLineStore, only recomputes when lines change
- No need to rebuild entire graph on single line update (handled by useMemo)
- Tolerance-based grouping prevents floating-point precision issues

