import {
  CELL_PADDING_X,
  FOOTER_HEIGHT,
  HEADER_FONT_SIZE,
  INNER_GRID_WIDTH,
  OUTER_BORDER_WIDTH,
  TITLE_FONT_SIZE,
} from '@/lib/layout/constants';
import type { ResolvedLayout } from '@/lib/layout/types';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

const TITLE_BASELINE_OFFSET = 12;

function toPdfY(pageHeight: number, y: number): number {
  return pageHeight - y;
}

export async function renderPdf(layout: ResolvedLayout): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([layout.page.width, layout.page.height]);
  const sans = await pdf.embedFont(StandardFonts.Helvetica);
  const sansBold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const black = rgb(0.07, 0.07, 0.07);
  const muted = rgb(0.42, 0.46, 0.51);

  page.drawText(layout.title, {
    x: layout.contentBox.x,
    y: toPdfY(layout.page.height, layout.contentBox.y) + TITLE_BASELINE_OFFSET,
    font: sansBold,
    size: TITLE_FONT_SIZE,
    color: black,
  });

  page.drawRectangle({
    x: layout.contentBox.x,
    y: toPdfY(layout.page.height, layout.contentBox.y + layout.headerBox.height + layout.bodyBox.height),
    width: layout.contentBox.width,
    height: layout.headerBox.height + layout.bodyBox.height,
    borderWidth: OUTER_BORDER_WIDTH,
    borderColor: black,
  });

  for (const line of layout.columnLines.slice(1, -1)) {
    page.drawLine({
      start: { x: line, y: toPdfY(layout.page.height, layout.contentBox.y) },
      end: {
        x: line,
        y: toPdfY(layout.page.height, layout.bodyBox.y + layout.bodyBox.height),
      },
      thickness: INNER_GRID_WIDTH,
      color: black,
    });
  }

  page.drawLine({
    start: {
      x: layout.contentBox.x,
      y: toPdfY(layout.page.height, layout.bodyBox.y),
    },
    end: {
      x: layout.contentBox.x + layout.contentBox.width,
      y: toPdfY(layout.page.height, layout.bodyBox.y),
    },
    thickness: INNER_GRID_WIDTH,
    color: black,
  });

  for (const line of layout.rowLines.slice(1, -1)) {
    page.drawLine({
      start: { x: layout.contentBox.x, y: toPdfY(layout.page.height, line) },
      end: {
        x: layout.contentBox.x + layout.contentBox.width,
        y: toPdfY(layout.page.height, line),
      },
      thickness: INNER_GRID_WIDTH,
      color: black,
    });
  }

  for (const column of layout.columns) {
    page.drawText(column.header, {
      x: column.x + CELL_PADDING_X,
      y: toPdfY(
        layout.page.height,
        layout.headerBox.y + layout.headerBox.height / 2 + HEADER_FONT_SIZE / 2
      ),
      font: sansBold,
      size: HEADER_FONT_SIZE,
      color: black,
    });
  }

  page.drawText(`${layout.pageSize.toUpperCase()} / ${layout.orientation}`, {
    x: layout.contentBox.x,
    y: toPdfY(layout.page.height, layout.footerBox.y + FOOTER_HEIGHT - 5),
    font: sans,
    size: 8.5,
    color: muted,
  });

  return pdf.save();
}
