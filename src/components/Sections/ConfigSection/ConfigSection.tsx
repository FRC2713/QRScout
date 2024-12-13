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
import { Cog6ToothIcon } from '@heroicons/react/20/solid';
import { useMemo, useState } from 'react';
import { Section } from '../../core/Section';
import { Settings } from './Settings';
import { ThemeSelector } from './ThemeSelector';

export function ConfigSection() {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery('(min-width: 768px)');

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
            <Settings />
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
          <Settings />
        </DrawerContent>
      </Drawer>
    );
  }, [isDesktop, open]);

  return (
    <Section>
      <div className="flex flex-col justify-center items-center gap-4">
        {dialogOrDrawer}
        <ThemeSelector />
      </div>
    </Section>
  );
}
