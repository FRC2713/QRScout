import React from 'react';
import { inputSelector, useQRScoutState } from '../../store/store';
import { Textarea } from '../ui/textarea';
import { StringInputProps } from './BaseInputProps';

export default function StringInput(props: StringInputProps) {
  const data = useQRScoutState(inputSelector(props.section, props.code));

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    props.onChange(e.currentTarget.value);
    e.preventDefault();
  }

  if (!data) {
    return <div>Invalid input</div>;
  }

  return (
    <Textarea
      disabled={data.disabled}
      name={`${data.title}_input`}
      id={`${data.title}_input`}
      onChange={handleChange}
      value={data.value as string}
      maxLength={props.max}
      minLength={props.min}
    />
  );
}
