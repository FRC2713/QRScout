import { Copy, QrCode } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useMemo } from 'react';
import { getFieldValue, useQRScoutState } from '../../store/store';
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

export function QRModal(props: QRModalProps) {
  const fieldValues = useQRScoutState(state => state.fieldValues);
  const formData = useQRScoutState(state => state.formData);
  const title = `${getFieldValue('robot')} - M${getFieldValue(
    'matchNumber',
  )}`.toUpperCase();

  const qrCodeData = useMemo(
    () => fieldValues.map(f => f.value).join(formData.delimiter),
    [fieldValues],
  );
  //Two seperate values are required- qrCodePreview is what is shown to the user beneath the QR code, qrCodeData is the actual data.

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button disabled={props.disabled}>
          <QrCode className="size-5" />
          Commit
        </Button>
      </DialogTrigger>
      <DialogContent className="h-[95%]">
        <DialogTitle className="text-3xl text-primary text-center font-rhr-ns tracking-wider ">
          {title}
        </DialogTitle>
        <div className="flex flex-col items-center gap-6 overflow-y-scroll">
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
