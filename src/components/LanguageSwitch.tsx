import { Select } from '@base-ui/react/select';
import { CheckIcon, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function LanguageSwitch() {
  const { t, i18n } = useTranslation();

  const items = [
    { value: 'de', label: t('header.languageOptions.de') },
    { value: 'en', label: t('header.languageOptions.en') },
  ];

  return (
    <div className="flex flex-col">
      <Select.Root
        items={items}
        value={i18n.language}
        onValueChange={(value) => i18n.changeLanguage(value ?? undefined)}
      >
        <Select.Label className="cursor-default text-sm/5 font-medium text-gray-900">
          {t('header.language')}
        </Select.Label>
        <Select.Trigger className="flex h-10 min-w-40 cursor-pointer items-center justify-between gap-3 rounded-md border border-gray-200 bg-[canvas] pr-3 pl-3.5 text-base text-gray-900 select-none hover:bg-gray-100 focus-visible:outline-2 focus-visible:-outline-offset-1 data-popup-open:bg-gray-100">
          <Select.Value className="data-placeholder:opacity-60" />
          <Select.Icon className="flex">
            <ChevronDown />
          </Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Positioner
            className="z-10 outline-hidden select-none"
            sideOffset={8}
          >
            <Select.Popup className="group min-w-(--anchor-width) origin-(--transform-origin) rounded-md bg-[canvas] bg-clip-padding text-gray-900 shadow-lg shadow-gray-200 outline-1 outline-gray-200 transition-[transform,scale,opacity] data-ending-style:scale-90 data-ending-style:opacity-0 data-starting-style:scale-90 data-starting-style:opacity-0 data-[side=none]:min-w-[calc(var(--anchor-width)+1rem)] data-[side=none]:data-ending-style:transition-none data-[side=none]:data-starting-style:scale-100 data-[side=none]:data-starting-style:opacity-100 data-[side=none]:data-starting-style:transition-none dark:shadow-none dark:outline-gray-300">
              <Select.ScrollUpArrow className="top-0 z-1 flex h-4 w-full cursor-default items-center justify-center rounded-md bg-[canvas] text-center text-xs before:absolute before:left-0 before:size-full before:content-[''] data-[side=none]:before:-top-full" />
              <Select.List className="relative max-h-(--available-height) scroll-py-6 overflow-y-auto py-1">
                {items.map(({ label, value }) => (
                  <Select.Item
                    key={label}
                    value={value}
                    className="grid cursor-pointer grid-cols-[0.75rem_1fr] items-center gap-2 py-2 pr-4 pl-2.5 text-sm/4 outline-hidden select-none group-data-[side=none]:pr-12 group-data-[side=none]:text-base/4 data-highlighted:relative data-highlighted:z-0 data-highlighted:text-gray-50 data-highlighted:before:absolute data-highlighted:before:inset-x-1 data-highlighted:before:inset-y-0 data-highlighted:before:z-[-1] data-highlighted:before:rounded-xs data-highlighted:before:bg-gray-900 pointer-coarse:py-2.5 pointer-coarse:text-[0.925rem]"
                  >
                    <Select.ItemIndicator className="col-start-1">
                      <CheckIcon className="size-3" />
                    </Select.ItemIndicator>
                    <Select.ItemText className="col-start-2">
                      {label}
                    </Select.ItemText>
                  </Select.Item>
                ))}
              </Select.List>
              <Select.ScrollDownArrow className="bottom-0 z-1 flex h-4 w-full cursor-default items-center justify-center rounded-md bg-[canvas] text-center text-xs before:absolute before:left-0 before:size-full before:content-[''] data-[side=none]:before:-bottom-full" />
            </Select.Popup>
          </Select.Positioner>
        </Select.Portal>
      </Select.Root>
    </div>
  );
}
