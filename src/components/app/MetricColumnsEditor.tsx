interface MetricColumnsEditorProps {
  metricHeaders: string[];
  onMetricChange: (index: number, value: string) => void;
  onAddMetric: () => void;
  onMoveMetric: (index: number, direction: -1 | 1) => void;
  onRemoveMetric: (index: number) => void;
}

export function MetricColumnsEditor({
  metricHeaders,
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
        {metricHeaders.map((header, index) => (
          <div className="metric-row" key={`metric-${index}`}>
            <label className="field">
              <span>Header {index + 1}</span>
              <input
                type="text"
                value={header}
                onChange={(event) => onMetricChange(index, event.target.value)}
                placeholder="Metric name"
              />
            </label>
            <div className="metric-actions" aria-label={`Metric ${index + 1} actions`}>
              <button
                type="button"
                className="icon-button"
                onClick={() => onMoveMetric(index, -1)}
                disabled={index === 0}
              >
                Up
              </button>
              <button
                type="button"
                className="icon-button"
                onClick={() => onMoveMetric(index, 1)}
                disabled={index === metricHeaders.length - 1}
              >
                Down
              </button>
              <button
                type="button"
                className="icon-button icon-button--danger"
                onClick={() => onRemoveMetric(index)}
                disabled={metricHeaders.length === 1}
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
