import { useRef } from 'react';
import { useOnClickOutside } from '../../hooks/useOnClickOutside';
import { CloseButton } from './CloseButton';

export interface ModalProps {
  show: boolean;
  onDismiss?: () => void;
  children?: React.ReactNode;
}

export function Modal(props: ModalProps) {
  const modalRef = useRef(null);
  useOnClickOutside(modalRef, () => props.onDismiss && props.onDismiss());

  return (
    <>
      {props.show && (
        <>
          <div
            className="fixed inset-0 h-full w-full overflow-y-auto bg-gray-500 bg-opacity-40 dark:bg-opacity-70 backdrop-blur "
            id="my-modal"
          />
          <div
            ref={modalRef}
            className="fixed top-20 rounded-md bg-white dark:bg-gray-600 shadow-md z-50 left-1/2 transform -translate-x-1/2 w-96"
          >
            <div className="flex flex-row justify-end">
              <CloseButton onClick={props.onDismiss} />
            </div>
            {props.children}
          </div>
        </>
      )}
    </>
  );
}
