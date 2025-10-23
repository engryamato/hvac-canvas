/**
 * Connection Detection Service
 * 
 * Detects and manages connections between line endpoints.
 * Two endpoints are considered connected if they are within CONNECTION_TOLERANCE_PX of each other.
 */

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

