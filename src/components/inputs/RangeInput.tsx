import { Slider } from '../ui/slider';
import { RangeInputProps } from './BaseInputProps';

export default function RangeInput(props: RangeInputProps) {
  function handleChange(value: number[]) {
    props.onChange(value[0]);
  }

  return (
    <div className="flex flex-col items-center gap-2 p-2">
      <span className="capitalize text-secondary-foreground text-2xl">
        {props.value}
      </span>
      <Slider
        className="w-full py-2 px-1"
        min={props.min}
        max={props.max}
        value={[props.value || 0]}
        defaultValue={[props.defaultValue || 0]}
        id={props.title}
        onValueChange={handleChange}
      />
    </div>
  );
}
