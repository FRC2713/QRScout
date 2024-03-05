import { Cog6ToothIcon } from '@heroicons/react/20/solid';
import { useState } from 'preact/hooks';
import Button, { Variant } from '../../core/Button';
import { Section } from '../../core/Section';
import { SettingsModal } from './SettingsModal';

export function ConfigSection() {
  const [showModal, setShowModal] = useState(false);

  return (
    <Section>
      <div className="flex flex-col items-center justify-center pt-4">
        <SettingsModal show={showModal} onDismiss={() => setShowModal(false)} />
        <Button
          icon={<Cog6ToothIcon className="h-5 w-5" />}
          variant={Variant.Transparent}
          onClick={() => setShowModal(true)}
        >
          Settings
        </Button>
      </div>
    </Section>
  );
}
