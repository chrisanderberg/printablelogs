export type TimeGranularity = 'daily' | 'continuous';
export type PageSize = 'letter' | 'a4';
export type Orientation = 'portrait' | 'landscape';
export type ColumnWidthPreset = 'balanced' | 'notes-heavy' | 'metrics-heavy';

export interface MetricColumn {
  id: string;
  header: string;
}

export interface TemplateLayout {
  pageSize: PageSize;
  orientation: Orientation;
  rowsPerPage: number;
  widthPreset: ColumnWidthPreset;
}

export interface TemplateV1 {
  version: 1;
  title: string;
  timeGranularity: TimeGranularity;
  metricColumns: MetricColumn[];
  layout: TemplateLayout;
}

export interface ResolvedTemplateColumn {
  key: string;
  header: string;
  kind: 'time' | 'metric' | 'notes';
}
