import { useState, useTransition } from 'react';
import { resolveLayout } from '@/lib/layout/resolveLayout';
import { downloadPdf } from '@/lib/pdf/downloadPdf';
import {
  cloneMetricColumns,
  createMetricColumn,
  DEFAULT_TEMPLATE,
} from '@/lib/template/defaults';
import type { TemplateV1 } from '@/lib/template/types';
import { PrintPreview } from './PrintPreview';
import { TemplateForm } from './TemplateForm';

function moveItem<T>(values: T[], index: number, direction: -1 | 1) {
  const nextIndex = index + direction;

  if (nextIndex < 0 || nextIndex >= values.length) {
    return values;
  }

  const nextValues = [...values];
  const current = nextValues[index];
  nextValues[index] = nextValues[nextIndex];
  nextValues[nextIndex] = current;
  return nextValues;
}

export function LogBuilderApp() {
  const [template, setTemplate] = useState<TemplateV1>(() => ({
    ...DEFAULT_TEMPLATE,
    metricColumns: cloneMetricColumns(DEFAULT_TEMPLATE.metricColumns),
  }));
  const [showExample, setShowExample] = useState(true);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const layout = resolveLayout(template);

  function updateTemplate(updater: (current: TemplateV1) => TemplateV1) {
    startTransition(() => {
      setTemplate((current) => updater(current));
    });
  }

  async function handleDownload() {
    setDownloadError(null);
    setIsDownloading(true);

    try {
      await downloadPdf(layout);
    } catch (error) {
      console.error('PDF download failed:', error);
      setDownloadError(
        error instanceof Error
          ? `The PDF could not be created right now. ${error.message}`
          : 'The PDF could not be created right now. Try again in a moment.'
      );
    } finally {
      setIsDownloading(false);
    }
  }

  return (
    <section className="builder-app">
      <div className="builder-app__intro">
        <p className="builder-kicker">Print-first log builder</p>
        <h1>Make a clean tracking sheet faster than drawing one by hand.</h1>
        <p className="builder-intro-copy">
          Configure the table, preview the printed page, then export a toner-friendly PDF for Letter or A4.
        </p>
      </div>

      <div className="builder-app__grid">
        <aside className="builder-panel">
          <TemplateForm
            title={template.title}
            timeGranularity={template.timeGranularity}
            metricColumns={template.metricColumns}
            layout={template.layout}
            onTitleChange={(value) =>
              updateTemplate((current) => ({ ...current, title: value }))
            }
            onGranularityChange={(value) =>
              updateTemplate((current) => ({ ...current, timeGranularity: value }))
            }
            onMetricChange={(id, value) =>
              updateTemplate((current) => {
                const metricColumns = current.metricColumns.map((column) =>
                  column.id === id ? { ...column, header: value } : column
                );
                return { ...current, metricColumns };
              })
            }
            onAddMetric={() =>
              updateTemplate((current) => ({
                ...current,
                metricColumns: [
                  ...current.metricColumns,
                  createMetricColumn(`Metric ${current.metricColumns.length + 1}`),
                ],
              }))
            }
            onMoveMetric={(id, direction) =>
              updateTemplate((current) => ({
                ...current,
                metricColumns: moveItem(
                  current.metricColumns,
                  current.metricColumns.findIndex((column) => column.id === id),
                  direction
                ),
              }))
            }
            onRemoveMetric={(id) =>
              updateTemplate((current) => ({
                ...current,
                metricColumns: current.metricColumns.filter((column) => column.id !== id),
              }))
            }
            onPageSizeChange={(value) =>
              updateTemplate((current) => ({
                ...current,
                layout: { ...current.layout, pageSize: value },
              }))
            }
            onOrientationChange={(value) =>
              updateTemplate((current) => ({
                ...current,
                layout: { ...current.layout, orientation: value },
              }))
            }
            onRowsPerPageChange={(value) =>
              updateTemplate((current) => ({
                ...current,
                layout: { ...current.layout, rowsPerPage: value },
              }))
            }
            onWidthPresetChange={(value) =>
              updateTemplate((current) => ({
                ...current,
                layout: { ...current.layout, widthPreset: value },
              }))
            }
          />
        </aside>

        <div className="preview-panel">
          <div className="preview-panel__toolbar">
            <div>
              <p className="builder-label">Preview</p>
              <h2>{layout.title}</h2>
              <p className="builder-note">
                {layout.orientation === 'landscape'
                  ? `Landscape is active. ${layout.visibleMetricCount} metric columns fit on this page.`
                  : layout.hiddenMetricCount > 0
                    ? `Portrait is active. ${layout.hiddenMetricCount} metric column${layout.hiddenMetricCount === 1 ? '' : 's'} will be hidden unless you switch to landscape or remove some columns.`
                    : `Portrait is active. ${layout.visibleMetricCount} metric columns fit on this page.`}
              </p>
            </div>
            <div className="preview-panel__actions">
              <label className="toggle-field">
                <input
                  type="checkbox"
                  checked={showExample}
                  onChange={(event) => setShowExample(event.target.checked)}
                />
                <span>Show filled example</span>
              </label>
              <button
                type="button"
                className="primary-button"
                onClick={() => void handleDownload()}
                disabled={isPending || isDownloading}
              >
                {isDownloading ? 'Preparing PDF...' : 'Download PDF'}
              </button>
            </div>
          </div>

          {layout.warnings.length > 0 && (
            <div className="notice-stack" aria-live="polite">
              {layout.warnings.map((warning) => (
                <p key={warning.id} className="notice-card notice-card--warning">
                  {warning.message}
                </p>
              ))}
            </div>
          )}

          {downloadError && (
            <div className="notice-stack" aria-live="polite">
              <p className="notice-card notice-card--error">{downloadError}</p>
            </div>
          )}

          <PrintPreview layout={layout} showExample={showExample} />
        </div>
      </div>
    </section>
  );
}
