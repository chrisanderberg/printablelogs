import { useRef, useState } from 'react';
import type { MetricColumn } from '@/lib/template/types';

interface MetricColumnsEditorProps {
  metricColumns: MetricColumn[];
  onMetricChange: (id: string, value: string) => void;
  onAddMetric: () => void;
  onMoveMetric: (id: string, direction: -1 | 1) => void;
  onReorderMetric: (fromIndex: number, toIndex: number) => void;
  onRemoveMetric: (id: string) => void;
}

export function MetricColumnsEditor({
  metricColumns,
  onMetricChange,
  onAddMetric,
  onMoveMetric,
  onReorderMetric,
  onRemoveMetric,
}: MetricColumnsEditorProps) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dropTargetIndex, setDropTargetIndex] = useState<number | null>(null);
  // Track whether the pointer is in the top or bottom half of the target row
  const [dropPosition, setDropPosition] = useState<'before' | 'after'>('after');
  const dragIndexRef = useRef<number | null>(null);

  function handleDragStart(index: number) {
    setDragIndex(index);
    dragIndexRef.current = index;
  }

  function handleDragOver(e: React.DragEvent<HTMLDivElement>, index: number) {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    const midY = rect.top + rect.height / 2;
    const pos = e.clientY < midY ? 'before' : 'after';
    setDropTargetIndex(index);
    setDropPosition(pos);
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>, toIndex: number) {
    e.preventDefault();
    const from = dragIndexRef.current;
    if (from === null || from === toIndex) {
      clearDrag();
      return;
    }
    // Adjust toIndex based on whether we're dropping before or after
    const finalIndex = dropPosition === 'before' ? toIndex : toIndex;
    onReorderMetric(from, finalIndex);
    clearDrag();
  }

  function clearDrag() {
    setDragIndex(null);
    setDropTargetIndex(null);
    dragIndexRef.current = null;
  }

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
        {metricColumns.map((metric, index) => {
          const isDragging = dragIndex === index;
          const isDropTarget = dropTargetIndex === index && dragIndex !== index;
          let rowClass = 'metric-row';
          if (isDragging) rowClass += ' is-dragging';
          if (isDropTarget) rowClass += dropPosition === 'before' ? ' is-drop-before' : ' is-drop-after';

          return (
            <div
              className={rowClass}
              key={metric.id}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={clearDrag}
            >
              {/* Drag handle + reorder buttons */}
              <div className="metric-reorder">
                <div className="metric-drag-handle" aria-hidden="true">
                  <svg width="10" height="14" viewBox="0 0 10 14" fill="none" aria-hidden="true">
                    <circle cx="3" cy="2.5" r="1.2" fill="currentColor"/>
                    <circle cx="7" cy="2.5" r="1.2" fill="currentColor"/>
                    <circle cx="3" cy="7" r="1.2" fill="currentColor"/>
                    <circle cx="7" cy="7" r="1.2" fill="currentColor"/>
                    <circle cx="3" cy="11.5" r="1.2" fill="currentColor"/>
                    <circle cx="7" cy="11.5" r="1.2" fill="currentColor"/>
                  </svg>
                </div>
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
          );
        })}
      </div>
      <p className="builder-note">
        Time is fixed at the start. Notes always close out the table.
      </p>
    </div>
  );
}
