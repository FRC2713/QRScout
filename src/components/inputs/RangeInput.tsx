import React from 'react';
import { Input } from '../ui/input';
import BaseInputProps from './BaseInputProps';

export default function RangeInput(data: BaseInputProps) {
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    data.onChange(e.currentTarget.value);
    e.preventDefault();
  }

  return (
    <Input
      className="w-full py-2 px-1"
      type="range"
      min={data.min}
      max={data.max}
      defaultValue={data.defaultValue}
      id={data.title}
      onChange={handleChange}
    />
  );
}
