import clsx from 'clsx';
import type { ReactNode } from 'react';

export function LfCard({
  children,
  className,
  title,
  actions,
  padding = true,
}: {
  children: ReactNode;
  actions?: ReactNode;
  className?: string;
  padding?: boolean;
  title: string;
}) {
  return (
    <div
      className={clsx(
        'divide-y divide-gray-200 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-xs',
        className
      )}
    >
      <div className="flex items-center justify-between p-4">
        <h2 className="font-semibold">{title}</h2>
        {actions}
      </div>

      <div className={clsx({ 'p-4': padding })}>{children}</div>
    </div>
  );
}
