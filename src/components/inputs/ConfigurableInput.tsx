import { InputTypes } from './BaseInputProps';
import CheckboxInput from './CheckboxInput';
import CounterInput from './CounterInput';
import ImageInput from './ImageInput';
import NumberInput from './NumberInput';
import RangeInput from './RangeInput';
import SelectInput from './SelectInput';
import StringInput from './StringInput';
import TimerInput from './TimerInput';
import MultiSelectInput from './MultiSelectInput';
import TBATeamAndRobotInput from './TBATeamAndRobotInput';
import TBAMatchNumberInput from './TBAMatchNumberInput';
export interface ConfigurableInputProps {
  section: string;
  code: string;
  type: InputTypes;
}

export default function ConfigurableInput(props: ConfigurableInputProps) {
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
    case 'TBA-team-and-robot':
      return <TBATeamAndRobotInput {...props} key={props.code} />;
    case 'TBA-match-number':
      return <TBAMatchNumberInput {...props} key={props.code} />;
  }
}
