import type { MetricColumn, TemplateV1 } from './types';

let metricColumnCounter = 0;

export function createMetricColumn(header: string, id?: string): MetricColumn {
  metricColumnCounter += 1;

  return {
    id: id ?? `metric-${metricColumnCounter}`,
    header,
  };
}

export const DEFAULT_METRIC_COLUMNS = [
  createMetricColumn('pH', 'metric-ph'),
  createMetricColumn('Ammonia (ppm)', 'metric-ammonia'),
  createMetricColumn('Nitrite (ppm)', 'metric-nitrite'),
  createMetricColumn('Nitrate (ppm)', 'metric-nitrate'),
];

export function cloneMetricColumns(columns: MetricColumn[]): MetricColumn[] {
  return columns.map((column) => ({ ...column }));
}

export const DEFAULT_TEMPLATE: TemplateV1 = {
  version: 1,
  title: 'Aquarium Water Log',
  timeGranularity: 'continuous',
  metricColumns: cloneMetricColumns(DEFAULT_METRIC_COLUMNS),
  layout: {
    pageSize: 'letter',
    orientation: 'portrait',
    rowsPerPage: 28,
    widthPreset: 'balanced',
  },
};
