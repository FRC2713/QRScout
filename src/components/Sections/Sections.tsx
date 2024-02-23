import { useQRScoutState } from '../../store/store';
import FormSection from './FormSection';

export function Sections() {
  const formData = useQRScoutState(state => state.formData);
  return (
    <>
      {formData.sections.map(section => {
        return <FormSection key={section.name} name={section.name} />;
      })}
    </>
  );
}
