import { useState, useTransition } from 'react';
import { resolveLayout } from '@/lib/layout/resolveLayout';
import { downloadPdf } from '@/lib/pdf/downloadPdf';
import { DEFAULT_TEMPLATE } from '@/lib/template/defaults';
import { normalizeTemplate } from '@/lib/template/normalize';
import type { TemplateV1 } from '@/lib/template/types';
import { PrintPreview } from './PrintPreview';
import { TemplateForm } from './TemplateForm';

function moveItem(values: string[], index: number, direction: -1 | 1) {
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
  const [template, setTemplate] = useState<TemplateV1>(DEFAULT_TEMPLATE);
  const [showExample, setShowExample] = useState(true);
  const [isPending, startTransition] = useTransition();
  const normalizedTemplate = normalizeTemplate(template);
  const layout = resolveLayout(normalizedTemplate);

  function updateTemplate(updater: (current: TemplateV1) => TemplateV1) {
    startTransition(() => {
      setTemplate((current) => updater(current));
    });
  }

  async function handleDownload() {
    await downloadPdf(layout);
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
            metricHeaders={template.metricHeaders}
            layout={template.layout}
            onTitleChange={(value) =>
              updateTemplate((current) => ({ ...current, title: value }))
            }
            onGranularityChange={(value) =>
              updateTemplate((current) => ({ ...current, timeGranularity: value }))
            }
            onMetricChange={(index, value) =>
              updateTemplate((current) => {
                const metricHeaders = [...current.metricHeaders];
                metricHeaders[index] = value;
                return { ...current, metricHeaders };
              })
            }
            onAddMetric={() =>
              updateTemplate((current) => ({
                ...current,
                metricHeaders: [...current.metricHeaders, `Metric ${current.metricHeaders.length + 1}`],
              }))
            }
            onMoveMetric={(index, direction) =>
              updateTemplate((current) => ({
                ...current,
                metricHeaders: moveItem(current.metricHeaders, index, direction),
              }))
            }
            onRemoveMetric={(index) =>
              updateTemplate((current) => ({
                ...current,
                metricHeaders: current.metricHeaders.filter((_, itemIndex) => itemIndex !== index),
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
              <h2>{normalizedTemplate.title}</h2>
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
                disabled={isPending}
              >
                Download PDF
              </button>
            </div>
          </div>

          {layout.warnings.length > 0 && (
            <div className="warning-stack" aria-live="polite">
              {layout.warnings.map((warning) => (
                <p key={warning.id} className="warning-card">
                  {warning.message}
                </p>
              ))}
            </div>
          )}

          <PrintPreview layout={layout} showExample={showExample} />
        </div>
      </div>
    </section>
  );
}
