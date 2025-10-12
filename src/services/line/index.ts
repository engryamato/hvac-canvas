/**
 * Line services barrel export
 * 
 * Re-exports all line property management services for convenient importing.
 * Usage: import { updateLineProperties, validateLineProperties } from '@/services/line';
 */

export {
  initializeLineDefaults,
  updateLineProperties,
  validateLineProperties,
  batchUpdateLines,
  getMixedValue,
  duplicateLine,
  calculateAggregateStats,
} from './LinePropertiesService';

