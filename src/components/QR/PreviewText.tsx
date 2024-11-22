import { useQRScoutState } from '../../store/store';
import { CopyButton } from './CopyButton';
import { Card, CardContent } from '../ui/card';

export type PreviewTextProps = {
  data: string;
};
export function PreviewText(props: PreviewTextProps) {
  const formData = useQRScoutState(state => state.formData);
  const chunks = props.data.split(formData.delimiter);
  return (
    <Card>
      <CardContent>
        <p className=" font-mono text-wrap break-all text-gray-200 ">
          {chunks.map((c, i) => (
            <>
              <span key={i + c}>{c}</span>

              <span key={i + c + 'tab'} className="text-gray-500">
                {i !== chunks.length - 1 ? '\t' : ' ↵'}
              </span>
            </>
          ))}
        </p>
      </CardContent>
    </Card>
  );
}
