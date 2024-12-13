import React from 'react';
import { Input } from '../ui/input';
import BaseInputProps from './BaseInputProps';

export interface NumberInputProps extends BaseInputProps {
  value?: number;
  min?: number;
  max?: number;
  defaultValue?: number;
}

export default function NumberInput(data: NumberInputProps) {
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    data.onChange(Number(e.currentTarget.value));
  }

  // TODO: Add min and max validation

  return (
    <Input
      type="number"
      value={data.value || data.defaultValue || ''}
      id={data.title}
      onChange={handleChange}
    />
  );
}
