import { useQRScoutState } from '../../store/store';
import { Section } from '../core/Section';
import { InputProps } from '../inputs/BaseInputProps';
import ConfigurableInput from '../inputs/ConfigurableInput';
import InputCard from '../inputs/InputCard';

interface SectionProps {
  name: string;
}

export default function FormSection(props: SectionProps) {
  const formData = useQRScoutState(state => state.formData);
  const inputs = formData.sections.find(s => s.name === props.name)?.fields;
  return (
    <Section title={props.name}>
      {inputs?.map((e: InputProps) => (
        <InputCard
          title={e.title}
          required={e.required}
          hasValue={e.value !== null && e.value !== undefined && e.value !== ''}
          key={`${props.name}_${e.title}`}
        >
          <ConfigurableInput section={props.name} code={e.code} />
        </InputCard>
      ))}
    </Section>
  );
}
