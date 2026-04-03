import { useEffect, useState } from 'react';
import type {
  ColumnWidthPreset,
  Orientation,
  PageSize,
  TemplateLayout,
} from '@/lib/template/types';

const MIN_ROWS_PER_PAGE = 8;
const MAX_ROWS_PER_PAGE = 48;

interface LayoutControlsProps {
  layout: TemplateLayout;
  onPageSizeChange: (value: PageSize) => void;
  onOrientationChange: (value: Orientation) => void;
  onRowsPerPageChange: (value: number) => void;
  onWidthPresetChange: (value: ColumnWidthPreset) => void;
}

export function LayoutControls({
  layout,
  onPageSizeChange,
  onOrientationChange,
  onRowsPerPageChange,
  onWidthPresetChange,
}: LayoutControlsProps) {
  const [rowsInput, setRowsInput] = useState(String(layout.rowsPerPage));

  // Keep local input in sync if parent value changes externally
  useEffect(() => {
    setRowsInput(String(layout.rowsPerPage));
  }, [layout.rowsPerPage]);

  function commitRows(raw: string) {
    const parsed = Number.parseInt(raw, 10);
    if (Number.isNaN(parsed)) {
      setRowsInput(String(layout.rowsPerPage));
      return;
    }
    const clamped = Math.min(MAX_ROWS_PER_PAGE, Math.max(MIN_ROWS_PER_PAGE, parsed));
    onRowsPerPageChange(clamped);
    setRowsInput(String(clamped));
  }

  return (
    <div className="builder-section">
      <div className="builder-section__heading">
        <div>
          <p className="builder-label">Page settings</p>
          <h3>Tune it for your printer and handwriting</h3>
        </div>
      </div>
      <fieldset className="segmented-field">
        <legend>Orientation</legend>
        <div className="segmented-control">
          <button
            type="button"
            className={layout.orientation === 'portrait' ? 'is-active' : ''}
            onClick={() => onOrientationChange('portrait')}
            aria-pressed={layout.orientation === 'portrait'}
          >
            Portrait
          </button>
          <button
            type="button"
            className={layout.orientation === 'landscape' ? 'is-active' : ''}
            onClick={() => onOrientationChange('landscape')}
            aria-pressed={layout.orientation === 'landscape'}
          >
            Landscape
          </button>
        </div>
      </fieldset>
      <fieldset className="segmented-field">
        <legend>Paper size</legend>
        <div className="segmented-control">
          <button
            type="button"
            className={layout.pageSize === 'letter' ? 'is-active' : ''}
            onClick={() => onPageSizeChange('letter')}
            aria-pressed={layout.pageSize === 'letter'}
          >
            Letter
          </button>
          <button
            type="button"
            className={layout.pageSize === 'a4' ? 'is-active' : ''}
            onClick={() => onPageSizeChange('a4')}
            aria-pressed={layout.pageSize === 'a4'}
          >
            A4
          </button>
        </div>
      </fieldset>
      <fieldset className="segmented-field">
        <legend>Column widths</legend>
        <div className="segmented-control segmented-control--three">
          <button
            type="button"
            className={layout.widthPreset === 'balanced' ? 'is-active' : ''}
            onClick={() => onWidthPresetChange('balanced')}
            aria-pressed={layout.widthPreset === 'balanced'}
          >
            Balanced
          </button>
          <button
            type="button"
            className={layout.widthPreset === 'notes-heavy' ? 'is-active' : ''}
            onClick={() => onWidthPresetChange('notes-heavy')}
            aria-pressed={layout.widthPreset === 'notes-heavy'}
          >
            Notes+
          </button>
          <button
            type="button"
            className={layout.widthPreset === 'metrics-heavy' ? 'is-active' : ''}
            onClick={() => onWidthPresetChange('metrics-heavy')}
            aria-pressed={layout.widthPreset === 'metrics-heavy'}
          >
            Metrics+
          </button>
        </div>
      </fieldset>
      <label className="field">
        <span>Rows per page</span>
        <input
          type="number"
          min={MIN_ROWS_PER_PAGE}
          max={MAX_ROWS_PER_PAGE}
          value={rowsInput}
          onChange={(event) => setRowsInput(event.target.value)}
          onBlur={(event) => commitRows(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') commitRows(event.currentTarget.value);
          }}
        />
      </label>
    </div>
  );
}
