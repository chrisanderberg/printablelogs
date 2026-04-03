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
      <div className="field-grid">
        <label className="field">
          <span>Paper size</span>
          <select
            value={layout.pageSize}
            onChange={(event) => onPageSizeChange(event.target.value as PageSize)}
          >
            <option value="letter">Letter</option>
            <option value="a4">A4</option>
          </select>
        </label>
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
        <label className="field">
          <span>Width preset</span>
          <select
            value={layout.widthPreset}
            onChange={(event) =>
              onWidthPresetChange(event.target.value as ColumnWidthPreset)
            }
          >
            <option value="balanced">Balanced</option>
            <option value="notes-heavy">Notes heavy</option>
            <option value="metrics-heavy">Metrics heavy</option>
          </select>
        </label>
      </div>
    </div>
  );
}
