import { useEvent } from '@/hooks';
import { getFieldValue, inputSelector, updateValue, useQRScoutState } from '@/store/store';
import React, { useCallback, useEffect, useMemo } from 'react';
import { TeamAndRobotInputData } from './BaseInputProps';
import { ConfigurableInputProps } from './ConfigurableInput';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';

interface TeamAndRobotData {
  teamNumber: number;
  robotPosition: string;
}

export default function TeamAndRobotInput(props: ConfigurableInputProps) {
  const data = useQRScoutState(
    inputSelector<TeamAndRobotInputData>(props.section, props.code),
  );
  const matchData = useQRScoutState(state => state.matchData);
  const selectedMatchNumber = useQRScoutState(() => {
    const value = getFieldValue('matchNumber');
    return typeof value === 'number' ? value : null;
  });

  if (!data) {
    return <div>Invalid input</div>;
  }

  const [value, setValue] = React.useState<TeamAndRobotData | null>(
    data.defaultValue || null
  );

  // Find all team options from the selected match
  const teamOptions = useMemo(() => {
    if (!matchData || matchData.length === 0 || !selectedMatchNumber) {
      return [];
    }

    const match = matchData.find(
      m => m.comp_level === 'qm' && m.match_number === selectedMatchNumber
    );

    if (!match) return [];

    // Extract all team numbers from both alliances with their positions
    const teams: Array<{ teamNumber: number; robotPosition: string; alliance: string; position: number }> = [];

    // Red alliance teams
    match.alliances.red.team_keys.forEach((teamKey, index) => {
      const teamNumber = parseInt(teamKey.substring(3));
      if (!isNaN(teamNumber)) {
        teams.push({
          teamNumber,
          robotPosition: `R${index + 1}`,
          alliance: 'Red',
          position: index + 1,
        });
      }
    });

    // Blue alliance teams
    match.alliances.blue.team_keys.forEach((teamKey, index) => {
      const teamNumber = parseInt(teamKey.substring(3));
      if (!isNaN(teamNumber)) {
        teams.push({
          teamNumber,
          robotPosition: `B${index + 1}`,
          alliance: 'Blue',
          position: index + 1,
        });
      }
    });

    return teams;
  }, [matchData, selectedMatchNumber]);

  const resetState = useCallback(
    ({ force }: { force: boolean }) => {
      if (force) {
        setValue(data.defaultValue || null);
        return;
      }
      if (data.formResetBehavior === 'preserve') {
        return;
      }
      setValue(data.defaultValue || null);
    },
    [data.defaultValue, data.formResetBehavior],
  );

  useEvent('resetFields', resetState);

  useEffect(() => {
    updateValue(props.code, value);
  }, [value, props.code]);

  const handleSelectChange = useCallback((selectedValue: string) => {
    const [teamNumber, robotPosition] = selectedValue.split('|');
    setValue({
      teamNumber: parseInt(teamNumber),
      robotPosition,
    });
  }, []);

  const handleManualChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const parsed = Number(e.currentTarget.value);
      if (e.currentTarget.value === '') {
        setValue(null);
        return;
      }
      if (isNaN(parsed)) {
        return;
      }
      setValue({
        teamNumber: parsed,
        robotPosition: '',
      });
      e.preventDefault();
    },
    [],
  );

  // Use a dropdown select if we have team options, otherwise use a regular number input
  if (teamOptions.length > 0) {
    return (
      <Select
        name={data.title}
        onValueChange={handleSelectChange}
        value={value ? `${value.teamNumber}|${value.robotPosition}` : ''}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select a team" />
        </SelectTrigger>
        <SelectContent>
          {teamOptions.map(team => (
            <SelectItem
              key={`${team.teamNumber}|${team.robotPosition}`}
              value={`${team.teamNumber}|${team.robotPosition}`}
            >
              Team {team.teamNumber} ({team.alliance} {team.position})
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
      value={value?.teamNumber || ''}
      id={data.title}
      onChange={handleManualChange}
      placeholder="Enter team number"
    />
  );
}