import React, { useState } from 'react'
import BaseInputProps from './BaseInputProps'

export interface CounterInputProps extends BaseInputProps {
  min?: number
  max?: number
  step?: number
  defaultValue?: number
}

export default function CounterInput(data: CounterInputProps) {
  function handleChange(increment: number) {
    data.onChange(data.value + increment)
  }

  return (
    <div className="flex flex-row items-center justify-center ">
      <button
        className="focus:shadow-outline w-8 rounded bg-gray-500 text-2xl text-white hover:bg-red-700 focus:outline-none"
        type="button"
        onClick={() => handleChange(-(data.step || 1))}
      >
        -
      </button>
      <h2 className="px-4 text-2xl">{data.value}</h2>
      <button
        className="focus:shadow-outline w-8 rounded bg-gray-500 text-2xl  text-white hover:bg-red-700 focus:outline-none"
        type="button"
        onClick={() => handleChange(data.step || 1)}
      >
        +
      </button>
    </div>
  )
}
