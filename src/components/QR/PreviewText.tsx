import { useQRScoutState } from '../../store/store';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion';
import { Badge } from '../ui/badge';

export type PreviewTextProps = {
  data: string;
};
export function PreviewText(props: PreviewTextProps) {
  const formData = useQRScoutState(state => state.formData);
  const chunks = props.data.split(formData.delimiter);
  const fieldValues = useQRScoutState(state => state.fieldValues);

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger>
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
        </AccordionTrigger>
        <AccordionContent>
          <div className="grid grid-cols-2 gap-2">
            {fieldValues.map(fv => (
              <div key={fv.code} className="flex gap-2">
                <span className="text-gray-500">{fv.code}</span>
                <Badge variant="secondary" className="font-mono">
                  {JSON.stringify(fv.value)}
                </Badge>
              </div>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
