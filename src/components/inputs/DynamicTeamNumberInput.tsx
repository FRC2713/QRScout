import { useEvent } from '@/hooks';
import { getFieldValue, inputSelector, updateValue, useQRScoutState } from '@/store/store';
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

export default function DynamicTeamNumberInput(props: ConfigurableInputProps) {
  const data = useQRScoutState(
    inputSelector<NumberInputData>(props.section, props.code),
  );
  const matchData = useQRScoutState(state => state.matchData);
  const robotPosition = useQRScoutState(state => {
    const value = getFieldValue('robot');
    return value ? value.toString() : '';
  });
  const selectedMatchNumber = useQRScoutState(state => {
    const value = getFieldValue('matchNumber');
    return typeof value === 'number' ? value : null;
  });

  if (!data) {
    return <div>Invalid input</div>;
  }

  const [value, setValue] = React.useState<number | ''>(data.defaultValue);

  // Find the appropriate team number based on selected match and robot position
  const teamOptions = useMemo(() => {
    if (!matchData || matchData.length === 0 || !selectedMatchNumber || !robotPosition) {
      return [];
    }

    const match = matchData.find(
      m => m.comp_level === 'qm' && m.match_number === selectedMatchNumber
    );

    if (!match) return [];

    // Extract team numbers based on the robot position (R1, R2, R3, B1, B2, B3)
    const alliance = robotPosition.startsWith('R') ? 'red' : 'blue';
    const position = parseInt(robotPosition.slice(1)) - 1; // Convert R1/B1 to array index 0
    
    if (position < 0 || position >= 3) return [];

    const teamKey = match.alliances[alliance].team_keys[position];
    // Team keys are in the format "frc2713", so remove the "frc" prefix
    const teamNumber = parseInt(teamKey.substring(3));
    
    return isNaN(teamNumber) ? [] : [teamNumber];
  }, [matchData, selectedMatchNumber, robotPosition]);

  const resetState = useCallback(
    ({ force }: { force: boolean }) => {
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

  // Auto-set the team number if we have a valid option from the match data
  useEffect(() => {
    if (teamOptions.length === 1) {
      setValue(teamOptions[0]);
    }
  }, [teamOptions]);

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

  // Use a dropdown select if we have team options, otherwise use a regular number input
  if (teamOptions.length > 0) {
    return (
      <Select 
        name={data.title} 
        onValueChange={handleSelectChange} 
        value={value.toString()}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select a team" />
        </SelectTrigger>
        <SelectContent>
          {teamOptions.map(teamNum => (
            <SelectItem key={teamNum} value={teamNum.toString()}>
              Team {teamNum}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  // Fall back to standard number input if no team options are available
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