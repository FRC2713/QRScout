import { Button } from '@/components/ui/button';
import { resetFields } from '../../../store/store';

export type ResetButtonProps = {
  disabled?: boolean;
};

export function ResetButton(props: ResetButtonProps) {
  return (
    <Button
      variant="destructive"
      onClick={() => resetFields()}
      disabled={props.disabled}
    >
      Reset Form
    </Button>
  );
}
