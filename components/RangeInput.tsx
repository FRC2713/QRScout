import React from 'react'
import BaseInputProps from './BaseInputProps'

export default function RangeInput(data: BaseInputProps) {
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    data.onChange(e.target.value)
    e.preventDefault()
  }

  return (
    <input
      className="w-full py-2 px-1"
      type="range"
      min={data.min}
      max={data.max}
      defaultValue={data.defaultValue}
      id={data.title}
      onChange={handleChange}
    />
  )
}
