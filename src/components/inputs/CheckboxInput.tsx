import { useEvent } from '@/hooks';
import { inputSelector, updateValue, useQRScoutState } from '@/store/store';
import React, { useEffect } from 'react';
import { Switch } from '../ui/switch';
import { BooleanInputData } from './BaseInputProps';
import { ConfigurableInputProps } from './ConfigurableInput';

export default function CheckboxInput(props: ConfigurableInputProps) {
  const data = useQRScoutState(
    inputSelector<BooleanInputData>(props.section, props.code),
  );

  if (!data) {
    return <div>Invalid input</div>;
  }

  const [checked, setChecked] = React.useState(data.defaultValue);

  const resetState = React.useCallback(
    ({ force }: { force: boolean }) => {
      if (force) {
        setChecked(data.defaultValue);
        return;
      }
      if (data.formResetBehavior === 'preserve') {
        return;
      }
      setChecked(data.defaultValue);
    },
    [data.defaultValue],
  );

  useEvent('resetFields', resetState);

  useEffect(() => {
    updateValue(props.code, checked);
  }, [checked]);

  return (
    <Switch
      checked={checked}
      onCheckedChange={setChecked}
      id={data.title}
      className="m-2"
    />
  );
}
