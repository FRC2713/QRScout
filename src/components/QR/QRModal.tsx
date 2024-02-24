import { useMemo, useRef } from 'preact/hooks';
import QRCode from 'qrcode.react';
import { useOnClickOutside } from '../../hooks/useOnClickOutside';
import { getFieldValue, useQRScoutState, useApiState, ApiUrlState } from '../../store/store';
import { Config } from '../inputs/BaseInputProps';
import { CloseButton } from './CloseButton';
import { PreviewText } from './PreviewText';
import Button, { Variant } from '../core/Button';

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

function uploadToUrl(data: string, api: ApiUrlState, final: () => void = () => {}) {
  if (api.url !== undefined) {
    let opts: RequestInit = {
      method: 'POST',
      // mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: data,
        auth: api.auth
      }),
    };
    fetch(api.url, opts).finally(final);
  }
}

export function QRModal(props: QRModalProps) {
  const modalRef = useRef(null);
  const formData = useQRScoutState(state => state.formData);
  useOnClickOutside(modalRef, props.onDismiss);

  const title = `${getFieldValue('robot')} - M${getFieldValue(
    'matchNumber',
  )}`.toUpperCase();

  const qrCodeData = useMemo(() => getQRCodeData(formData), [formData]);
  const apiData = useApiState.getState();
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
            className="fixed top-20 rounded-md bg-white border shadow-lg w-96"
          >
            <div className="flex flex-col items-center pt-8 ">
              <CloseButton onClick={props.onDismiss} />
              <QRCode className="m-2 mt-4" size={256} value={qrCodeData} />
              <h1 className="text-3xl text-gray-800 font-rhr-ns ">{title}</h1>
              <PreviewText data={qrCodeData} />
              {apiData.url && <Button variant={Variant.Primary} onClick={() => uploadToUrl(qrCodeData, apiData, props.onDismiss)}>Upload</Button>}
            </div>
          </div>
        </>
      )}
    </>
  );
}
