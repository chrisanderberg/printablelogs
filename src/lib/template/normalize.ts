import { DEFAULT_TEMPLATE } from './defaults';
import type { ResolvedTemplateColumn, TemplateV1 } from './types';

const MIN_ROWS_PER_PAGE = 8;
const MAX_ROWS_PER_PAGE = 48;

function cleanMetricHeader(header: string): string {
  return header.trim().replace(/\s+/g, ' ');
}

export function normalizeTemplate(template: TemplateV1): TemplateV1 {
  const metricHeaders = template.metricHeaders
    .map(cleanMetricHeader)
    .filter(Boolean);

  return {
    version: 1,
    title: template.title.trim() || DEFAULT_TEMPLATE.title,
    timeGranularity: template.timeGranularity,
    metricHeaders: metricHeaders.length
      ? metricHeaders
      : DEFAULT_TEMPLATE.metricHeaders,
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
  template: TemplateV1
): ResolvedTemplateColumn[] {
  const timeHeader =
    template.timeGranularity === 'daily' ? 'Date' : 'Date / Time';
  const metricColumns = template.metricHeaders.map((header, index) => ({
    key: `metric-${index + 1}`,
    header,
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
