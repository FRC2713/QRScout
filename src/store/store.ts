import { produce } from 'immer';
import { cloneDeep } from 'lodash';
import { ChangeEvent } from 'react';
import configJson from '../../config/2024/config.json';
import {
  Config,
  configSchema,
  InputBase,
} from '../components/inputs/BaseInputProps';
import { createStore } from './createStore';

function getDefaultConfig(): Config {
  const config = configSchema.safeParse(configJson);
  if (!config.success) {
    console.error(config.error);
    throw new Error('Invalid config schema');
  }
  return config.data;
}

export function getConfig() {
  const configData = cloneDeep(useQRScoutState.getState().formData);
  return configData;
}

export interface QRScoutState {
  formData: Config;
  fieldValues: { code: string; value: any }[];
  showQR: boolean;
}

const initialState: QRScoutState = {
  formData: getDefaultConfig(),
  fieldValues: getDefaultConfig().sections.flatMap(s =>
    s.fields.map(f => ({ code: f.code, value: f.defaultValue })),
  ),
  showQR: false,
};

export const useQRScoutState = createStore<QRScoutState>(
  initialState,
  'qrScout',
  {
    version: 2,
  },
);

export function resetToDefaultConfig() {
  useQRScoutState.setState(initialState);
}

export function updateValue(code: string, data: any) {
  useQRScoutState.setState(
    produce((state: QRScoutState) => {
      const field = state.fieldValues.find(f => f.code === code);
      if (field) {
        field.value = data;
      }
    }),
  );
}

export function getFieldValue(code: string) {
  return useQRScoutState.getState().fieldValues.find(f => f.code === code)
    ?.value;
}

export function resetFields() {
  window.dispatchEvent(new CustomEvent('resetFields', { detail: 'reset' }));
}

export function setFormData(config: Config) {
  useQRScoutState.setState({ formData: config });
}

export function setConfig(configText: string) {
  const jsonData = JSON.parse(configText);
  setFormData(jsonData as Config);
}

export function uploadConfig(evt: ChangeEvent<HTMLInputElement>) {
  var reader = new FileReader();
  reader.onload = function (e) {
    const configText = e.target?.result as string;
    setConfig(configText);
  };
  if (evt.currentTarget.files && evt.currentTarget.files.length > 0) {
    reader.readAsText(evt.currentTarget.files[0]);
  }
}

export function inputSelector<T extends InputBase>(
  section: string,
  code: string,
): (state: QRScoutState) => T | undefined {
  return (state: QRScoutState) => {
    const formData = state.formData;
    const field = formData.sections
      .find(s => s.name === section)
      ?.fields.find(f => f.code === code);

    if (!field) {
      return undefined;
    }
    return field as T;
  };
}
