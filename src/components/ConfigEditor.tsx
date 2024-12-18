import { Button } from '@/components/ui/button';
import Editor, { useMonaco } from '@monaco-editor/react';
import { Upload } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import schema from '../assets/schema.json';
import {
  getConfig,
  resetToDefaultConfig,
  uploadConfig,
  useQRScoutState,
} from '../store/store';
import { Config } from './inputs/BaseInputProps';
import { Input } from './ui/input';

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

  download('QRScout_config.json', JSON.stringify(configDownload));
}

type ConfigEditorProps = {
  onCancel?: () => void;
  onSave?: (config: string) => void;
};

export function ConfigEditor(props: ConfigEditorProps) {
  const monaco = useMonaco();
  const formData = useQRScoutState(state => state.formData);
  const config = useMemo(() => getConfig(), [formData]);
  const [currentConfigText, setCurrentConfigText] = useState<string>('');
  const [errorCount, setErrorCount] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  useEffect(() => {
    monaco?.languages.json.jsonDefaults.setDiagnosticsOptions({
      validate: true,
      schemas: [
        {
          uri: 'https://frc2713.github.io/QRScout/schema.json',
          fileMatch: ['*'],
          schema,
        },
      ],
    });
  }, [monaco]);
  return (
    <div className="flex flex-col gap-2 h-full pb-2">
      <div className="flex-grow rounded-lg overflow-clip ">
        <Editor
          defaultLanguage="json"
          defaultValue={JSON.stringify(config, null, 2)}
          theme="vs-dark"
          onValidate={markers => {
            const severeErrors = markers.filter(m => m.severity > 4);
            setErrorCount(severeErrors.length);
          }}
          onChange={value => value && setCurrentConfigText(value)}
        />
      </div>
      <div className="flex flex-grow-0 justify-between">
        <div className="flex gap-4 justify-start">
          <Button variant="destructive" onClick={() => resetToDefaultConfig()}>
            Reset Config to Default
          </Button>
          <Button variant="secondary" onClick={() => downloadConfig(config)}>
            Download Config
          </Button>
        </div>
        <div className="flex justify-center items-center">
          <Button onClick={handleButtonClick} className="w-full max-w-xs">
            <Upload className="mr-2 h-4 w-4" /> Upload Config
          </Button>
          <Input
            type="file"
            ref={fileInputRef}
            onChange={e => uploadConfig(e)}
            className="hidden"
            aria-hidden="true"
          />
        </div>

        <div className="flex gap-4 justify-end">
          <Button onClick={props.onCancel}>Cancel</Button>
          <Button
            variant="destructive"
            onClick={() => props.onSave && props.onSave(currentConfigText)}
            disabled={currentConfigText.length === 0 || errorCount > 0}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}
