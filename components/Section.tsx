import React from 'react'
import { InputProps } from './inputs/BaseInputProps'
import ConfigurableInput from './inputs/ConfigurableInput'
import InputCard from './inputs/InputCard'

interface SectionProps {
  name: string
  inputs: InputProps[]
  onValueChanged: (section: string, code: string, data: any) => void
}

export default function Section(props: SectionProps) {
  return (
    <div className="mb-4 rounded bg-white shadow-md" key={props.name}>
      <div className="mb-2 rounded-t bg-gray-900 p-1 shadow-md">
        <h2 className="text-2xl font-bold uppercase text-white">
          {props.name}
        </h2>
      </div>
      {props.inputs.map((e: InputProps) => (
        <InputCard
          title={e.title}
          required={e.required}
          hasValue={e.value !== null && e.value !== undefined && e.value !== ''}
          key={`${props.name}_${e.title}`}
        >
          <ConfigurableInput
            {...e}
            onChange={(data) => props.onValueChanged(props.name, e.code, data)}
          />
        </InputCard>
      ))}
    </div>
  )
}
