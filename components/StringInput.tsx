import React from 'react'
import BaseInputProps from './BaseInputProps'

export interface StringInputProps extends BaseInputProps {
  maxSize?: number
}

export default function StringInput(data: StringInputProps) {
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    let d: React.DetailedHTMLProps<
      React.InputHTMLAttributes<HTMLInputElement>,
      HTMLInputElement
    >
    data.onChange(e.target.value)
    e.preventDefault()
  }

  return (
    <div className="py-2 px-1">
      <label
        className="mb-2 block text-sm font-bold text-gray-700"
        htmlFor={`${data.title}_input`}
      >
        {data.title}
      </label>
      <input
        className="focus:shadow-outline w-full appearance-none rounded border py-2 px-3 leading-tight text-gray-700 shadow focus:outline-none"
        disabled={data.disabled}
        name={`${data.title}_input`}
        id={`${data.title}_input`}
        type="text"
        maxLength={data.maxSize}
        onChange={handleChange}
        value={data.value}
      ></input>
    </div>
  )
}
