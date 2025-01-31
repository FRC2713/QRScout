import { ConfigEditor } from '@/components/ConfigEditor';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { fetchMatchData, setConfig, setConfigWithMatchData, useQRScoutState } from '@/store/store';
import { MatchData } from '@/types/matchData';
import { Copy, Edit2 } from 'lucide-react';
import { useState } from 'react';
import { Section } from '../../core/Section';
import { ThemeSelector } from './ThemeSelector';

export function ConfigSection() {
  const [showEditor, setShowEditor] = useState(false);
  const formData = useQRScoutState(state => state.formData);

  return (
    <Section>
      <div className="flex flex-col justify-center items-center gap-4">
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
        >
          <Copy className="h-5 w-5" />
          Copy Column Names
        </Button>
        <Sheet open={showEditor} onOpenChange={setShowEditor}>
          <SheetTrigger asChild>
            <Button variant="secondary">
              <Edit2 className="h-5 w-5" />
              Edit Config
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="w-full h-full">
            <SheetHeader>
              <SheetTitle>Edit Config</SheetTitle>
            </SheetHeader>
            <ConfigEditor
              onCancel={() => setShowEditor(false)}
              onSave={(configString, warnCount) => {
                if(warnCount > 0) {
                  let proceed = window.confirm("Warning: config file has " + warnCount + " warnings. Check for invalid fields, which will not save. Save anyways?");
                  if(proceed) {
                    setConfig(configString);
                    setShowEditor(false);
                  }
                } else {
                  setConfig(configString);
                  setShowEditor(false);
                };
              }}
            />
          </SheetContent>
        </Sheet>
        <Button
          variant="secondary"
          onClick={() => {
            const teamNumber = formData.teamNumber;
            const year = new Date().getFullYear();
            fetchMatchData(teamNumber, year).then(result => {
              if (result.success) {
                const matchData = result.data as MatchData;
                const configResult = setConfigWithMatchData(
                  JSON.stringify(formData),
                  matchData,
                );
                if (!configResult.success) {
                  console.error(configResult.error.message);
                }
              } else {
                console.error(result.error.message);
              }
            });
          }}
        >
          Fetch Match Data
        </Button>
        <ThemeSelector />
      </div>
    </Section>
  );
}
