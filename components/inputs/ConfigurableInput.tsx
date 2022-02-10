import React from 'react'
import BaseInputProps from './BaseInputProps'
import Checkbox from './CheckboxInput'
import CounterInput from './CounterInput'
import NumberInput from './NumberInput'
import RangeInput from './RangeInput'
import SelectInput from './SelectInput'
import StringInput from './StringInput'

export interface ConfigurableInputProps extends BaseInputProps {
  onValueChange: (code: string, value: any) => void
}

export default function ConfigurableInput(props: ConfigurableInputProps) {
  function handleChange(data: any) {
    props.onValueChange(props.code, data)
  }

  switch (props.type) {
    case 'text':
      return (
        <StringInput key={props.title} {...props} onChange={handleChange} />
      )
    case 'select':
      return (
        <SelectInput
          key={props.title}
          {...props}
          options={props.choices || { fail: 'no choices provided' }}
          defaultValue={props.defaultValue}
          onChange={handleChange}
        />
      )
    case 'number':
      return (
        <NumberInput key={props.title} {...props} onChange={handleChange} />
      )
    case 'boolean':
      return <Checkbox key={props.title} {...props} onChange={handleChange} />
    case 'counter':
      return (
        <CounterInput key={props.title} {...props} onChange={handleChange} />
      )
    case 'range':
      return (
        <RangeInput
          key={props.title}
          {...props}
          min={props.min}
          max={props.max}
          defaultValue={props.defaultValue as number}
          onChange={handleChange}
        />
      )
    default:
      return (
        <div className="py-2 px-1">
          <label
            htmlFor={props.title}
            className="mb-2 block text-sm font-bold text-gray-700"
          >
            {props.title}
          </label>
          <p
            className="text-red-800"
            id={props.title}
          >{`No Renderer for type: ${props.type}`}</p>
        </div>
      )
  }
}
