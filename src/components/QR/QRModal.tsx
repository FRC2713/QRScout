import { useMemo } from 'preact/hooks';
import QRCode from 'qrcode.react';
import { getFieldValue, useQRScoutState } from '../../store/store';
import { Modal } from '../core/Modal';
import { Config } from '../inputs/BaseInputProps';
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
  const formData = useQRScoutState(state => state.formData);

  const title = `${getFieldValue('robot')} - M${getFieldValue(
    'matchNumber',
  )}`.toUpperCase();

  const qrCodeData = useMemo(() => getQRCodeData(formData), [formData]);
  return (
    <Modal show={props.show} onDismiss={props.onDismiss}>
      <div className="flex flex-col items-center pt-8 px-4 bg-white rounded-md">
        <QRCode className="m-2 mt-4" size={256} value={qrCodeData} />
        <h1 className="text-3xl text-gray-800 font-rhr-ns ">{title}</h1>
        <PreviewText data={qrCodeData} />
      </div>
    </Modal>
  );
}
