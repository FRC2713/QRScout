import React from 'react'
import BaseInputProps from './BaseInputProps'

export interface SelectInputProps extends BaseInputProps {
  options: Record<string, string>
  defaultValue: string
}

export default function SelectInput(data: SelectInputProps) {
  function handleSelect(evt: React.ChangeEvent<HTMLSelectElement>) {
    data.onChange(evt.target.value)
    evt.preventDefault()
  }
  return (
    <select
      className="w-full rounded bg-white px-4 py-2 dark:bg-gray-700 dark:text-white"
      name={data.title}
      id={data.title}
      onChange={handleSelect}
      value={data.value}
    >
      {Object.keys(data.options).map((o) => {
        return (
          <option key={o} value={o}>
            {data.options[o]}
          </option>
        )
      })}
    </select>
  )
}
