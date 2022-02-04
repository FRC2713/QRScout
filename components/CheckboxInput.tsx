import React from 'react'
import BaseInputProps from './BaseInputProps'

export interface BoolInputProps extends BaseInputProps {
  defaultValue?: boolean
}

export default function Checkbox(data: BoolInputProps) {
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    data.onChange(e.target.checked)
  }

  return (
    <div className="py-2 px-1">
      <label
        htmlFor={data.title}
        className="mb-2 block text-sm font-bold text-gray-700"
      >
        {data.title}
      </label>
      <input
        type="checkbox"
        defaultChecked={data.defaultValue}
        id={data.title}
        onChange={handleChange}
      ></input>
    </div>
  )
}
