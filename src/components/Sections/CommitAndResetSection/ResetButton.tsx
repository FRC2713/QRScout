import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ListRestart } from 'lucide-react';
import { resetFields } from '../../../store/store';
import { Modal } from '@/components/core/Modal';

export type ResetButtonProps = {
  disabled?: boolean;
};

export function ResetButton(props: ResetButtonProps) {
  const [showModal, setShowModal] = useState(false);

  const onConfirm = () => {
    resetFields();
    setShowModal(false);
  };

  const onCancel = () => {
    setShowModal(false);
  };

  return (
    <>
      <Button
        variant="destructive"
        onClick={() => setShowModal(true)}
        disabled={props.disabled}
      >
        <ListRestart className="h-5 w-5" />
        Reset Form
      </Button>
      <Modal show={showModal} onDismiss={onCancel}>
        <div className="p-4">
          <h2 className="font-semibold text-3xl text-primary text-center font-rhr-ns tracking-wider">Confirm Reset</h2>
          <p>Are you sure you want to reset the form?</p>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={onCancel} className="w-full sm:w-auto">
              No
            </Button>
            <Button variant="destructive" onClick={onConfirm} className="w-full sm:w-auto">
              Yes
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
