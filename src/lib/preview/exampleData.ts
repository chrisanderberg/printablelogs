export interface ExampleRow {
  time: string;
  metrics: string[];
  notes: string;
}

const EXAMPLE_ROWS: ExampleRow[] = [
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

export function getExampleRows(): ExampleRow[] {
  return EXAMPLE_ROWS.map((row) => ({
    ...row,
    metrics: [...row.metrics],
  }));
}
