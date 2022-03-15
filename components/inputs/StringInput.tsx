import React from 'react'
import BaseInputProps from './BaseInputProps'

export interface StringInputProps extends BaseInputProps {
  maxSize?: number
}

export default function StringInput(data: StringInputProps) {
  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    let d: React.DetailedHTMLProps<
      React.InputHTMLAttributes<HTMLTextAreaElement>,
      HTMLTextAreaElement
    >
    data.onChange(e.target.value)
    e.preventDefault()
  }

  return (
    <textarea
      className="focus:shadow-outline w-full appearance-none break-words break-all rounded border py-2 px-3 leading-tight text-gray-700 shadow focus:outline-none"
      disabled={data.disabled}
      name={`${data.title}_input`}
      id={`${data.title}_input`}
      onChange={handleChange}
      defaultValue={data.defaultValue}
      value={data.value}
    ></textarea>
  )
}
