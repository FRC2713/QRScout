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
    <div className="py-2 px-1">
      <label
        className="mb-2 block text-sm font-bold text-gray-700"
        htmlFor={data.title}
      >
        {data.title}
      </label>
      <select
        className="focus:shadow-outline block w-full appearance-none rounded border border-gray-400 bg-white px-4 py-2 pr-8 leading-tight shadow hover:border-gray-500 focus:outline-none"
        name={data.title}
        id={data.title}
        defaultValue={data.defaultValue}
        onChange={handleSelect}
      >
        {Object.keys(data.options).map((o) => {
          return (
            <option key={o} value={o}>
              {data.options[o]}
            </option>
          )
        })}
      </select>
    </div>
  )
}
