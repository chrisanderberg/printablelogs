import { CELL_PADDING_X, CELL_PADDING_Y, FOOTER_HEIGHT, HEADER_FONT_SIZE, TITLE_FONT_SIZE } from '@/lib/layout/constants';
import { gridStrokeWidths } from '@/lib/layout/resolveLayout';
import type { ResolvedLayout } from '@/lib/layout/types';
import { getExampleRows } from '@/lib/preview/exampleData';
import { PageFrame } from './PageFrame';

interface PrintPreviewProps {
  layout: ResolvedLayout;
  showExample: boolean;
}

export function PrintPreview({ layout, showExample }: PrintPreviewProps) {
  const exampleRows = getExampleRows(layout.timeGranularity);

  return (
    <PageFrame layout={layout} className="preview-shell">
      <svg
        className="preview-svg"
        viewBox={`0 0 ${layout.page.width} ${layout.page.height}`}
        role="img"
        aria-label="Print preview"
      >
        <rect
          x={0}
          y={0}
          width={layout.page.width}
          height={layout.page.height}
          fill="#fffef9"
        />
        <text
          x={layout.contentBox.x}
          y={layout.contentBox.y - 12}
          fontSize={TITLE_FONT_SIZE}
          fontWeight="700"
          fill="#111111"
          fontFamily="var(--font-display)"
        >
          {layout.title}
        </text>
        <rect
          x={layout.contentBox.x}
          y={layout.contentBox.y}
          width={layout.contentBox.width}
          height={layout.headerBox.height + layout.bodyBox.height}
          fill="none"
          stroke="#111111"
          strokeWidth={gridStrokeWidths.outer}
        />
        {layout.columnLines.slice(1, -1).map((line) => (
          <line
            key={`column-${line}`}
            x1={line}
            y1={layout.contentBox.y}
            x2={line}
            y2={layout.bodyBox.y + layout.bodyBox.height}
            stroke="#111111"
            strokeWidth={gridStrokeWidths.inner}
          />
        ))}
        <line
          x1={layout.contentBox.x}
          y1={layout.bodyBox.y}
          x2={layout.contentBox.x + layout.contentBox.width}
          y2={layout.bodyBox.y}
          stroke="#111111"
          strokeWidth={gridStrokeWidths.inner}
        />
        {layout.rowLines.slice(1, -1).map((line) => (
          <line
            key={`row-${line}`}
            x1={layout.contentBox.x}
            y1={line}
            x2={layout.contentBox.x + layout.contentBox.width}
            y2={line}
            stroke="#111111"
            strokeWidth={gridStrokeWidths.inner}
          />
        ))}
        {layout.columns.map((column) => (
          <text
            key={column.key}
            x={column.x + CELL_PADDING_X}
            y={layout.headerBox.y + layout.headerBox.height / 2 + HEADER_FONT_SIZE / 3}
            fontSize={HEADER_FONT_SIZE}
            fontWeight="700"
            fill="#111111"
            fontFamily="var(--font-display)"
          >
            {column.header}
          </text>
        ))}
        <text
          x={layout.contentBox.x}
          y={layout.footerBox.y + FOOTER_HEIGHT - 4}
          fontSize="8.5"
          fill="#6b7280"
          fontFamily="var(--font-body)"
        >
          {layout.pageSize.toUpperCase()} / {layout.orientation}
        </text>
        {showExample &&
          exampleRows.map((row, rowIndex) => {
            const y =
              layout.bodyBox.y + rowIndex * layout.rowHeight + CELL_PADDING_Y + 10;

            return (
              <g key={`${row.time}-${rowIndex}`}>
                {layout.columns.map((column, columnIndex) => {
                  const value =
                    column.kind === 'time'
                      ? row.time
                      : column.kind === 'notes'
                        ? row.notes
                        : row.metrics[columnIndex - 1] ?? '';

                  return (
                    <text
                      key={column.key}
                      x={column.x + CELL_PADDING_X}
                      y={y}
                      fill="#2452a5"
                      fontSize="10"
                      fontFamily="var(--font-ink)"
                      style={{ letterSpacing: '0.01em' }}
                    >
                      {value}
                    </text>
                  );
                })}
              </g>
            );
          })}
      </svg>
    </PageFrame>
  );
}
