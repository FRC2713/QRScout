import { Copy } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useMemo } from 'react';
import { getFieldValue, useQRScoutState } from '../../store/store';
import { Config } from '../inputs/BaseInputProps';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { PreviewText } from './PreviewText';

export interface QRModalProps {
  disabled?: boolean;
}

export function getQRCodeData(formData: Config): string {
  return formData.sections
    .map(s => s.fields)
    .flat()
    .map(v => `${v.value}`.replace(/\n/g, ' '))
    .join(formData.delimiter);
}

export function QRModal(props: QRModalProps) {
  const formData = useQRScoutState(state => state.formData);

  const title = `${getFieldValue('robot')} - M${getFieldValue(
    'matchNumber',
  )}`.toUpperCase();

  const qrCodeData = useMemo(() => getQRCodeData(formData), [formData]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button disabled={props.disabled}>Commit</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle className="text-3xl text-primary text-center font-rhr-ns tracking-wider ">
          {title}
        </DialogTitle>
        <div className="flex flex-col items-center gap-6">
          <div className="bg-white p-4 rounded-md">
            <QRCodeSVG className="m-2 mt-4" size={256} value={qrCodeData} />
          </div>
          <PreviewText data={qrCodeData} />
        </div>
        <DialogFooter>
          <Button
            variant="ghost"
            onClick={() => navigator.clipboard.writeText(qrCodeData)}
          >
            <Copy className="size-4" /> Copy Data
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
