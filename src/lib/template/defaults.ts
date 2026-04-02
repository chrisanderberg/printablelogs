import type { TemplateV1 } from './types';

export const DEFAULT_METRIC_HEADERS = [
  'pH',
  'Ammonia (ppm)',
  'Nitrite (ppm)',
  'Nitrate (ppm)',
];

export const DEFAULT_TEMPLATE: TemplateV1 = {
  version: 1,
  title: 'Aquarium Water Log',
  timeGranularity: 'continuous',
  metricHeaders: DEFAULT_METRIC_HEADERS,
  layout: {
    pageSize: 'letter',
    orientation: 'portrait',
    rowsPerPage: 28,
    widthPreset: 'balanced',
  },
};
