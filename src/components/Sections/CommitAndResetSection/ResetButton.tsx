import { Button } from '@/components/ui/button';
import { resetSections } from '../../../store/store';

export type ResetButtonProps = {
  disabled?: boolean;
};

export function ResetButton(props: ResetButtonProps) {
  return (
    <Button
      variant="destructive"
      onClick={() => resetSections()}
      disabled={props.disabled}
    >
      Reset Form
    </Button>
  );
}
