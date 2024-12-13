import { Button } from '@/components/ui/button';
import Editor, { useMonaco } from '@monaco-editor/react';
import { useEffect, useMemo, useState } from 'react';
import schema from '../../public/schema.json';
import { getConfig, useQRScoutState } from '../store/store';

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
          uri: 'https://frc2713.github.io/QRScout/schema.json',
          fileMatch: ['*'],
          schema,
        },
      ],
    });
  }, [monaco]);
  return (
    <div className="flex flex-col gap-2 h-full pb-2 ">
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
      <div className="flex flex-grow-0 justify-center gap-4">
        <Button
          variant="destructive"
          onClick={() => props.onSave && props.onSave(currentConfigText)}
          disabled={currentConfigText.length === 0 || errorCount > 0}
        >
          Save
        </Button>
        <Button onClick={props.onCancel}>Cancel</Button>
      </div>
    </div>
  );
}
