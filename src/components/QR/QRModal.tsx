import { useMemo, useRef } from 'preact/hooks';
import QRCode from 'qrcode.react';
import { useOnClickOutside } from '../../hooks/useOnClickOutside';
import { getFieldValue, useQRScoutState } from '../../store/store';
import { Config } from '../inputs/BaseInputProps';
import { CloseButton } from './CloseButton';
import { PreviewText } from './PreviewText';

export interface QRModalProps {
  show: boolean;
  onDismiss: () => void;
}

export function getQRCodeData(formData: Config): string {
  return formData.sections
    .map(s => s.fields)
    .flat()
    .map(v => `${v.value}`.replace(/\n/g, ' '))
    .join('\t');
}

export function QRModal(props: QRModalProps) {
  const modalRef = useRef(null);
  const formData = useQRScoutState(state => state.formData);
  useOnClickOutside(modalRef, props.onDismiss);

  const title = `${getFieldValue('robot')} - M${getFieldValue(
    'matchNumber',
  )}`.toUpperCase();

  const qrCodeData = useMemo(() => getQRCodeData(formData), [formData]);
  return (
    <>
      {props.show && (
        <>
          <div
            className="fixed inset-0 h-full w-full overflow-y-auto bg-gray-600 bg-opacity-50 dark:bg-opacity-70 backdrop-blur-sm "
            id="my-modal"
          />
          <div
            ref={modalRef}
            className="fixed top-20 rounded-md bg-white border p-5 shadow-lg w-96"
          >
            <div className="flex flex-col items-center ">
              <h1 className="text-4xl text-black font-mono ">{title}</h1>
              <CloseButton onClick={props.onDismiss} />
              <QRCode className="m-2 mt-4" size={256} value={qrCodeData} />
              <div className="h-1 w-full border-t border-gray-800 my-2" />
              <PreviewText data={qrCodeData} />
            </div>
          </div>
        </>
      )}
    </>
  );
}
