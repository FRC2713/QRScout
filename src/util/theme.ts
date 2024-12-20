import { ColorScheme } from '@/components/inputs/BaseInputProps';

export function setCSSVariable(variable: string, value: string) {
  document.documentElement.style.setProperty(variable, value);
}

export function setColorScheme(colorScheme: ColorScheme) {
  Object.entries(colorScheme).forEach(([key, value]) => {
    const cssVariable = `--${key.replace('_', '-')}`;
    setCSSVariable(cssVariable, value);
  });
}
