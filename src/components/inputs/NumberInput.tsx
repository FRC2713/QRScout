import { useEvent } from '@/hooks';
import { inputSelector, updateValue, useQRScoutState } from '@/store/store';
import React, { useCallback, useEffect } from 'react';
import { Input } from '../ui/input';
import { NumberInputData } from './BaseInputProps';
import { ConfigurableInputProps } from './ConfigurableInput';

export default function NumberInput(props: ConfigurableInputProps) {
  const fieldConfig = useQRScoutState(
    inputSelector<NumberInputData>(props.section, props.code),
  );

  const fieldValue = useQRScoutState(state => state.fieldValues.find(f => f.code === fieldConfig?.code)?.value as number)

  if (!fieldConfig) {
    return <div>Invalid input</div>;
  }

  const [value, setValue] = React.useState<number | ''>(fieldValue);

  const resetState = useCallback(({force}: {force: boolean}) => {
    console.log('Reseting state', force);
    if (!force && (fieldConfig.preserveDataOnReset || props.preserveSection)) {
      console.log('autoIncrementOnReset:', fieldConfig.autoIncrementOnReset);
      if (fieldConfig.autoIncrementOnReset) {
        if(value !== undefined) {
          console.log(value);
          setValue((Number(value) + 1));
        };
      };
      return;
    } else {
      setValue(fieldConfig.defaultValue);
    }
  }, [fieldConfig.defaultValue]);

  useEvent('resetFields', resetState);

  useEffect(() => {
    console.log('value changed', value);
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
      if (fieldConfig?.min && parsed < fieldConfig.min) {
        return;
      }
      if (fieldConfig?.max && parsed > fieldConfig.max) {
        return;
      }
      setValue(parsed);
      e.preventDefault();
    },
    [fieldConfig],
  );

  return (
    <Input
      type="number"
      value={value}
      id={fieldConfig.title}
      min={fieldConfig.min}
      max={fieldConfig.max}
      onChange={handleChange}
    />
  );
}
