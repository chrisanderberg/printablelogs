import {
  CELL_PADDING_X,
  CELL_PADDING_Y,
  FOOTER_HEIGHT,
  HEADER_HEIGHT,
  HEADER_FONT_SIZE,
  HEADER_LINE_HEIGHT,
  INNER_GRID_WIDTH,
  MIN_METRIC_COLUMN_WIDTH,
  MIN_NOTES_COLUMN_WIDTH,
  MIN_ROW_HEIGHT,
  MIN_TIME_COLUMN_WIDTH,
  OUTER_BORDER_WIDTH,
  PAGE_MARGIN_INCHES,
  POINTS_PER_INCH,
  TITLE_FONT_SIZE,
  TITLE_GAP,
  TITLE_LINE_HEIGHT,
  getPageDimensions,
} from './constants';
import { wrapTextByWords } from './textWrap';
import { validateLayout } from './validation';
import { getResolvedColumns, normalizeTemplate } from '../template/normalize';
import type { ColumnWidthPreset, TemplateV1 } from '../template/types';
import type { ResolvedLayout, ResolvedLayoutColumn } from './types';

const MIN_BODY_HEIGHT = MIN_ROW_HEIGHT;
const PDF_FONT_FAMILY = 'Helvetica, Arial, sans-serif';

interface ResolveLayoutOptions {
  headingFontFamily?: string;
}

function getWidthPercentages(
  preset: ColumnWidthPreset,
  isDaily: boolean
): { time: number; notes: number } {
  if (preset === 'notes-heavy') {
    return {
      time: isDaily ? 0.15 : 0.18,
      notes: 0.31,
    };
  }

  if (preset === 'metrics-heavy') {
    return {
      time: isDaily ? 0.13 : 0.16,
      notes: 0.2,
    };
  }

  return {
    time: isDaily ? 0.14 : 0.18,
    notes: 0.26,
  };
}

function resolveColumnWidths(
  contentWidth: number,
  metricCount: number,
  preset: ColumnWidthPreset,
  isDaily: boolean
): {
  timeWidth: number;
  metricWidths: number[];
  notesWidth: number;
  hiddenMetricCount: number;
} {
  const percentages = getWidthPercentages(preset, isDaily);
  let timeWidth = contentWidth * percentages.time;
  let notesWidth = contentWidth * percentages.notes;

  if (timeWidth < MIN_TIME_COLUMN_WIDTH) {
    timeWidth = MIN_TIME_COLUMN_WIDTH;
  }

  if (notesWidth < MIN_NOTES_COLUMN_WIDTH) {
    notesWidth = MIN_NOTES_COLUMN_WIDTH;
  }

  const remainingWidth = Math.max(contentWidth - timeWidth - notesWidth, 0);
  const metricWidth = metricCount > 0 ? remainingWidth / metricCount : 0;
  const metricWidths =
    metricCount > 0
      ? Array.from({ length: metricCount }, () => metricWidth)
      : [];

  if (metricWidths.some((width) => width < MIN_METRIC_COLUMN_WIDTH)) {
    const totalMinWidth =
      MIN_TIME_COLUMN_WIDTH +
      MIN_NOTES_COLUMN_WIDTH +
      metricCount * MIN_METRIC_COLUMN_WIDTH;
    const availableMetricWidth = Math.max(
      contentWidth - MIN_TIME_COLUMN_WIDTH - MIN_NOTES_COLUMN_WIDTH,
      0
    );
    const visibleMetricCount = Math.min(
      metricCount,
      Math.floor(availableMetricWidth / MIN_METRIC_COLUMN_WIDTH)
    );
    const reservedMetricWidth = visibleMetricCount * MIN_METRIC_COLUMN_WIDTH;
    const availableTimeWidth = Math.max(
      contentWidth - MIN_NOTES_COLUMN_WIDTH - reservedMetricWidth,
      0
    );

    timeWidth = Math.min(MIN_TIME_COLUMN_WIDTH, availableTimeWidth);
    const visibleMetricWidths = Array.from(
      { length: visibleMetricCount },
      () => MIN_METRIC_COLUMN_WIDTH
    );
    notesWidth = Math.max(contentWidth - timeWidth - reservedMetricWidth, 0);

    return {
      timeWidth,
      metricWidths: visibleMetricWidths,
      notesWidth,
      hiddenMetricCount:
        totalMinWidth > contentWidth ? metricCount - visibleMetricCount : 0,
    };
  }

  return { timeWidth, metricWidths, notesWidth, hiddenMetricCount: 0 };
}

