import type { ResolvedLayout } from '@/lib/layout/types';
import { renderPdf } from './renderPdf';

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

export async function downloadPdf(layout: ResolvedLayout): Promise<void> {
  const bytes = await renderPdf(layout);
  const blob = new Blob([bytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');

  anchor.href = url;
  anchor.download = `${slugify(layout.title) || 'printable-log'}.pdf`;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();

  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
