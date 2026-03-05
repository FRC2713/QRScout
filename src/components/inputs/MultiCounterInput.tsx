import { Button } from '@/components/ui/button';
import { useEvent } from '@/hooks';
import { inputSelector, updateValue, useQRScoutState } from '@/store/store';
import { useCallback, useEffect, useState } from 'react';
import { MultiCounterInputData } from './BaseInputProps';
import { ConfigurableInputProps } from './ConfigurableInput';

const INCREMENTS = [1, 5, 10];

export default function MultiCounterInput(props: ConfigurableInputProps) {
  const data = useQRScoutState(
    inputSelector<MultiCounterInputData>(props.section, props.code),
  );

  if (!data) {
    return <div>Invalid input</div>;
  }

  const [value, setValue] = useState(data.defaultValue);

  const resetState = useCallback(
    ({ force }: { force: boolean }) => {
      if (force) {
        setValue(data.defaultValue);
        return;
      }
      switch (data.formResetBehavior) {
        case 'reset':
          setValue(data.defaultValue);
          return;
        case 'preserve':
          return;
        default:
          return;
      }
    },
    [data.defaultValue, data.formResetBehavior],
  );

  useEvent('resetFields', resetState);

  const handleChange = useCallback(
    (increment: number) => {
      setValue(prev => Math.max(0, prev + increment));
    },
    [],
  );

  useEffect(() => {
    updateValue(props.code, value);
  }, [value, props.code]);

  return (
    <div className="flex flex-col items-center gap-3 py-3 px-2">
      <div className="text-4xl font-bold tabular-nums dark:text-white">
        {value}
      </div>
      <div className="flex w-full gap-2">
        {INCREMENTS.map(inc => (
          <Button
            key={`sub-${inc}`}
            variant="outline"
            className="flex-1 text-base font-semibold h-12 text-destructive border-destructive/30 hover:bg-transparent hover:text-destructive active:bg-destructive/10"
            onClick={() => handleChange(-inc)}
          >
            &minus;{inc}
          </Button>
        ))}
      </div>
      <div className="flex w-full gap-2">
        {INCREMENTS.map(inc => (
          <Button
            key={`add-${inc}`}
            variant="outline"
            className="flex-1 text-base font-semibold h-12 text-primary border-primary/30 hover:bg-transparent hover:text-primary active:bg-primary/10"
            onClick={() => handleChange(inc)}
          >
            +{inc}
          </Button>
        ))}
      </div>
    </div>
  );
}
