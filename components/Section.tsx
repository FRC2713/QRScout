import React from 'react'
import { InputProps } from './inputs/BaseInputProps'
import ConfigurableInput from './inputs/ConfigurableInput'
import InputCard from './inputs/InputCard'
import { useQRScoutState } from './store/store'

interface SectionProps {
  name: string
}

export default function Section(props: SectionProps) {
  const formData = useQRScoutState((state) => state.formData)
  const inputs = formData.sections.find((s) => s.name === props.name)?.fields
  return (
    <div
      className="mb-4 rounded bg-gray-100 shadow-md dark:bg-gray-600"
      key={props.name}
    >
      <div className="mb-2 rounded-t bg-red-rhr p-1 shadow-md">
        <h2 className="font-rhr-ns text-2xl uppercase text-white dark:text-black">
          {props.name}
        </h2>
      </div>
      <div className="flex flex-col justify-start gap-2">
        {inputs?.map((e: InputProps) => (
          <InputCard
            title={e.title}
            required={e.required}
            hasValue={
              e.value !== null && e.value !== undefined && e.value !== ''
            }
            key={`${props.name}_${e.title}`}
          >
            <ConfigurableInput section={props.name} code={e.code} />
          </InputCard>
        ))}
      </div>
    </div>
  )
}
