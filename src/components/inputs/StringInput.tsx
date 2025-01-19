import { useEvent } from '@/hooks';
import React, { useCallback, useEffect } from 'react';
import { inputSelector, updateValue, useQRScoutState } from '../../store/store';
import { Textarea } from '../ui/textarea';
import { StringInputData } from './BaseInputProps';
import { ConfigurableInputProps } from './ConfigurableInput';

export default function StringInput(props: ConfigurableInputProps) {
  const data = useQRScoutState(
    inputSelector<StringInputData>(props.section, props.code),
  );

  if (!data) {
    return <div>Invalid input</div>;
  }

  const [value, setValue] = React.useState(data.defaultValue);

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
      if (data.formResetBehavior === 'preserve') {
        return;
      }
      setValue(data.defaultValue);
    },
    [data.defaultValue],
  );

  useEvent('resetFields', resetState);

  useEffect(() => {
    updateValue(props.code, value);
  }, [value]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setValue(e.currentTarget.value);
      e.preventDefault();
    },
    [],
  );

  if (!data) {
    return <div>Invalid input</div>;
  }

  return (
    <Textarea
      disabled={data.disabled}
      name={`${data.title}_input`}
      id={`${data.title}_input`}
      onChange={handleChange}
      value={value}
      maxLength={data.max}
      minLength={data.min}
    />
  );
}
