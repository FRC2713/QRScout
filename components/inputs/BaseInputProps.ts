import React from 'react'

export default interface BaseInputProps extends InputProps {
  value: any
  onChange: (value: any) => void
}
export interface Config {
  title: string
  page_title: string
  sections: { [name: string]: InputProps[] }
}

export interface InputProps {
  type: InputTypes
  required: boolean
  // A shorthand code for this input
  code: string
  disabled?: boolean
  value?: any
  choices?: Record<string, string>
  defaultValue?: any
  min?: number
  max?: number
}

export type InputTypes =
  | 'text'
  | 'number'
  | 'boolean'
  | 'range'
  | 'select'
  | 'counter'
  | 'image'
