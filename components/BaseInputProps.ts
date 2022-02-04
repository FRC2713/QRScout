import React from 'react'

export default interface BaseInputProps {
  title: string
  code: string
  disabled?: boolean
  value: any
  onChange: (value: any) => void
}
