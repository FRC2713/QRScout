import React from 'react';
import { classNames } from '../../util/classNames';

export interface ButtonProps
  extends Omit<React.HTMLAttributes<HTMLButtonElement>, 'icon'> {
  variant: Variant;
  icon?: React.ReactNode;
}

export enum Variant {
  Primary,
  Secondary,
  Danger,
  Transparent,
}

const VARIANT_MAPS: Record<Variant, string> = {
  [Variant.Primary]: 'bg-yellow-700 hover:bg-yellow-800 disabled:bg-yellow-300',
  [Variant.Secondary]: 'bg-yellow-500 hover:bg-yellow-600 disabled:bg-yellow-300',
  [Variant.Danger]: 'bg-red-500 hover:bg-red-700 disabled:bg-red-300',
  [Variant.Transparent]:
    'bg-transparent hover:bg-yellow-200 hover:text-gray-600 disabled:bg-yellow-300',
};

export default function Button(props: ButtonProps) {
  return (
    <button
      type="button"
      onClick={props.onClick}
      className={classNames(
        'focus:shadow-outline mx-2 rounded  py-2 px-4 font-bold text-gray-800 dark:text-white focus:outline-none',
        VARIANT_MAPS[props.variant],
      )}
      disabled={props.disabled}
    >
      <div className="flex flex-row justify-start items-center gap-1">
        {props.icon && props.icon}
        {props.children}
      </div>
    </button>
  );
}
