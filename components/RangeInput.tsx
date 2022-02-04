import React from 'react'
import BaseInputProps from './BaseInputProps'

export interface RangeInputProps extends BaseInputProps {
  min: number
  max: number
  defaultValue: number
}

export default function RangeInput(data: RangeInputProps) {
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    data.onChange(e.target.value)
    e.preventDefault()
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
        type="range"
        min={data.min}
        max={data.max}
        defaultValue={data.defaultValue}
        id={data.title}
        onChange={handleChange}
      />
    </div>
  )
}
