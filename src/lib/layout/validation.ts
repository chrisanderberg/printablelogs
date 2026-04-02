import {
  MIN_METRIC_COLUMN_WIDTH,
  MIN_NOTES_COLUMN_WIDTH,
  MIN_ROW_HEIGHT,
  MIN_TIME_COLUMN_WIDTH,
} from './constants';
import type { ResolvedLayoutWarning } from './types';

interface ValidationInput {
  rowHeight: number;
  timeWidth: number;
  metricWidths: number[];
  notesWidth: number;
}

export function validateLayout(input: ValidationInput): ResolvedLayoutWarning[] {
  const warnings: ResolvedLayoutWarning[] = [];

  if (input.rowHeight < MIN_ROW_HEIGHT) {
    warnings.push({
      id: 'row-height',
      level: 'warning',
      message:
        'Rows are getting cramped for handwriting. Reduce rows per page for a more comfortable printout.',
    });
  }

  if (input.timeWidth < MIN_TIME_COLUMN_WIDTH) {
    warnings.push({
      id: 'time-width',
      level: 'warning',
      message:
        'The time column is narrow. Landscape orientation will give date and time entries more breathing room.',
    });
  }

  if (input.notesWidth < MIN_NOTES_COLUMN_WIDTH) {
    warnings.push({
      id: 'notes-width',
      level: 'warning',
      message:
        'The notes column is tight. Try a notes-heavy preset or landscape orientation if you expect longer notes.',
    });
  }

  if (input.metricWidths.some((width) => width < MIN_METRIC_COLUMN_WIDTH)) {
    warnings.push({
      id: 'metric-width',
      level: 'warning',
      message:
        'One or more metric columns are narrow. Fewer metrics or a wider page layout will print more cleanly.',
    });
  }

  return warnings;
}
