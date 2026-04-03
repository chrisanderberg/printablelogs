import type { CSSProperties, PropsWithChildren } from 'react';
import type { ResolvedLayout } from '@/lib/layout/types';

interface PageFrameProps extends PropsWithChildren {
  layout: ResolvedLayout;
  className?: string;
}

export function PageFrame({ layout, className, children }: PageFrameProps) {
  return (
    <div className={className}>
      <div className="desk-mat">
        <div
          className="page-frame"
          style={
            {
              '--page-width': `${layout.page.width}px`,
              '--page-height': `${layout.page.height}px`,
            } as CSSProperties
          }
        >
          {children}
        </div>
      </div>
    </div>
  );
}
