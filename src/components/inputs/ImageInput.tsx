import { useEvent } from '@/hooks';
import React, { useCallback, useEffect } from 'react';
import { inputSelector, updateValue, useQRScoutState } from '../../store/store';
import { Card } from '../ui/card';
import { ImageInputData } from './BaseInputProps';
import { ConfigurableInputProps } from './ConfigurableInput';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogClose } from '../ui/dialog';

export default function ImageInput(props: ConfigurableInputProps) {
  const data = useQRScoutState(
    inputSelector<ImageInputData>(props.section, props.code),
  );
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  if (!data) {
    return <div>Invalid input</div>;
  }

  const [value, setValue] = React.useState(data.defaultValue);

  const resetState = useCallback(
    ({ force }: { force: boolean }) => {
      console.log(
        `resetState ${data.code}`,
        `force: ${force}`,
        `behavior: ${data.formResetBehavior}`,
      );
      if (force) {
        setValue(data.defaultValue);
        return;
      }
      if (data.formResetBehavior === 'preserve') {
        return;
      }
      setValue(data.defaultValue);
    },
    [data.defaultValue],
  );

  useEvent('resetFields', resetState);

  useEffect(() => {
    updateValue(props.code, value);
  }, [value]);

  if (!data) {
    return <div>Invalid input</div>;
  }

  // If no image URL is provided, show a placeholder
  if (!value) {
    return (
      <Card className="flex items-center justify-center p-4 bg-muted text-muted-foreground">
        No image provided
      </Card>
    );
  }

  return (
    <div className="relative">
      <img
        src={value}
        alt={data.alt || `${data.title} image`}
        className={cn(
          'w-full h-auto object-contain rounded-md cursor-pointer',
          data.disabled && 'opacity-50',
        )}
        style={{
          width: data.width ? `${data.width}px` : '100%',
          height: data.height ? `${data.height}px` : 'auto',
        }}
        onClick={() => setIsDialogOpen(true)}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-[90vw] max-h-[90vh] p-0 overflow-hidden">
          <div className="relative w-full h-full">
            <img
              src={value}
              alt={data.alt || `${data.title} image`}
              className="w-full h-full object-contain"
            />
            <DialogClose className="absolute right-2 top-2 rounded-full bg-background/80 p-2 hover:bg-background/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
              <span className="sr-only">Close</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
