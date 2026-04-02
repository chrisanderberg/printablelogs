import type { Orientation, PageSize } from '../template/types';

export const POINTS_PER_INCH = 72;

export const PAGE_SIZES_INCHES: Record<PageSize, { width: number; height: number }> =
  {
    letter: { width: 8.5, height: 11 },
    a4: { width: 8.27, height: 11.69 },
  };

export const PAGE_MARGIN_INCHES = {
  top: 0.55,
  right: 0.5,
  bottom: 0.6,
  left: 0.5,
} as const;

export const HEADER_FONT_SIZE = 10.5;
export const BODY_FONT_SIZE = 9.5;
export const TITLE_FONT_SIZE = 15;
export const HEADER_LINE_HEIGHT = 11.5;
export const TITLE_LINE_HEIGHT = 16.5;
export const HEADER_HEIGHT = 26;
export const FOOTER_HEIGHT = 18;
export const TITLE_GAP = 10;
export const OUTER_BORDER_WIDTH = 1.1;
export const INNER_GRID_WIDTH = 0.65;
export const MIN_ROW_HEIGHT = 14;
export const MIN_TIME_COLUMN_WIDTH = 90;
export const MIN_METRIC_COLUMN_WIDTH = 60;
export const MIN_NOTES_COLUMN_WIDTH = 120;
export const CELL_PADDING_X = 6;
export const CELL_PADDING_Y = 5;

export function getPageDimensions(
  pageSize: PageSize,
  orientation: Orientation
): { width: number; height: number } {
  const size = PAGE_SIZES_INCHES[pageSize];
  const width = size.width * POINTS_PER_INCH;
  const height = size.height * POINTS_PER_INCH;

  return orientation === 'portrait'
    ? { width, height }
    : { width: height, height: width };
}
