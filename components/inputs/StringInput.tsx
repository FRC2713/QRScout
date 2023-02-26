import React from 'react'
import { inputSelector, useQRScoutState } from '../store/store'
import BaseInputProps from './BaseInputProps'

export interface StringInputProps extends BaseInputProps {
  maxSize?: number
}

export default function StringInput(props: StringInputProps) {
  const data = useQRScoutState(inputSelector(props.section, props.code))

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    props.onChange(e.target.value)
    e.preventDefault()
  }

  return (
    <textarea
      className="focus:shadow-outline w-full appearance-none break-words break-all rounded border leading-tight text-gray-700 shadow focus:outline-none dark:bg-gray-700 dark:text-white"
      disabled={data?.disabled}
      name={`${data?.title}_input`}
      id={`${data?.title}_input`}
      onChange={handleChange}
      defaultValue={data?.defaultValue || ''}
      value={data?.value || ''}
    ></textarea>
  )
}
