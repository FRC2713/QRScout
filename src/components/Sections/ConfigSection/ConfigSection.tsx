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
import { Settings } from './SettingsModal';
import { ThemeSelector } from './ThemeSelector';

export function ConfigSection() {
  return (
    <Section>
      <div className="flex flex-col items-center justify-center pt-4">
        <Drawer>
          <DrawerTrigger>
            <div className="flex gap-2">
              <Cog6ToothIcon className="h-5 w-5" />
              Settings
            </div>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Settings</DrawerTitle>
            </DrawerHeader>
            <Settings />
            <DrawerFooter>
              <ThemeSelector />
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
    </Section>
  );
}
