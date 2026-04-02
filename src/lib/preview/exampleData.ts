import type { TimeGranularity } from '../template/types';

export interface ExampleRow {
  time: string;
  metrics: string[];
  notes: string;
}

const DAILY_ROWS: ExampleRow[] = [
  {
    time: '03/28',
    metrics: ['7.4', '0', '0', '10'],
    notes: 'Fed lightly',
  },
  {
    time: '03/29',
    metrics: ['7.5', '0', '0', '15'],
    notes: 'Top-off + trim',
  },
  {
    time: '03/30',
    metrics: ['7.4', '0', '0', '20'],
    notes: 'Water change',
  },
];

const CONTINUOUS_ROWS: ExampleRow[] = [
  {
    time: '03/28 08:10',
    metrics: ['7.4', '0', '0', '10'],
    notes: 'Morning check',
  },
  {
    time: '03/28 17:40',
    metrics: ['7.5', '0', '0', '15'],
    notes: 'Fed + dosed',
  },
  {
    time: '03/29 09:05',
    metrics: ['7.4', '0', '0', '20'],
    notes: 'Partial water change',
  },
];

export function getExampleRows(granularity: TimeGranularity): ExampleRow[] {
  return granularity === 'daily' ? DAILY_ROWS : CONTINUOUS_ROWS;
}
