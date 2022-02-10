import config from 'next/config'
import React from 'react'
import { InputProps } from './inputs/BaseInputProps'
import ConfigurableInput from './inputs/ConfigurableInput'
import InputCard from './inputs/InputCard'

interface SectionProps {
  name: string
  inputs: InputProps[]
  values: Record<string, any>
  onValueChanged: (code: string, data: any) => void
}

export default function Section(props: SectionProps) {
  return (
    <div className="mb-4 rounded bg-white shadow-md" key={props.name}>
      <div className="mb-2 rounded-t bg-red-800 p-1 shadow-md">
        <h2 className="text-2xl font-bold uppercase text-white">
          {props.name}
        </h2>
      </div>
      {props.inputs.map((e: any) => (
        <InputCard
          title={e.title}
          required={e.required}
          key={`${props.name}_${e.title}`}
        >
          <ConfigurableInput
            {...e}
            onValueChange={props.onValueChanged}
            value={props.values[e.code]}
          />
        </InputCard>
      ))}
    </div>
  )
}
