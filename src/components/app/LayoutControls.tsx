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
  return (
    <div className="builder-section">
      <div className="builder-section__heading">
        <div>
          <p className="builder-label">Page settings</p>
          <h3>Tune it for your printer and handwriting</h3>
        </div>
      </div>
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
          <span>Orientation</span>
          <select
            value={layout.orientation}
            onChange={(event) =>
              onOrientationChange(event.target.value as Orientation)
            }
          >
            <option value="portrait">Portrait</option>
            <option value="landscape">Landscape</option>
          </select>
        </label>
        <label className="field">
          <span>Rows per page</span>
          <input
            type="number"
            min={MIN_ROWS_PER_PAGE}
            max={MAX_ROWS_PER_PAGE}
            value={layout.rowsPerPage}
            onChange={(event) => {
              const parsedValue = Number.parseInt(event.target.value, 10);

              if (Number.isNaN(parsedValue)) {
                return;
              }

              onRowsPerPageChange(
                Math.min(
                  MAX_ROWS_PER_PAGE,
                  Math.max(MIN_ROWS_PER_PAGE, parsedValue)
                )
              );
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
