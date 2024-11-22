import { Button } from '@/components/ui/button';
import { Minus, Plus } from 'lucide-react';
import BaseInputProps from './BaseInputProps';

export interface CounterInputProps extends BaseInputProps {
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: number;
}

export default function CounterInput(data: CounterInputProps) {
  function handleChange(increment: number) {
    const newVal = data.value + increment;
    if (data.max !== undefined && newVal > data.max) {
      // Don't fire the event if the new value would be greater than the max
      return;
    }
    if (data.min !== undefined && newVal < data.min) {
      // Don't fire the event if the new value would be less than the min
      return;
    }

    data.onChange(newVal);
  }

  return (
    <div className="my-2 flex flex-row items-center justify-center">
      <Button variant="outline" onClick={() => handleChange(-(data.step || 1))}>
        <Minus />
      </Button>
      <h2 className="px-4 text-2xl dark:text-white">{data.value}</h2>
      <Button variant="outline" onClick={() => handleChange(data.step || 1)}>
        <Plus />
      </Button>
    </div>
  );
}
