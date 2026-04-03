import type { MetricColumn } from '@/lib/template/types';
import { LayoutControls } from './LayoutControls';
import { MetricColumnsEditor } from './MetricColumnsEditor';

interface TemplateFormProps {
  title: string;
  metricColumns: MetricColumn[];
  layout: {
    pageSize: 'letter' | 'a4';
    orientation: 'portrait' | 'landscape';
    rowsPerPage: number;
    widthPreset: 'balanced' | 'notes-heavy' | 'metrics-heavy';
  };
  onTitleChange: (value: string) => void;
  onMetricChange: (id: string, value: string) => void;
  onAddMetric: () => void;
  onMoveMetric: (id: string, direction: -1 | 1) => void;
  onReorderMetric: (fromIndex: number, toIndex: number) => void;
  onRemoveMetric: (id: string) => void;
  onPageSizeChange: (value: 'letter' | 'a4') => void;
  onOrientationChange: (value: 'portrait' | 'landscape') => void;
  onRowsPerPageChange: (value: number) => void;
  onWidthPresetChange: (value: 'balanced' | 'notes-heavy' | 'metrics-heavy') => void;
}

export function TemplateForm(props: TemplateFormProps) {
  return (
    <div className="builder-form">
      <LayoutControls
        layout={props.layout}
        onPageSizeChange={props.onPageSizeChange}
        onOrientationChange={props.onOrientationChange}
        onRowsPerPageChange={props.onRowsPerPageChange}
        onWidthPresetChange={props.onWidthPresetChange}
      />

      <div className="builder-section">
        <div className="builder-section__heading">
          <div>
            <p className="builder-label">Template details</p>
            <h3>Name your log</h3>
          </div>
        </div>
        <label className="field">
          <span>Log title</span>
          <input
            type="text"
            value={props.title}
            onChange={(event) => props.onTitleChange(event.target.value)}
            placeholder="Aquarium Water Log"
          />
        </label>
      </div>

      <MetricColumnsEditor
        metricColumns={props.metricColumns}
        onMetricChange={props.onMetricChange}
        onAddMetric={props.onAddMetric}
        onMoveMetric={props.onMoveMetric}
        onReorderMetric={props.onReorderMetric}
        onRemoveMetric={props.onRemoveMetric}
      />
    </div>
  );
}
