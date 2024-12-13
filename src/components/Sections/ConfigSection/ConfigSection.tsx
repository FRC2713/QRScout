import { ConfigEditor } from '@/components/ConfigEditor';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { useMediaQuery } from '@/hooks';
import { setConfig } from '@/store/store';
import { Transition } from '@headlessui/react';
import { Cog6ToothIcon } from '@heroicons/react/20/solid';
import { useMemo, useState } from 'react';
import { Section } from '../../core/Section';
import { Settings } from './Settings';
import { ThemeSelector } from './ThemeSelector';

export function ConfigSection() {
  const [open, setOpen] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const isDesktop = useMediaQuery('(min-width: 768px)');

  const handleShowEditor = (show: boolean) => {
    if (show) {
      setOpen(false);
    }
    setShowEditor(show);
  };

  const dialogOrDrawer = useMemo(() => {
    if (isDesktop) {
      return (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Cog6ToothIcon className="h-5 w-5" />
              Settings
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Settings</DialogTitle>
            </DialogHeader>
            <Settings setShowEditor={handleShowEditor} />
          </DialogContent>
        </Dialog>
      );
    }
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button variant="outline">
            <Cog6ToothIcon className="h-5 w-5" />
            Settings
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Settings</DrawerTitle>
          </DrawerHeader>
          <Settings setShowEditor={handleShowEditor} />
        </DrawerContent>
      </Drawer>
    );
  }, [isDesktop, open, setShowEditor]);

  return (
    <Section>
      <div className="flex flex-col justify-center items-center gap-4">
        {dialogOrDrawer}

        <ThemeSelector />
      </div>

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
    </Section>
  );
}
