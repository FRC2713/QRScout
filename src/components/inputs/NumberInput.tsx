import { useEvent } from '@/hooks';
import { inputSelector, updateValue, useQRScoutState } from '@/store/store';
import React, { useCallback, useEffect } from 'react';
import { Input } from '../ui/input';
import { NumberInputData } from './BaseInputProps';
import { ConfigurableInputProps } from './ConfigurableInput';

export default function NumberInput(props: ConfigurableInputProps) {
  const data = useQRScoutState(
    inputSelector<NumberInputData>(props.section, props.code),
  );

  if (!data) {
    return <div>Invalid input</div>;
  }

  const [value, setValue] = React.useState<number | ''>(data.defaultValue);

  const resetState = useCallback(
    ({ force }: { force: boolean }) => {
      console.log(
        `resetState ${data.code}`,
        `force: ${force}`,
        `behavior: ${data.formResetBehavior}`,
      );
      if (force) {
        setValue(data.defaultValue);
        return;
      }
      switch (data.formResetBehavior) {
        case 'reset':
          setValue(data.defaultValue);
          return;
        case 'increment':
          setValue(prev => (typeof prev === 'number' ? prev + 1 : 1));
          return;
        case 'preserve':
          return;
        default:
          return;
      }
    },
    [data.defaultValue, value],
  );

  useEvent('resetFields', resetState);

  useEffect(() => {
    updateValue(props.code, value);
  }, [value]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const parsed = Number(e.currentTarget.value);
      if (e.currentTarget.value === '') {
        setValue('');
        return;
      }
      if (isNaN(parsed)) {
        return;
      }
      if (data?.min && parsed < data.min) {
        return;
      }
      if (data?.max && parsed > data.max) {
        return;
      }
      setValue(parsed);
      e.preventDefault();
    },
    [data],
  );

  return (
    <Input
      type="number"
      value={value}
      id={data.title}
      min={data.min}
      max={data.max}
      onChange={handleChange}
    />
  );
}
