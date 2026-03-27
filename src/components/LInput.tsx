import { Field } from '@base-ui/react/field';

export function LInput({
  label,
  description,
  placeholder,
  value,
  setValue,
  append,
  step,
  min,
}: {
  value: number;
  setValue: (value: number) => void;
  label: string;
  description?: string;
  placeholder?: string;
  append?: string;
  step?: number;
  min?: number;
}) {
  function onValueChange(value: string) {
    setValue(Number(value));
  }

  return (
    <Field.Root className="flex w-full flex-col items-start gap-1">
      <Field.Label className="text-sm font-medium text-gray-900">
        {label}
      </Field.Label>
      <div className="relative">
        <Field.Control
          required
          value={value}
          type="number"
          step={step}
          min={min}
          onValueChange={onValueChange}
          placeholder={placeholder}
          className="w-full rounded-md border border-gray-200 px-3 py-2 text-base text-gray-900 focus:outline-2 focus:-outline-offset-1"
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
