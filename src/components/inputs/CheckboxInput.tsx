import React, { useEffect } from 'react';
import { Switch } from '../ui/switch';
import { BooleanInputProps } from './BaseInputProps';

export default function CheckboxInput(data: BooleanInputProps) {
  const [checked, setChecked] = React.useState(data.value);

  useEffect(() => {
    data.onChange(checked);
  }, [checked]);

  return (
    <Switch
      checked={data.value}
      onCheckedChange={setChecked}
      id={data.title}
      className="m-2"
    />
  );
}
