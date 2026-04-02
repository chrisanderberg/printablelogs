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
          Add metric
        </button>
      </div>
      <div className="metric-list">
        {metricColumns.map((metric, index) => (
          <div className="metric-row" key={metric.id}>
            <label className="field">
              <span>Header {index + 1}</span>
              <input
                type="text"
                value={metric.header}
                onChange={(event) => onMetricChange(metric.id, event.target.value)}
                placeholder="Metric name"
              />
            </label>
            <div className="metric-actions" aria-label={`Metric ${index + 1} actions`}>
              <button
                type="button"
                className="icon-button"
                onClick={() => onMoveMetric(metric.id, -1)}
                disabled={index === 0}
              >
                Up
              </button>
              <button
                type="button"
                className="icon-button"
                onClick={() => onMoveMetric(metric.id, 1)}
                disabled={index === metricColumns.length - 1}
              >
                Down
              </button>
              <button
                type="button"
                className="icon-button icon-button--danger"
                onClick={() => onRemoveMetric(metric.id)}
                disabled={metricColumns.length === 1}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
      <p className="builder-note">
        The time column is fixed at the start, and the notes column is always kept at the end.
      </p>
    </div>
  );
}
