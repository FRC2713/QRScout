import { CopyButton } from './CopyButton';

export type PreviewTextProps = {
  data: string;
};
export function PreviewText(props: PreviewTextProps) {
  const chunks = props.data.split('\t');
  return (
    <div className="flex flex-col items-end gap-2">
      <div className="text-left p-2 bg-gray-100 rounded-md shadow-md dark:bg-gray-600 mt-2">
        <p className=" font-mono text-wrap break-all text-gray-800 dark:text-gray-200">
          {chunks.map((c, i) => (
            <>
              <span key={i + c}>{c}</span>

              <span key={i + c + 'tab'} className="text-gray-500">
                {i !== chunks.length - 1 ? '|' : ' ↵'}
              </span>
            </>
          ))}
        </p>
      </div>

      <CopyButton onCopy={() => navigator.clipboard.writeText(props.data)} />
    </div>
  );
}
