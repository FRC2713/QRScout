import { Button } from '@/components/ui/button';
import { Minus, Plus } from 'lucide-react';
import { CounterInputProps } from './BaseInputProps';

export default function CounterInput(props: CounterInputProps) {
  function handleChange(increment: number) {
    const newVal = props.value + increment;
    if (props.max !== undefined && newVal > props.max) {
      // Don't fire the event if the new value would be greater than the max
      return;
    }
    if (props.min !== undefined && newVal < props.min) {
      // Don't fire the event if the new value would be less than the min
      return;
    }

    props.onChange(newVal);
  }

  return (
    <div className="my-2 flex flex-row items-center justify-center">
      <Button
        variant="outline"
        onClick={() => handleChange(-(props.step || 1))}
      >
        <Minus />
      </Button>
      <h2 className="px-4 text-2xl dark:text-white">{props.value}</h2>
      <Button variant="outline" onClick={() => handleChange(props.step || 1)}>
        <Plus />
      </Button>
    </div>
  );
}
