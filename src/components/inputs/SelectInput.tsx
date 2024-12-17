import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { SelectInputProps } from './BaseInputProps';

export default function SelectInput(props: SelectInputProps) {
  function handleSelect(value: string) {
    props.onChange(value);
    // TODO support multiselect again
    // if (!data.multiSelect) {
    //   data.onChange(value);
    // } else {
    //   const selectedOptions = Array.from(evt.currentTarget.selectedOptions).map(
    //     o => o.value,
    //   );
    //   data.onChange(selectedOptions);
    // }
  }
  if (!props.choices) {
    return <div>Invalid input</div>;
  }
  return (
    <Select name={props.title} onValueChange={handleSelect} value={props.value}>
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {Object.keys(props.choices).map(o => {
          return (
            <SelectItem key={o} value={o}>
              {props.choices?.[o]}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
