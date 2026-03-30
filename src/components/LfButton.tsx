import { Button } from '@base-ui/react';
import clsx from 'clsx';
import type { LucideIcon } from 'lucide-react';

export function LfButton({
  title,
  className,
  onClick,
  disabled,
  icon: Icon,
}: {
  icon?: LucideIcon;
  title: string;
  className?: string;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <Button
      title={title}
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        'flex cursor-pointer items-center justify-center gap-2 rounded-md px-4 py-2 text-gray-950 ring ring-gray-950 transition-colors enabled:hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-25',
        className
      )}
    >
      {Icon && <Icon className="size-5" />}
      {title}
    </Button>
  );
}
