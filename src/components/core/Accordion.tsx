import { Popover, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { Fragment } from 'react';

type AccordionProps = {
  text: string;
  children?: React.ReactNode;
};

export function Accordion(props: AccordionProps) {
  return (
    <Popover>
      <Popover.Button className="inline-flex items-start gap-x-1 text-lg font-semibold leading-6 dark:text-white">
        <span>{props.text}</span>
        <ChevronDownIcon className="h-5 w-5" aria-hidden="true" />
      </Popover.Button>

      <Transition
        as={Fragment}
        enter="transition ease-in duration-200"
        enterFrom="opacity-0 translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-1"
      >
        <Popover.Panel className="mt-2 ">{props.children}</Popover.Panel>
      </Transition>
    </Popover>
  );
}
