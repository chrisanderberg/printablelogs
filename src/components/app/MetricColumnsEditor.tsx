import type { MetricColumn } from '@/lib/template/types';

interface MetricColumnsEditorProps {
  metricColumns: MetricColumn[];
  onMetricChange: (id: string, value: string) => void;
  onAddMetric: () => void;
  onMoveMetric: (id: string, direction: -1 | 1) => void;
  onRemoveMetric: (id: string) => void;
}

export function MetricColumnsEditor({
  metricColumns,
  onMetricChange,
  onAddMetric,
  onMoveMetric,
  onRemoveMetric,
}: MetricColumnsEditorProps) {
  return (
    <div className="builder-section">
      <div className="builder-section__heading">
        <div>
          <p className="builder-label">Metric columns</p>
          <h3>Shape the table headers</h3>
        </div>
        <button type="button" className="secondary-button" onClick={onAddMetric}>
          + Add
        </button>
      </div>
      <div className="metric-list">
        {metricColumns.map((metric, index) => (
          <div className="metric-row" key={metric.id}>
            {/* Reorder buttons */}
            <div className="metric-reorder">
              <button
                type="button"
                className="icon-button"
                onClick={() => onMoveMetric(metric.id, -1)}
                disabled={index === 0}
                aria-label="Move up"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden="true">
                  <path d="M6 9.5V2.5M6 2.5L3 5.5M6 2.5L9 5.5"/>
                </svg>
              </button>
              <button
                type="button"
                className="icon-button"
                onClick={() => onMoveMetric(metric.id, 1)}
                disabled={index === metricColumns.length - 1}
                aria-label="Move down"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden="true">
                  <path d="M6 2.5V9.5M6 9.5L3 6.5M6 9.5L9 6.5"/>
                </svg>
              </button>
            </div>

            {/* Header input */}
            <label className="field">
              <span>Header {index + 1}</span>
              <input
                type="text"
                value={metric.header}
                onChange={(event) => onMetricChange(metric.id, event.target.value)}
                placeholder="Metric name"
              />
            </label>

            {/* Remove button */}
            <button
              type="button"
              className="icon-button icon-button--danger"
              onClick={() => onRemoveMetric(metric.id)}
              disabled={metricColumns.length === 1}
              aria-label="Remove metric"
            >
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
                <path d="M2 3.5h9M4.5 3.5V2.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5v1M5 6v4M8 6v4M3 3.5l.5 6.5a.5.5 0 0 0 .5.5h5a.5.5 0 0 0 .5-.5l.5-6.5"/>
              </svg>
            </button>
          </div>
        ))}
      </div>
      <p className="builder-note">
        Time is fixed at the start. Notes always close out the table.
      </p>
    </div>
  );
}
