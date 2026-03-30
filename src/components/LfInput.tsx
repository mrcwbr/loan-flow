import { Field } from '@base-ui/react/field';
import clsx from 'clsx';

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
}) {
  return (
    <Field.Root className="flex w-full flex-col items-start gap-1">
      <Field.Label className="text-sm font-medium text-gray-900">
        {label}
      </Field.Label>
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
