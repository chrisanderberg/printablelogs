import type {
  ColumnWidthPreset,
  Orientation,
  PageSize,
  ResolvedTemplateColumn,
  TimeGranularity,
} from '../template/types';

export interface LayoutBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ResolvedLayoutColumn extends ResolvedTemplateColumn {
  x: number;
  width: number;
}

export interface ResolvedLayoutWarning {
  id: string;
  level: 'warning';
  message: string;
}

export interface ResolvedLayout {
  title: string;
  pageSize: PageSize;
  orientation: Orientation;
  timeGranularity: TimeGranularity;
  widthPreset: ColumnWidthPreset;
  page: {
    width: number;
    height: number;
  };
  margins: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  contentBox: LayoutBox;
  headerBox: LayoutBox;
  bodyBox: LayoutBox;
  footerBox: LayoutBox;
  columns: ResolvedLayoutColumn[];
  rowsPerPage: number;
  rowHeight: number;
  columnLines: number[];
  rowLines: number[];
  warnings: ResolvedLayoutWarning[];
}
