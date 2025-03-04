import { useEvent } from '@/hooks';
import { inputSelector, updateValue, useQRScoutState } from '@/store/store';
import { useCallback, useEffect, useState } from 'react';
import MultipleSelector from '../ui/multi-select';
import { MultiSelectInputData } from './BaseInputProps';
import { ConfigurableInputProps } from './ConfigurableInput';

export default function MultiSelectInput(props: ConfigurableInputProps) {
  const data = useQRScoutState(
    inputSelector<MultiSelectInputData>(props.section, props.code),
  );

  if (!data) {
    return <div>Invalid input</div>;
  }

  const [selectedValues, setSelectedValues] = useState<string[]>(
    data.defaultValue || [],
  );

  useEffect(() => {
    updateValue(props.code, selectedValues.join(','));
  }, [selectedValues, props.code]);

  const resetState = useCallback(
    ({ force }: { force: boolean }) => {
      console.log(
        `resetState ${data.code}`,
        `force: ${force}`,
        `behavior: ${data.formResetBehavior}`,
      );
      if (force) {
        setSelectedValues(data.defaultValue || []);
        return;
      }
      if (data.formResetBehavior === 'preserve') {
        return;
      }
      setSelectedValues(data.defaultValue || []);
    },
    [data.defaultValue, data.code, data.formResetBehavior],
  );

  useEvent('resetFields', resetState);

  const handleValueChange = useCallback(
    (options: { value: string; label: string }[]) => {
      setSelectedValues(options.map(option => option.value));
    },
    [],
  );

  if (!data || !data.choices) {
    return <div>Invalid input</div>;
  }

  // Convert choices object to array of options for MultiSelect
  const options = Object.entries(data.choices).map(([value, label]) => ({
    value,
    label,
  }));

  // Convert selected values to option objects with a type guard for data.choices
  const selectedOptions = selectedValues.map(value => {
    const label =
      data.choices && data.choices[value] ? data.choices[value] : value;
    return {
      value,
      label,
    };
  });

  return (
    <MultipleSelector
      options={options}
      value={selectedOptions}
      onChange={handleValueChange}
      placeholder="Select options..."
    />
  );
}
