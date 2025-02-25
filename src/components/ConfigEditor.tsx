import { Button } from '@/components/ui/button';
import Editor, { useMonaco } from '@monaco-editor/react';
import { Menu, Save } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import schema from '../assets/schema.json';
import {
  fetchConfigFromURL,
  getConfig,
  resetToDefaultConfig,
  setConfig,
  useQRScoutState,
} from '../store/store';
import { Config } from './inputs/BaseInputProps';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
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
  const [currentConfigText, setCurrentConfigText] = useState<string>(
    JSON.stringify(config, null, 2),
  );
  const [errorCount, setErrorCount] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [url, setUrl] = useState<string>('');

  useEffect(() => {
    setCurrentConfigText(JSON.stringify(config, null, 2));
  }, [config]);

  useEffect(() => {
    monaco?.languages.json.jsonDefaults.setDiagnosticsOptions({
      validate: true,
      schemas: [
        {
          uri: 'https://scout.lynkrobotics.org/schema.json',
          fileMatch: ['*'],
          schema,
        },
      ],
    });
  }, [monaco]);

  const handleUploadClick = useCallback(() => {
    fileInputRef.current?.click();
  }, [fileInputRef]);

  const handleUploadChange = useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) => {
      var reader = new FileReader();
      reader.onload = function (e) {
        const configText = e.target?.result as string;
        const result = setConfig(configText);
        if (!result.success) {
          setError(result.error.message);
        } else {
          setError(null);
        }
      };
      if (evt.currentTarget.files && evt.currentTarget.files.length > 0) {
        reader.readAsText(evt.currentTarget.files[0]);
      }
    },
    [],
  );

  const handleLoadFromURL = useCallback(async () => {
    const result = await fetchConfigFromURL(url);
    if (!result.success) {
      setError(result.error.message);
    } else {
      setError(null);
    }
  }, [url]);

  return (
    <div className="flex flex-col gap-2 h-full pb-2">
      <div className="flex-grow rounded-lg overflow-clip ">
        {error && (
          <div className="bg-red-100 text-red-800 p-2 rounded-lg">{error}</div>
        )}
        <Editor
          defaultLanguage="json"
          value={currentConfigText}
          theme="vs-dark"
          onValidate={markers => {
            const severeErrors = markers.filter(m => m.severity > 4);
            setErrorCount(severeErrors.length);
          }}
          onChange={value => value && setCurrentConfigText(value)}
        />
      </div>
      <div className="flex flex-col gap-4">
        {/* Mobile view (<640px): URL input and button appear in a full-width row above other controls */}
        <div className="flex flex-col sm:hidden gap-2 w-full">
          <Input
            type="url"
            placeholder="Enter config URL"
            value={url}
            onChange={e => setUrl(e.target.value)}
            className="w-full"
          />
          <Button onClick={handleLoadFromURL} className="w-full">Load from URL</Button>
        </div>

        {/* Desktop view (≥640px): URL input and button appear inline with other controls */}
        <div className="flex flex-row items-center gap-4 flex-wrap">
          <div className="hidden sm:flex flex-row items-center gap-2 flex-1">
            <Input
              type="url"
              placeholder="Enter config URL"
              value={url}
              onChange={e => setUrl(e.target.value)}
              className="flex-1 min-w-0"
            />
            <Button onClick={handleLoadFromURL}>Load from URL</Button>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary">
                <Menu className="h-5 w-5" />
                Options
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => resetToDefaultConfig()}>
                Reset To Default Config
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => downloadConfig(config)}>
                Download Config
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleUploadClick}>
                Upload Config
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button
            variant="destructive"
            onClick={() => props.onSave && props.onSave(currentConfigText)}
            disabled={currentConfigText.length === 0 || errorCount > 0}
          >
            <Save className="h-5 w-5" />
            Save
          </Button>

          <Input
            type="file"
            ref={fileInputRef}
            onChange={handleUploadChange}
            className="hidden"
            aria-hidden="true"
            accept=".json,application/json"
          />
        </div>
      </div>
    </div>
  );
}
