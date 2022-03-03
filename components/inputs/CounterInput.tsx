import React from 'react'
import BaseInputProps from './BaseInputProps'

export interface CounterInputProps extends BaseInputProps {
  min?: number
  max?: number
  step?: number
  defaultValue?: number
}

export default function CounterInput(data: CounterInputProps) {
  function handleChange(increment: number) {
    const newVal = data.value + increment
    console.log('handling counter change', newVal)
    if (data.max && newVal > data.max) {
      console.log('max value reached')
      // Don't fire the event if the new value would be greater than the max
      return
    }
    if (data.min && newVal < data.min) {
      console.log('min value reached')
      // Don't fire the event if the new value would be less than the min
      return
    }

    data.onChange(newVal)
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
