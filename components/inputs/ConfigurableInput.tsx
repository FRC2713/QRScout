import React from 'react'
import { inputSelector, updateValue, useQRScoutState } from '../store/store'
import BaseInputProps, { InputProps } from './BaseInputProps'
import Checkbox from './CheckboxInput'
import CounterInput from './CounterInput'
import NumberInput from './NumberInput'
import RangeInput from './RangeInput'
import SelectInput from './SelectInput'
import StringInput from './StringInput'

export interface ConfigurableInputProps {
  section: string
  code: string
}

export default function ConfigurableInput(props: ConfigurableInputProps) {
  const input = useQRScoutState(inputSelector(props.section, props.code))

  function handleChange(data: any) {
    updateValue(props.section, props.code, data)
  }

  if (!input) {
    return (
      <div>{`INPUT ${props.code} not found in section ${props.section}`} </div>
    )
  }

  switch (input.type) {
    case 'text':
      return (
        <StringInput
          key={input.title}
          {...input}
          onChange={handleChange}
          section={props.section}
        />
      )
    case 'select':
      return (
        <SelectInput
          key={input.title}
          {...input}
          options={input.choices || { fail: 'no choices provided' }}
          defaultValue={input.defaultValue}
          onChange={handleChange}
          section={props.section}
        />
      )
    case 'number':
      return (
        <NumberInput
          key={input.title}
          {...input}
          onChange={handleChange}
          section={props.section}
        />
      )
    case 'boolean':
      return (
        <Checkbox
          key={input.title}
          {...input}
          onChange={handleChange}
          section={props.section}
        />
      )
    case 'counter':
      return (
        <CounterInput
          key={input.title}
          {...input}
          onChange={handleChange}
          section={props.section}
        />
      )
    case 'range':
      return (
        <RangeInput
          key={input.title}
          {...input}
          min={input.min}
          max={input.max}
          defaultValue={input.defaultValue as number}
          onChange={handleChange}
          section={props.section}
        />
      )
    default:
      return (
        <div className="py-2 px-1">
          <label
            htmlFor={input.title}
            className="mb-2 block text-sm font-bold text-gray-700"
          >
            {input.title}
          </label>
          <p
            className="text-red-rhr"
            id={input.title}
          >{`No Renderer for type: ${input.type}`}</p>
        </div>
      )
  }
}
