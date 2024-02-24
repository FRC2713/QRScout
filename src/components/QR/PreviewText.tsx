import { CopyButton } from './CopyButton';
import { UploadButton } from './UploadButton';

export type PreviewTextProps = {
  data: string;
  url?: string;
  token?: string;
};

function uploadToUrl(props: PreviewTextProps) {
  if (props.url !== undefined) {
    let opts = {
      method: 'POST',
      body: props.data,
      token: props.token,
    };
    fetch(props.url, opts);
  }
}

export function PreviewText(props: PreviewTextProps) {
  const chunks = props.data.split('\t');
  return (
    <div className="flex flex-col items-center gap-2 shadow-md bg-gray-600 m-2 p-2 rounded-md">
      <div className="text-justify p-2 rounded bg-gray-600 ">
        <p className=" font-mono text-wrap break-all text-gray-200 ">
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
      {props.url !== undefined && <UploadButton onUpload={() => uploadToUrl(props)} />}
    </div>
  );
}
