import React, { useState } from 'react'
import BaseInputProps from './BaseInputProps'

export interface NumberInputProps extends BaseInputProps {
  min?: number
  max?: number
  defaultValue?: number
}

export default function NumberInput(data: NumberInputProps) {
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
        type="number"
        min={data.min}
        max={data.max}
        defaultValue={data.defaultValue}
        id={data.title}
        onChange={handleChange}
      />
    </div>
  )
}
