import React, { useEffect } from 'react';
import { Switch } from '../ui/switch';
import BaseInputProps from './BaseInputProps';

export interface BoolInputProps extends BaseInputProps {
  onChange: (value: boolean) => void;
  defaultValue?: boolean;
}

export default function CheckboxInput(data: BoolInputProps) {
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
