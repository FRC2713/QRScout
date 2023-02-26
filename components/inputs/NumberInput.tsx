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
    <input
      className="w-full rounded py-2 dark:bg-gray-700 dark:text-white"
      type="number"
      min={data.min}
      max={data.max}
      defaultValue={data.defaultValue}
      id={data.title}
      onChange={handleChange}
    />
  )
}
