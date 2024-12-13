import { ConfigEditor } from '@/components/ConfigEditor';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useState } from 'react';
import {
  resetToDefaultConfig,
  setConfig,
  uploadConfig,
  useQRScoutState,
} from '../../../store/store';
import { Config } from '../../inputs/BaseInputProps';

/**
 * Download a text file
 * @param filename The name of the file
 * @param text The text to put in the file
 */
function download(filename: string, text: string) {
  var element = document.createElement('a');
  element.setAttribute(
    'href',
    'data:text/plain;charset=utf-8,' + encodeURIComponent(text),
  );
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

/**
 * Download the current form data as a json file
 * @param formData The form data to download
 */
function downloadConfig(formData: Config) {
  const configDownload = { ...formData };

  configDownload.sections.forEach(s =>
    s.fields.forEach(f => (f.value = undefined)),
  );
  download('QRScout_config.json', JSON.stringify(configDownload));
}

export function Settings() {
  const formData = useQRScoutState(state => state.formData);
  const [showEditor, setShowEditor] = useState(false);
  return (
    <div className="flex flex-col gap-4 px-6">
      <Button
        variant="secondary"
        onClick={() =>
          navigator.clipboard.writeText(
            formData.sections
              .map(s => s.fields)
              .flat()
              .map(f => f.title)
              .join('\t'),
          )
        }
      >
        Copy Column Names
      </Button>
      <Sheet open={showEditor} onOpenChange={setShowEditor}>
        <SheetTrigger asChild>
          <Button variant="secondary">Edit Config</Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="w-full h-full">
          <SheetHeader>
            <SheetTitle>Edit Config</SheetTitle>
          </SheetHeader>
          <ConfigEditor
            onCancel={() => setShowEditor(false)}
            onSave={configString => {
              setConfig(configString);
              setShowEditor(false);
            }}
          />
        </SheetContent>
      </Sheet>

      <Button variant="secondary" onClick={() => downloadConfig(formData)}>
        Download Config
      </Button>
      <label className="mx-2 flex cursor-pointer flex-row justify-center rounded bg-gray-500 py-2 text-center font-bold text-white shadow-sm hover:bg-gray-600">
        <span className="text-base leading-normal">Upload Config</span>
        <input
          type="file"
          className="hidden"
          accept=".json"
          onChange={e => uploadConfig(e)}
        />
      </label>
      <Button variant="destructive" onClick={() => resetToDefaultConfig()}>
        Reset Config to Default
      </Button>
    </div>
  );
}
