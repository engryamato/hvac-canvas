/**
 * ConnectionsTab Component
 * 
 * Displays connection information for the selected line(s).
 * Shows which endpoints are connected to other lines.
 */

import React from 'react';
import type { Line, LineEndpoint, LineConnection } from '../../../types/drawing.types';
import { Section } from '../shared/Section';

/**
 * Props for ConnectionsTab component
 */
export interface ConnectionsTabProps {
  /** Line being edited */
  line: Line;
  /** Get connected endpoints callback */
  getConnectedEndpoints?: (lineId: string, endpoint: LineEndpoint) => LineConnection[];
  /** Optional CSS class name */
  className?: string;
}

/**
 * ConnectionsTab Component
 * 
 * Displays connection information for a selected line.
 * Shows which endpoints are connected to other lines and at which endpoints.
 * 
 * Features:
 * - Shows "Endpoint A connected to:" section if connections exist
 * - Shows "Endpoint B connected to:" section if connections exist
 * - Displays "No connections" message if line has no connections
 * - Shows connection info in format: "Line {id} at endpoint {endpoint}"
 * - Handles missing connection data gracefully
 * 
 * Layout:
 * ```
 * ┌─────────────────────┐
 * │ Endpoint A          │
 * │ Connected to:       │
 * │ • Line-ABC at b     │
 * │ • Line-XYZ at a     │
 * │                     │
 * │ Endpoint B          │
 * │ Connected to:       │
 * │ • Line-DEF at a     │
 * │                     │
 * │ No connections      │  ← If no connections
 * └─────────────────────┘
 * ```
 * 
 * @param props - Component props
 * 
 * @example
 * ```tsx
 * <ConnectionsTab
 *   line={selectedLine}
 *   connections={connectionGraph}
 *   getConnectedEndpoints={(lineId, endpoint) => getConnections(lineId, endpoint)}
 * />
 * ```
 */
export function ConnectionsTab(props: ConnectionsTabProps): JSX.Element {
  const {
    line,
    getConnectedEndpoints,
    className = '',
  } = props;

  // Get connections for both endpoints
  const endpointAConnections = getConnectedEndpoints
    ? getConnectedEndpoints(line.id, 'a')
    : [];
  
  const endpointBConnections = getConnectedEndpoints
    ? getConnectedEndpoints(line.id, 'b')
    : [];

  // Check if there are any connections
  const hasConnections = endpointAConnections.length > 0 || endpointBConnections.length > 0;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Endpoint A Connections */}
      {endpointAConnections.length > 0 && (
        <Section title="Endpoint A">
          <div className="space-y-2">
            <p className="text-xs text-neutral-600 font-medium">Connected to:</p>
            <div className="space-y-1.5">
              {endpointAConnections.map((conn) => (
                <div
                  key={`${conn.lineId}-${conn.endpoint}`}
                  className="flex items-center gap-2 px-2 py-1.5 bg-neutral-50 rounded border border-neutral-200 text-xs text-neutral-700"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                  <span>
                    Line <span className="font-medium">{conn.lineId}</span> at endpoint{' '}
                    <span className="font-medium">{conn.endpoint}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Section>
      )}

      {/* Endpoint B Connections */}
      {endpointBConnections.length > 0 && (
        <Section title="Endpoint B">
          <div className="space-y-2">
            <p className="text-xs text-neutral-600 font-medium">Connected to:</p>
            <div className="space-y-1.5">
              {endpointBConnections.map((conn) => (
                <div
                  key={`${conn.lineId}-${conn.endpoint}`}
                  className="flex items-center gap-2 px-2 py-1.5 bg-neutral-50 rounded border border-neutral-200 text-xs text-neutral-700"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                  <span>
                    Line <span className="font-medium">{conn.lineId}</span> at endpoint{' '}
                    <span className="font-medium">{conn.endpoint}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Section>
      )}

      {/* No Connections Message */}
      {!hasConnections && (
        <div className="flex items-center justify-center py-8 text-center">
          <p className="text-sm text-neutral-500">
            No connections
          </p>
        </div>
      )}
    </div>
  );
}

