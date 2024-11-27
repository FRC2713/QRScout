import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Cog6ToothIcon } from '@heroicons/react/20/solid';
import { Section } from '../../core/Section';
import { ThemeSelector } from './ThemeSelector';
import { useState } from 'preact/hooks';
import { ConfigEditor } from '@/components/ConfigEditor';
import { Button } from '@/components/ui/button';
import {
  uploadConfig,
  resetToDefaultConfig,
  setConfig,
  useQRScoutState,
} from '@/store/store';
import { Transition } from '@headlessui/react';
import { Config } from '../../inputs/BaseInputProps';
import { Cog, Settings } from 'lucide-react';

/**
 * Download a text file
 * @param filename The name of the file
 * @param text The text to put in the file
 */
function download(filename: string, text: string) {
  var element = document.createElement('a');
  element.setAttribute(
    'href',
    'data:text/plain;charset=utf-8,' + encodeURIComponent(text),
  );
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

/**
 * Download the current form data as a json file
 * @param formData The form data to download
 */
function downloadConfig(formData: Config) {
  const configDownload = { ...formData };

  configDownload.sections.forEach(s =>
    s.fields.forEach(f => (f.value = undefined)),
  );
  download('QRScout_config.json', JSON.stringify(configDownload));
}

export function ConfigSection() {
  const formData = useQRScoutState(state => state.formData);
  const [showEditor, setShowEditor] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  return (
    <>
      <Section>
        <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
          <DrawerTrigger onClick={() => setDrawerOpen(!drawerOpen)}>
            <div className="flex items-center justify-center gap-2">
              <Settings className="w-6 h-6" />
              <span>Settings</span>
            </div>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Settings</DrawerTitle>
            </DrawerHeader>

            <div className="flex flex-col gap-4 px-6">
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
                Copy Column Names
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setShowEditor(true);
                  setDrawerOpen(false);
                }}
              >
                Edit Config
              </Button>
              <Button
                variant="secondary"
                onClick={() => downloadConfig(formData)}
              >
                Download Config
              </Button>
              <label className="mx-2 flex cursor-pointer flex-row justify-center rounded bg-gray-500 py-2 text-center font-bold text-white shadow-sm hover:bg-gray-600">
                <span className="text-base leading-normal">Upload Config</span>
                <input
                  type="file"
                  className="hidden"
                  accept=".json"
                  onChange={e => uploadConfig(e)}
                />
              </label>
              <Button
                variant="destructive"
                onClick={() => resetToDefaultConfig()}
              >
                Reset Config to Default
              </Button>
            </div>
            <DrawerFooter>
              <ThemeSelector />
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </Section>

      <Transition
        show={showEditor}
        enter="transition ease-out duration-300 transform"
        enterFrom="translate-y-full"
        enterTo="translate-y-0"
        leave="transition ease-in duration-300 transform"
        leaveFrom="translate-y-0"
        leaveTo="translate-y-full"
        className="z-50 fixed inset-0"
      >
        <ConfigEditor
          onCancel={() => setShowEditor(false)}
          onSave={configString => {
            setConfig(configString);
            setShowEditor(false);
          }}
        />
      </Transition>
    </>
  );
}
