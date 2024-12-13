import { QRModal } from '@/components/QR';
import { useMemo } from 'preact/hooks';
import { useQRScoutState } from '../../../store/store';
import { Section } from '../../core/Section';
import { ResetButton } from './ResetButton';

export function CommitAndResetSection() {
  const formData = useQRScoutState(state => state.formData);
  const missingRequiredFields = useMemo(() => {
    return formData.sections
      .map(s => s.fields)
      .flat()
      .filter(
        f =>
          f.required &&
          (f.value === null || f.value === undefined || f.value === ``),
      );
  }, [formData]);

  return (
    <Section>
      <QRModal disabled={missingRequiredFields.length > 0} />
      <ResetButton />
    </Section>
  );
}
