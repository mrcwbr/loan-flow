import { Field } from '@base-ui/react/field';
import { Popover } from '@base-ui/react/popover';
import clsx from 'clsx';
import { CircleQuestionMark } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function LfInput({
  label,
  description,
  placeholder,
  value,
  onChange,
  append,
  step,
  min,
  type,
  help,
}: {
  value: number | string;
  onChange: (value: number | string) => void;
  label: string;
  description?: string;
  placeholder?: string;
  append?: string;
  step?: number;
  min?: number;
  type?: 'color' | 'number' | 'text';
  help?: string;
}) {
  const { t } = useTranslation();
  // todo use tousand separator and input style type
  return (
    <Field.Root className="flex w-full flex-col items-start gap-1">
      <Popover.Root>
        <div className="flex w-full items-center justify-between">
          <Field.Label className="text-sm font-medium text-gray-950">
            {label}
          </Field.Label>
          {!!help && (
            <Popover.Trigger className="cursor-pointer rounded-full text-gray-950 transition-colors hover:text-primary">
              <CircleQuestionMark
                aria-label={t('form.help')}
                className="size-5"
              />
            </Popover.Trigger>
          )}
        </div>
        <Popover.Portal>
          <Popover.Positioner sideOffset={8}>
            <Popover.Popup className="origin-(--transform-origin) rounded-lg bg-[canvas] px-6 py-4 text-gray-900 shadow-lg shadow-gray-200 outline-1 outline-gray-200 transition-[transform,scale,opacity] data-ending-style:scale-90 data-ending-style:opacity-0 data-starting-style:scale-90 data-starting-style:opacity-0 dark:shadow-none dark:-outline-offset-1 dark:outline-gray-300">
              <Popover.Arrow className="data-[side=bottom]:-top-2 data-[side=left]:-right-3.25 data-[side=left]:rotate-90 data-[side=right]:-left-3.25 data-[side=right]:-rotate-90 data-[side=top]:-bottom-2 data-[side=top]:rotate-180">
                <ArrowSvg />
              </Popover.Arrow>
              <Popover.Title className="text-sm font-medium">
                {label}
              </Popover.Title>
              <Popover.Description className="text-sm text-gray-500">
                {help}
              </Popover.Description>
            </Popover.Popup>
          </Popover.Positioner>
        </Popover.Portal>
      </Popover.Root>
      <div className="relative">
        <Field.Control
          required
          value={value}
          type={type}
          step={step}
          min={min}
          onValueChange={(value) =>
            onChange(type === 'number' ? Number(value) : value)
          }
          placeholder={placeholder}
          className={clsx(
            'h-10 w-full min-w-11 rounded-md border border-gray-200 text-base text-gray-900 focus:outline-2 focus:-outline-offset-1 focus:outline-gray-950',
            type === 'color' ? 'px-1' : 'px-3'
          )}
        />
        {!!append && (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
            {append}
          </div>
        )}
      </div>

      {description && (
        <Field.Description className="text-sm text-gray-600">
          {description}
        </Field.Description>
      )}
    </Field.Root>
  );
}

function ArrowSvg(props: React.ComponentProps<'svg'>) {
  return (
    <svg width="20" height="10" viewBox="0 0 20 10" fill="none" {...props}>
      <path
        d="M9.66437 2.60207L4.80758 6.97318C4.07308 7.63423 3.11989 8 2.13172 8H0V10H20V8H18.5349C17.5468 8 16.5936 7.63423 15.8591 6.97318L11.0023 2.60207C10.622 2.2598 10.0447 2.25979 9.66437 2.60207Z"
        className="fill-[canvas]"
      />
      <path
        d="M8.99542 1.85876C9.75604 1.17425 10.9106 1.17422 11.6713 1.85878L16.5281 6.22989C17.0789 6.72568 17.7938 7.00001 18.5349 7.00001L15.89 7L11.0023 2.60207C10.622 2.2598 10.0447 2.2598 9.66436 2.60207L4.77734 7L2.13171 7.00001C2.87284 7.00001 3.58774 6.72568 4.13861 6.22989L8.99542 1.85876Z"
        className="fill-gray-200 dark:fill-none"
      />
      <path
        d="M10.3333 3.34539L5.47654 7.71648C4.55842 8.54279 3.36693 9 2.13172 9H0V8H2.13172C3.11989 8 4.07308 7.63423 4.80758 6.97318L9.66437 2.60207C10.0447 2.25979 10.622 2.2598 11.0023 2.60207L15.8591 6.97318C16.5936 7.63423 17.5468 8 18.5349 8H20V9H18.5349C17.2998 9 16.1083 8.54278 15.1901 7.71648L10.3333 3.34539Z"
        className="dark:fill-gray-300"
      />
    </svg>
  );
}
