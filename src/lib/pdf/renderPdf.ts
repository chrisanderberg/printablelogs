import {
  CELL_PADDING_X,
  CELL_PADDING_Y,
  FOOTER_HEIGHT,
  HEADER_FONT_SIZE,
  HEADER_LINE_HEIGHT,
  INNER_GRID_WIDTH,
  OUTER_BORDER_WIDTH,
  TITLE_FONT_SIZE,
  TITLE_LINE_HEIGHT,
} from '@/lib/layout/constants';
import type { ResolvedLayout } from '@/lib/layout/types';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

function toPdfY(pageHeight: number, y: number): number {
  return pageHeight - y;
}

function getTopAlignedPdfY(
  pageHeight: number,
  topY: number,
  fontSize: number
): number {
  return toPdfY(pageHeight, topY + fontSize);
}

export async function renderPdf(layout: ResolvedLayout): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([layout.page.width, layout.page.height]);
  const sans = await pdf.embedFont(StandardFonts.Helvetica);
  const sansBold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const black = rgb(0.07, 0.07, 0.07);
  const muted = rgb(0.42, 0.46, 0.51);

  layout.titleLines.forEach((line, index) => {
    page.drawText(line, {
      x: layout.titleBox.x,
      y: getTopAlignedPdfY(
        layout.page.height,
        layout.titleBox.y + index * TITLE_LINE_HEIGHT,
        TITLE_FONT_SIZE
      ),
      font: sansBold,
      size: TITLE_FONT_SIZE,
      color: black,
    });
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
    column.headerLines.forEach((line, index) => {
      page.drawText(line, {
        x: column.x + CELL_PADDING_X,
        y: getTopAlignedPdfY(
          layout.page.height,
          layout.headerBox.y + CELL_PADDING_Y + index * HEADER_LINE_HEIGHT,
          HEADER_FONT_SIZE
        ),
        font: sansBold,
        size: HEADER_FONT_SIZE,
        color: black,
      });
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
