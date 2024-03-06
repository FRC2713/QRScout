import Editor from '@monaco-editor/react';
import configJson from '../../config/2024/config.json';

export function ConfigEditor() {
  return (
    <div className="fixed inset-0 h-full w-full overflow-y-auto bg-gray-500 bg-opacity-50 dark:bg-opacity-70 backdrop-blur ">
      <Editor
        height="90vh"
        defaultLanguage="json"
        defaultValue={JSON.stringify(configJson)}
      />
    </div>
  );
}
