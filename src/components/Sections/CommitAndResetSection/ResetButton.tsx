import { Button } from '@/components/ui/button';
import { ListRestart } from 'lucide-react';
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
      <ListRestart className="h-5 w-5" />
      Reset Form
    </Button>
  );
}
