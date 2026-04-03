import {
  cloneMetricColumns,
  DEFAULT_METRIC_COLUMNS,
  DEFAULT_TEMPLATE,
} from './defaults';
import type { ResolvedTemplateColumn, TemplateV1 } from './types';

const MIN_ROWS_PER_PAGE = 8;
const MAX_ROWS_PER_PAGE = 48;

function cleanMetricHeader(header: string): string {
  return header.trim().replace(/\s+/g, ' ');
}

export function normalizeTemplate(template: TemplateV1): TemplateV1 {
  const metricColumns = template.metricColumns
    .map((column) => ({
      id: column.id,
      header: cleanMetricHeader(column.header),
    }))
    .filter((column) => Boolean(column.header));

  return {
    version: 1,
    title: template.title.trim() || DEFAULT_TEMPLATE.title,
    timeGranularity: template.timeGranularity,
    metricColumns: metricColumns.length
      ? metricColumns
      : cloneMetricColumns(DEFAULT_METRIC_COLUMNS),
    layout: {
      pageSize: template.layout.pageSize,
      orientation: template.layout.orientation,
      rowsPerPage: Math.max(
        MIN_ROWS_PER_PAGE,
        Math.min(MAX_ROWS_PER_PAGE, Math.round(template.layout.rowsPerPage))
      ),
      widthPreset: template.layout.widthPreset,
    },
  };
}

export function getResolvedColumns(
  template: TemplateV1,
  metricCount: number = template.metricColumns.length
): ResolvedTemplateColumn[] {
  const timeHeader = 'Date / Time';
  const metricColumns = template.metricColumns.slice(0, metricCount).map((column) => ({
    key: column.id,
    header: column.header,
    kind: 'metric' as const,
  }));

  return [
    {
      key: 'time',
      header: timeHeader,
      kind: 'time',
    },
    ...metricColumns,
    {
      key: 'notes',
      header: 'Notes',
      kind: 'notes',
    },
  ];
}
