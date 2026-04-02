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
  let url: string | null = null;
  let anchor: HTMLAnchorElement | null = null;

  try {
    const bytes = await renderPdf(layout);
    const blob = new Blob([bytes], { type: 'application/pdf' });
    url = URL.createObjectURL(blob);
    anchor = document.createElement('a');

    anchor.href = url;
    anchor.download = `${slugify(layout.title) || 'printable-log'}.pdf`;
    document.body.append(anchor);
    anchor.click();
  } catch (error) {
    console.error('Failed to generate PDF:', error);
    throw new Error('Please try again.');
  } finally {
    anchor?.remove();

    if (url) {
      window.setTimeout(() => URL.revokeObjectURL(url as string), 1000);
    }
  }
}
