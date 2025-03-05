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
          <div className="flex flex-wrap gap-1">
            {chunks.map((c, i) => (
              <Badge key={i + c} className="font-mono">
                {c}
              </Badge>
            ))}
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="grid grid-cols-2 gap-2">
            {fieldValues.map(fv => (
              <div key={fv.code} className="flex gap-2">
                <span className="text-gray-500">{fv.code}</span>
                <Badge
                  variant="secondary"
                  className="font-mono text-wrap break-all"
                >
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
