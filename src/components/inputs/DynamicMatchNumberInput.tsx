import { useEvent } from '@/hooks';
import { inputSelector, updateValue, useQRScoutState } from '@/store/store';
import React, { useCallback, useEffect, useMemo } from 'react';
import { NumberInputData } from './BaseInputProps';
import { ConfigurableInputProps } from './ConfigurableInput';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { MatchData } from '@/types/matchData';

export default function DynamicMatchNumberInput(props: ConfigurableInputProps) {
  const data = useQRScoutState(
    inputSelector<NumberInputData>(props.section, props.code),
  );
  const matchData = useQRScoutState(state => state.matchData);

  if (!data) {
    return <div>Invalid input</div>;
  }

  const [value, setValue] = React.useState<number | ''>(data.defaultValue);

  // Generate a list of unique match numbers, sorted in ascending order
  const matchNumbers = useMemo(() => {
    if (!matchData || matchData.length === 0) return [];
    
    return Array.from(
      new Set(
        matchData
          .filter(m => m.comp_level === 'qm') // Only use qualification matches
          .map(m => m.match_number)
      )
    ).sort((a, b) => a - b);
  }, [matchData]);

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

  const handleSelectChange = useCallback((value: string) => {
    setValue(Number(value));
  }, []);

  // Use a dropdown select if we have match data, otherwise use a regular number input
  if (matchData && matchData.length > 0 && matchNumbers.length > 0) {
    return (
      <Select 
        name={data.title} 
        onValueChange={handleSelectChange} 
        value={value.toString()}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select a match" />
        </SelectTrigger>
        <SelectContent>
          {matchNumbers.map(matchNum => (
            <SelectItem key={matchNum} value={matchNum.toString()}>
              Qualification {matchNum}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  // Fall back to standard number input if no match data is available
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
