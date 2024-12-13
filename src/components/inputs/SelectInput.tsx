import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import BaseInputProps from './BaseInputProps';

export interface SelectInputProps extends BaseInputProps {
  options: Record<string, string>;
  multiSelect?: boolean;
  defaultValue: string;
}

export default function SelectInput(data: SelectInputProps) {
  function handleSelect(value: string) {
    data.onChange(value);
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
  return (
    <Select name={data.title} onValueChange={handleSelect}>
      <SelectTrigger>
        <SelectValue value={data.value} />
      </SelectTrigger>
      <SelectContent value={data.value} multiple={data.multiSelect}>
        {Object.keys(data.options).map(o => {
          return (
            <SelectItem key={o} value={o}>
              {data.options[o]}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
