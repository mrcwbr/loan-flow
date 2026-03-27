import type { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

export function LCard({
  children,
  className,
  title,
  actions,
}: {
  children: ReactNode;
  actions?: ReactNode;
  className?: string;
  title?: string;
}) {
  return (
    <div
      className={twMerge(
        'divide-y divide-gray-200 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-xs',
        className
      )}
    >
      {(title || actions) && (
        <div className="flex items-center justify-between p-4">
          <h2>{title}</h2>
          {actions}
        </div>
      )}
      <div className="p-4">{children}</div>
    </div>
  );
}
