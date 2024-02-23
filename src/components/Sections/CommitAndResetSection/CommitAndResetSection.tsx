import { useMemo } from 'preact/hooks';
import { useQRScoutState } from '../../../store/store';
import { CommitButton } from './CommitButton';
import { ResetButton } from './ResetButton';

export type CommitAndResetSectionProps = {
  onCommit: () => void;
};

export function CommitAndResetSection({
  onCommit,
}: CommitAndResetSectionProps) {
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
    <div className="mb-4 flex flex-col justify-center rounded bg-white py-2 shadow-md dark:bg-gray-600">
      <CommitButton
        disabled={missingRequiredFields.length > 0}
        onClick={onCommit}
      />
      <ResetButton />
    </div>
  );
}
