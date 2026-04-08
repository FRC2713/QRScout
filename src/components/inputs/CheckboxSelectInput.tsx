import { useEvent } from '@/hooks';
import { inputSelector, updateValue, useQRScoutState } from '@/store/store';
import { ChevronDown } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { CheckboxSelectInputData } from './BaseInputProps';
import { ConfigurableInputProps } from './ConfigurableInput';

export default function CheckboxSelectInput(props: ConfigurableInputProps) {
  const data = useQRScoutState(
    inputSelector<CheckboxSelectInputData>(props.section, props.code),
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
      if (force) {
        setSelectedValues(data.defaultValue || []);
        return;
      }
      if (data.formResetBehavior === 'preserve') {
        return;
      }
      setSelectedValues(data.defaultValue || []);
    },
    [data.defaultValue, data.formResetBehavior],
  );

  useEvent('resetFields', resetState);

  const handleCheckedChange = useCallback((value: string, checked: boolean) => {
    setSelectedValues(prev => {
      if (checked) {
        if (prev.includes(value)) {
          return prev;
        }
        return [...prev, value];
      }

      return prev.filter(selectedValue => selectedValue !== value);
    });
  }, []);

  if (!data.choices) {
    return <div>Invalid input</div>;
  }

  const selectedLabel =
    selectedValues.length > 0
      ? selectedValues.map(value => data.choices?.[value] ?? value).join(', ')
      : 'Select options...';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="w-full justify-between font-normal"
        >
          <span className="truncate">{selectedLabel}</span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)]">
        {Object.entries(data.choices).map(([value, label]) => (
          <DropdownMenuCheckboxItem
            key={value}
            checked={selectedValues.includes(value)}
            onCheckedChange={checked =>
              handleCheckedChange(value, checked === true)
            }
            onSelect={event => event.preventDefault()}
          >
            {label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
