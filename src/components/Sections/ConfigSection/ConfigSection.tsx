import { ConfigEditor } from '@/components/ConfigEditor';
import { MatchDataFetcher } from '@/components/QR';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { setConfig, useQRScoutState } from '@/store/store';
import { Copy, Edit2 } from 'lucide-react';
import { useState } from 'react';
import { Section } from '../../core/Section';
import { ThemeSelector } from './ThemeSelector';

export function ConfigSection() {
  const [showEditor, setShowEditor] = useState(false);
  const formData = useQRScoutState(state => state.formData);
  const [error, setError] = useState<string | null>(null);

  return (
    <Section>
      <div className="flex flex-col justify-center items-center gap-4 w-full max-w-full">
        {error && (
          <div className="bg-red-100 text-red-800 p-2 rounded-lg w-full">{error}</div>
        )}
        <Button
          variant="secondary"
          onClick={() =>
            navigator.clipboard.writeText(
              formData.sections
                .map(s => s.fields)
                .flat()
                .map(f => f.title)
                .join('\t'),
            )
          }
          className="text-xs sm:text-sm w-full max-w-[200px]"
        >
          <Copy className="h-5 w-5 flex-shrink-0" />
          <span className="overflow-hidden text-ellipsis">Copy Column Names</span>
        </Button>
        
        {/* Self-contained match data fetcher button */}
        <MatchDataFetcher 
          onError={setError}
          className="text-xs sm:text-sm w-full max-w-[200px]"
        />
        
        <Sheet open={showEditor} onOpenChange={setShowEditor}>
          <SheetTrigger asChild>
            <Button 
              variant="secondary"
              className="text-xs sm:text-sm w-full max-w-[200px]"
            >
              <Edit2 className="h-5 w-5 flex-shrink-0" />
              <span className="overflow-hidden text-ellipsis">Edit Config</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="w-full h-full">
            <SheetHeader>
              <SheetTitle>Edit Config</SheetTitle>
            </SheetHeader>
            <ConfigEditor
              onCancel={() => setShowEditor(false)}
              onSave={(configString, warnCount) => {
                if (warnCount > 0) {
                  let proceed = window.confirm(
                    'Warning: config file has ' +
                      warnCount +
                      ' warnings. Check for invalid fields, which will not save. Save anyways?',
                  );
                  if (proceed) {
                    setConfig(configString);
                    setShowEditor(false);
                  }
                } else {
                  setConfig(configString);
                  setShowEditor(false);
                }
              }}
            />
          </SheetContent>
        </Sheet>
        <ThemeSelector />
      </div>
    </Section>
  );
}
