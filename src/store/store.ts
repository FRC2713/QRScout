import { produce } from 'immer';
import { cloneDeep } from 'lodash';
import { ChangeEvent } from 'react';
import configJson from '../../config/2024/config_custom.json';
import { Config } from '../components/inputs/BaseInputProps';
import { createStore } from './createStore';

function buildConfig(c: Config) {
  let config: Config = { ...c };
  config.sections
    .map(s => s.fields)
    .flat()
    .forEach(f => (f.value = f.defaultValue));
  return config;
}

function getDefaultConfig(): Config {
  return buildConfig(configJson as Config);
}

export function getConfig() {
  const configData = cloneDeep(useQRScoutState.getState().formData);

  configData.sections
    .map(s => s.fields)
    .flat()
    .forEach(f => delete f.value);

  return configData;
}

export interface QRScoutState {
  formData: Config;
  showQR: boolean;
}

const initialState: QRScoutState = {
  formData: getDefaultConfig(),
  showQR: false,
};

export const useQRScoutState = createStore<QRScoutState>(
  initialState,
  'qrScout',
  {
    version: 1,
  },
);

export function resetToDefaultConfig() {
  useQRScoutState.setState(initialState);
}

export function updateValue(sectionName: string, code: string, data: any) {
  useQRScoutState.setState(
    produce((state: QRScoutState) => {
      let section = state.formData.sections.find(s => s.name === sectionName);
      if (section) {
        let field = section.fields.find(f => f.code === code);
        if (field) {
          field.value = data;
        }
      }
    }),
  );
}

export function resetSections() {
  useQRScoutState.setState(
    produce((state: QRScoutState) =>
      state.formData.sections
        .filter(s => !s.preserveDataOnReset)
        .map(s => s.fields)
        .flat()
        .forEach(f => {
          if (!f.preserveDataOnReset) {
            f.value = f.defaultValue;
          } else if (
            (f.type === 'number' || f.type === 'counter') &&
            f.autoIncrementOnReset
          ) {
            f.value = f.value + 1;
          }
        }),
    ),
  );
}

export function setFormData(config: Config) {
  useQRScoutState.setState({ formData: buildConfig(config) });
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

export const inputSelector =
  (section: string, code: string) => (state: QRScoutState) => {
    const formData = state.formData;
    return formData.sections
      .find(s => s.name === section)
      ?.fields.find(f => f.code === code);
  };

export function getFieldValue(code: string) {
  return useQRScoutState
    .getState()
    .formData.sections.map(s => s.fields)
    .flat()
    .find(f => f.code === code)?.value;
}
