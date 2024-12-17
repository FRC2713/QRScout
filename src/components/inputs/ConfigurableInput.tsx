import { inputSelector, updateValue, useQRScoutState } from '../../store/store';
import CheckboxInput from './CheckboxInput';
import CounterInput from './CounterInput';
import NumberInput from './NumberInput';
import RangeInput from './RangeInput';
import SelectInput from './SelectInput';
import StringInput from './StringInput';
import TimerInput from './TimerInput';

export interface ConfigurableInputProps {
  section: string;
  code: string;
}

export default function ConfigurableInput(props: ConfigurableInputProps) {
  const input = useQRScoutState(inputSelector(props.section, props.code));

  function handleChange(data: any) {
    updateValue(props.section, props.code, data);
  }

  if (!input) {
    return (
      <div>{`INPUT ${props.code} not found in section ${props.section}`} </div>
    );
  }

  switch (input.type) {
    case 'text':
      return (
        <StringInput
          key={input.title}
          {...input}
          onChange={handleChange}
          section={props.section}
        />
      );
    case 'select':
      return (
        <SelectInput
          key={input.title}
          {...input}
          defaultValue={input.defaultValue}
          onChange={handleChange}
          section={props.section}
        />
      );
    case 'number':
      return (
        <NumberInput
          key={input.title}
          {...input}
          onChange={handleChange}
          defaultValue={input.defaultValue}
          section={props.section}
        />
      );
    case 'boolean':
      return (
        <CheckboxInput
          key={input.title}
          {...input}
          onChange={handleChange}
          section={props.section}
        />
      );
    case 'counter':
      return (
        <CounterInput
          key={input.title}
          {...input}
          onChange={handleChange}
          section={props.section}
        />
      );
    case 'range':
      return (
        <RangeInput
          key={input.title}
          {...input}
          min={input.min}
          max={input.max}
          defaultValue={input.defaultValue as number}
          onChange={handleChange}
          section={props.section}
        />
      );
    case 'timer':
      return (
        <TimerInput
          key={input.title}
          {...input}
          defaultValue={input.defaultValue as number}
          onChange={handleChange}
          section={props.section}
        />
      );
  }
}