export function resolveLayout(
  templateInput: TemplateV1,
  options: ResolveLayoutOptions = {}
): ResolvedLayout {
  const template = normalizeTemplate(templateInput);
  const headingFontFamily = options.headingFontFamily ?? PDF_FONT_FAMILY;
  const page = getPageDimensions(template.layout.pageSize, template.layout.orientation);
  const margins = {
    top: PAGE_MARGIN_INCHES.top * POINTS_PER_INCH,
    right: PAGE_MARGIN_INCHES.right * POINTS_PER_INCH,
    bottom: PAGE_MARGIN_INCHES.bottom * POINTS_PER_INCH,
    left: PAGE_MARGIN_INCHES.left * POINTS_PER_INCH,
  };
  const printableBox = {
    x: margins.left,
    y: margins.top,
    width: page.width - margins.left - margins.right,
    height: page.height - margins.top - margins.bottom,
  };
  const maxReservedHeight = Math.max(printableBox.height - MIN_BODY_HEIGHT, 0);
  const titleLines = wrapTextByWords(
    template.title,
    printableBox.width,
    TITLE_FONT_SIZE,
    'bold',
    headingFontFamily
  );
  const titleBox = {
    x: printableBox.x,
    y: printableBox.y,
    width: printableBox.width,
    height: Math.min(titleLines.length * TITLE_LINE_HEIGHT, maxReservedHeight),
  };
  const contentBox = {
    x: printableBox.x,
    y: titleBox.y + titleBox.height + TITLE_GAP,
    width: printableBox.width,
    height: Math.max(0, printableBox.height - titleBox.height - TITLE_GAP),
  };
  const metricCount = template.metricColumns.length;
  const isDaily = template.timeGranularity === 'daily';
  const widths = resolveColumnWidths(
    contentBox.width,
    metricCount,
    template.layout.widthPreset,
    isDaily
  );
  const columns = getResolvedColumns(template, widths.metricWidths.length);

  let currentX = contentBox.x;
  let metricIndex = 0;
  const resolvedColumns: ResolvedLayoutColumn[] = columns.map((column) => {
    let width = widths.timeWidth;

    if (column.kind === 'metric') {
      width = widths.metricWidths[metricIndex];
      metricIndex += 1;
    }

    if (column.kind === 'notes') {
      width = widths.notesWidth;
    }

    const headerLines = wrapTextByWords(
      column.header,
      Math.max(width - CELL_PADDING_X * 2, 1),
      HEADER_FONT_SIZE,
      'bold',
      headingFontFamily
    );
    const resolvedColumn = {
      ...column,
      x: currentX,
      width,
      headerLines,
    };

    currentX += width;
    return resolvedColumn;
  });

  if (resolvedColumns.length > 0) {
    const lastColumn = resolvedColumns[resolvedColumns.length - 1];
    lastColumn.width = contentBox.x + contentBox.width - lastColumn.x;
  }

  const columnLines = [
    contentBox.x,
    ...resolvedColumns.map((column) => column.x + column.width),
  ];
  const maxHeaderLineCount = Math.max(
    ...resolvedColumns.map((column) => column.headerLines.length),
    1
  );
  const headerBox = {
    x: contentBox.x,
    y: contentBox.y,
    width: contentBox.width,
    height: Math.min(
      Math.max(
        HEADER_HEIGHT,
        maxHeaderLineCount * HEADER_LINE_HEIGHT + CELL_PADDING_Y * 2
      ),
      maxReservedHeight
    ),
  };
  const footerBox = {
    x: contentBox.x,
    y: contentBox.y + Math.max(contentBox.height - FOOTER_HEIGHT, 0),
    width: contentBox.width,
    height: FOOTER_HEIGHT,
  };
  const bodyBox = {
    x: contentBox.x,
    y: headerBox.y + headerBox.height,
    width: contentBox.width,
    height: Math.max(0, contentBox.height - headerBox.height - footerBox.height),
  };
  const rawRowHeight = Math.floor(bodyBox.height / template.layout.rowsPerPage);
  const rowHeight = Math.max(
    MIN_ROW_HEIGHT,
    rawRowHeight
  );
  const rowsPerPage =
    rawRowHeight < MIN_ROW_HEIGHT
      ? Math.max(Math.floor(bodyBox.height / rowHeight), 1)
      : template.layout.rowsPerPage;
  const rowLines = Array.from(
    { length: rowsPerPage + 1 },
    (_, index) =>
      index === rowsPerPage
        ? bodyBox.y + bodyBox.height
        : Math.min(bodyBox.y + index * rowHeight, bodyBox.y + bodyBox.height)
  );

  const warnings = validateLayout({
    rowHeight: rawRowHeight,
    timeWidth: widths.timeWidth,
    metricWidths: widths.metricWidths,
    notesWidth: widths.notesWidth,
  });

  if (widths.hiddenMetricCount > 0) {
    const metricColumnCount = widths.metricWidths.length;
    const overflowGuidance =
      template.layout.orientation === 'portrait'
        ? 'Switch to landscape to fit more columns on one page.'
        : 'Remove a few metrics or use a narrower width preset to include the rest.';

    warnings.push({
      id: 'metric-limit',
      level: 'warning',
      message: `Only the first ${metricColumnCount} metric columns fit on this page. ${overflowGuidance}`,
    });
  }

  return {
    title: template.title,
    titleLines,
    visibleMetricCount: widths.metricWidths.length,
    hiddenMetricCount: widths.hiddenMetricCount,
    pageSize: template.layout.pageSize,
    orientation: template.layout.orientation,
    timeGranularity: template.timeGranularity,
    widthPreset: template.layout.widthPreset,
    page,
    margins,
    titleBox,
    contentBox,
    headerBox,
    bodyBox,
    footerBox,
    columns: resolvedColumns,
    rowsPerPage,
    rowHeight,
    columnLines,
    rowLines,
    warnings,
  };
}

export const gridStrokeWidths = {
  outer: OUTER_BORDER_WIDTH,
  inner: INNER_GRID_WIDTH,
};
