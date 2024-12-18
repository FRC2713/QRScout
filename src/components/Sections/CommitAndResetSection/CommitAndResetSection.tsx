import { QRModal } from '@/components/QR';
import { useMemo } from 'react';
import { useQRScoutState } from '../../../store/store';
import { Section } from '../../core/Section';
import { ResetButton } from './ResetButton';

export function CommitAndResetSection() {
  const formData = useQRScoutState(state => state.formData);
  const fieldValues = useQRScoutState(state => state.fieldValues);

  const requiredFields = useMemo(() => {
    return formData.sections
      .map(s => s.fields)
      .flat()
      .filter(f => f.required)
      .map(f => f.code);
  }, [formData]);

  const missingRequiredFields = useMemo(() => {
    return requiredFields.some(
      rf => !fieldValues.find(fv => fv.code === rf)?.value,
    );
  }, [formData]);

  return (
    <Section>
      <QRModal disabled={missingRequiredFields} />
      <ResetButton />
    </Section>
  );
}
