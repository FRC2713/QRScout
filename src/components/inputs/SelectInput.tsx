import clsx from 'clsx';
import React from 'react';
import BaseInputProps from './BaseInputProps';

export interface SelectInputProps extends BaseInputProps {
  options: Record<string, string>;
  multiSelect?: boolean;
  defaultValue: string;
}

export default function SelectInput(data: SelectInputProps) {
  function handleSelect(evt: React.ChangeEvent<HTMLSelectElement>) {
    evt.preventDefault();
    if (!data.multiSelect) {
      data.onChange(evt.currentTarget.value);
    } else {
      const selectedOptions = Array.from(evt.currentTarget.selectedOptions).map(
        o => o.value,
      );
      data.onChange(selectedOptions);
    }
  }
  return (
    <select
      className={clsx(
        'w-full rounded bg-white px-4 py-2 dark:bg-gray-700 dark:text-white ',
        data.multiSelect && 'overflow-hidden',
      )}
      size={data.multiSelect ? Object.keys(data.options).length : 1}
      name={data.title}
      id={data.title}
      onChange={handleSelect}
      value={data.value}
      multiple={data.multiSelect}
    >
      {Object.keys(data.options).map(o => {
        return (
          <option key={o} value={o}>
            {data.options[o]}
          </option>
        );
      })}
    </select>
  );
}
