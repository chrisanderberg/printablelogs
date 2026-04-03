import {
  CELL_PADDING_X,
  CELL_PADDING_Y,
  FOOTER_HEIGHT,
  HEADER_FONT_SIZE,
  HEADER_LINE_HEIGHT,
  TITLE_FONT_SIZE,
  TITLE_LINE_HEIGHT,
} from '@/lib/layout/constants';
import { gridStrokeWidths } from '@/lib/layout/resolveLayout';
import type { ResolvedLayout } from '@/lib/layout/types';
import { getExampleRows } from '@/lib/preview/exampleData';
import { PageFrame } from './PageFrame';

interface PrintPreviewProps {
  layout: ResolvedLayout;
  showExample: boolean;
}

export function PrintPreview({ layout, showExample }: PrintPreviewProps) {
  const exampleRows = getExampleRows();

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
          fill="var(--board-bg)"
        />
        <text
          x={layout.titleBox.x}
          y={layout.titleBox.y + TITLE_FONT_SIZE}
          fontSize={TITLE_FONT_SIZE}
          fontWeight="700"
          fill="var(--board-ink)"
          fontFamily="'Playfair Display', Georgia, serif"
        >
          {layout.titleLines.map((line, index) => (
            <tspan
              key={`${line}-${index}`}
              x={layout.titleBox.x}
              dy={index === 0 ? 0 : TITLE_LINE_HEIGHT}
            >
              {line}
            </tspan>
          ))}
        </text>
        <rect
          x={layout.contentBox.x}
          y={layout.contentBox.y}
          width={layout.contentBox.width}
          height={layout.headerBox.height + layout.bodyBox.height}
          fill="none"
          stroke="var(--board-ink)"
          strokeWidth={gridStrokeWidths.outer}
        />
        {layout.columnLines.slice(1, -1).map((line) => (
          <line
            key={`column-${line}`}
            x1={line}
            y1={layout.contentBox.y}
            x2={line}
            y2={layout.bodyBox.y + layout.bodyBox.height}
            stroke="var(--board-stroke)"
            strokeWidth={gridStrokeWidths.inner}
          />
        ))}
        <line
          x1={layout.contentBox.x}
          y1={layout.bodyBox.y}
          x2={layout.contentBox.x + layout.contentBox.width}
          y2={layout.bodyBox.y}
          stroke="var(--board-stroke)"
          strokeWidth={gridStrokeWidths.inner}
        />
        {layout.rowLines.slice(1, -1).map((line) => (
          <line
            key={`row-${line}`}
            x1={layout.contentBox.x}
            y1={line}
            x2={layout.contentBox.x + layout.contentBox.width}
            y2={line}
            stroke="var(--board-stroke)"
            strokeWidth={gridStrokeWidths.inner}
          />
        ))}
        {layout.columns.map((column) => (
          <text
            key={column.key}
            x={column.x + CELL_PADDING_X}
            y={layout.headerBox.y + CELL_PADDING_Y + HEADER_FONT_SIZE}
            fontSize={HEADER_FONT_SIZE}
            fontWeight="700"
            fill="var(--board-ink)"
            fontFamily="'Playfair Display', Georgia, serif"
          >
            {column.headerLines.map((line, index) => (
              <tspan
                key={`${column.key}-${line}-${index}`}
                x={column.x + CELL_PADDING_X}
                dy={index === 0 ? 0 : HEADER_LINE_HEIGHT}
              >
                {line}
              </tspan>
            ))}
          </text>
        ))}
        <text
          x={layout.contentBox.x}
          y={layout.footerBox.y + FOOTER_HEIGHT - 4}
          fontSize="8.5"
          fill="var(--board-ink-soft)"
          fontFamily="'Source Sans 3', sans-serif"
        >
          {layout.pageSize.toUpperCase()} / {layout.orientation}
        </text>
        {showExample &&
          exampleRows.map((row, rowIndex) => {
            const exampleFontSize = Math.min(layout.rowHeight * 0.55, 12);
            const y =
              layout.bodyBox.y + rowIndex * layout.rowHeight + layout.rowHeight * 0.65;
            let metricIndex = 0;

            return (
              <g key={`${row.time}-${rowIndex}`}>
                {layout.columns.map((column) => {
                  const value =
                    column.kind === 'time'
                      ? row.time
                      : column.kind === 'notes'
                        ? row.notes
                        : row.metrics[metricIndex++] ?? '';

                  return (
                    <text
                      key={column.key}
                      x={column.x + CELL_PADDING_X}
                      y={y}
                      fill="var(--board-data)"
                      fontSize={exampleFontSize}
                      fontFamily="'Caveat', cursive"
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
