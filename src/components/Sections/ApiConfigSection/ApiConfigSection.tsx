import { ApiTextInput } from './ApiTextInput';

export function ApiConfigSection() {
  return <div className="mb-4 flex flex-col justify-center rounded bg-white shadow-md dark:bg-gray-600 gap-2 p-2">
    <ApiTextInput propName="url" dispName="API URL"/>
    <ApiTextInput propName="auth" dispName="API Token"/>
  </div>;
}
