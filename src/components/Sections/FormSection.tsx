import { useMemo } from 'react';
import { getFieldValue, useQRScoutState } from '../../store/store';
import { Section } from '../core/Section';
import { InputBase } from '../inputs/BaseInputProps';
import ConfigurableInput from '../inputs/ConfigurableInput';
import InputCard from '../inputs/InputCard';

interface SectionProps {
  name: string;
}

export default function FormSection(props: SectionProps) {
  const formData = useQRScoutState(state => state.formData);
  const section = useMemo(
    () => formData.sections.find(s => s.name === props.name),
    [formData, props.name],
  );
  const inputs = useMemo(() => section?.fields, [section]);

  return (
    <Section title={props.name}>
      {inputs?.map((input: InputBase) => (
        <InputCard
          title={input.title}
          required={input.required}
          hasValue={
            getFieldValue(input.code) !== null &&
            getFieldValue(input.code) !== undefined &&
            getFieldValue(input.code) !== ''
          }
          description={input.description}
          key={`${props.name}_${input.title}`}
        >
          <ConfigurableInput
            section={props.name}
            code={input.code}
            type={input.type}
          />
        </InputCard>
      ))}
    </Section>
  );
}
