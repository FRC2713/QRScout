import Editor, { useMonaco } from '@monaco-editor/react';
import { useEffect, useMemo, useState } from 'preact/hooks';
import schema from '../../config/schema.json';
import { getConfig, useQRScoutState } from '../store/store';
import Button, { Variant } from './core/Button';

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

  useEffect(() => {
    monaco?.languages.json.jsonDefaults.setDiagnosticsOptions({
      validate: true,
      schemas: [
        {
          uri: '../../config/schema.json',
          fileMatch: ['*'],
          schema,
        },
      ],
    });
  }, [monaco]);
  console.log("Errors", errorCount);
  return (
    <div className="h-screen w-screen bg-gray-500 bg-opacity-50 dark:bg-opacity-70 backdrop-blur p-4 ">
      <div className="flex flex-col gap-2 h-full shadow-md p-2 rounded-lg bg-gray-50 bg-opacity-20">
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
        <div className="flex flex-grow-0 justify-end gap-2">
          <Button
            variant={Variant.Danger}
            onClick={() => props.onSave && props.onSave(currentConfigText)}
            disabled={currentConfigText.length === 0 || errorCount > 0}
          >
            Save
          </Button>
          <Button variant={Variant.Primary} onClick={props.onCancel}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
