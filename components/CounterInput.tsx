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
    <div className="py-2 px-1">
      <label
        htmlFor={data.title}
        className="mb-2 block text-sm font-bold text-gray-700"
      >
        {data.title}
      </label>
      <div className="flex flex-row items-center justify-center ">
        <button
          className="focus:shadow-outline mx-2 rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700 focus:outline-none"
          type="button"
          onClick={() => handleChange(-(data.step || 1))}
        >
          -
        </button>
        <h2 className="px-4 text-2xl">{data.value}</h2>
        <button
          className="focus:shadow-outline mx-2 rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700 focus:outline-none"
          type="button"
          onClick={() => handleChange(data.step || 1)}
        >
          +
        </button>
      </div>
    </div>
  )
}
