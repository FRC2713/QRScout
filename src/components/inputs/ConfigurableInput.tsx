import { InputTypes } from './BaseInputProps';
import CheckboxInput from './CheckboxInput';
import CounterInput from './CounterInput';
import ImageInput from './ImageInput';
import DynamicMatchNumberInput from './DynamicMatchNumberInput';
import DynamicTeamNumberInput from './DynamicTeamNumberInput';
import NumberInput from './NumberInput';
import RangeInput from './RangeInput';
import SelectInput from './SelectInput';
import StringInput from './StringInput';
import TimerInput from './TimerInput';
import MultiSelectInput from './MultiSelectInput';
export interface ConfigurableInputProps {
  section: string;
  code: string;
  type: InputTypes;
}

export default function ConfigurableInput(props: ConfigurableInputProps) {
  // Special case handling for matchNumber and teamNumber fields
  if (props.type === 'number' && props.code === 'matchNumber') {
    return <DynamicMatchNumberInput {...props} key={props.code} />;
  }

  if (props.type === 'number' && props.code === 'teamNumber') {
    return <DynamicTeamNumberInput {...props} key={props.code} />;
  }

  // Standard input handling
  switch (props.type) {
    case 'text':
      return <StringInput {...props} key={props.code} />;
    case 'image':
      return <ImageInput {...props} key={props.code} />;
    case 'select':
      return <SelectInput {...props} key={props.code} />;
    case 'number':
      return <NumberInput {...props} key={props.code} />;
    case 'boolean':
      return <CheckboxInput {...props} key={props.code} />;
    case 'counter':
      return <CounterInput {...props} key={props.code} />;
    case 'range':
      return <RangeInput {...props} key={props.code} />;
    case 'timer':
      return <TimerInput {...props} key={props.code} />;
    case 'multi-select':
      return <MultiSelectInput {...props} key={props.code} />;
  }
}
