import { produce } from 'immer';
import { cloneDeep } from 'lodash';
import configJson from '../../config/2025/config.json';
import {
  Config,
  configSchema,
  InputBase,
} from '../components/inputs/BaseInputProps';
import { MatchData } from '../types/matchData';
import { createStore } from './createStore';

type Result<T> = { success: true; data: T } | { success: false; error: Error };

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

export async function fetchConfigFromURL(url: string): Promise<Result<void>> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch config from URL: ${response.statusText}`);
    }
    const configText = await response.text();
    return setConfig(configText);
  } catch (error) {
    return { success: false, error: error as Error };
  }
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

export function forceResetFields() {
  window.dispatchEvent(new CustomEvent('forceResetFields', { detail: 'forceReset' }));
}

export function setFormData(config: Config) {
  const oldState = useQRScoutState.getState();
  forceResetFields();
  const newFieldValues = config.sections.flatMap(s =>
    s.fields.map(f => ({ code: f.code, value: f.defaultValue })),
  );
  useQRScoutState.setState({ ...oldState, fieldValues: newFieldValues, formData: config });
}

export function setConfig(configText: string): Result<void> {
  let jsonData: any;
  try {
    jsonData = JSON.parse(configText);
  } catch (e: any) {
    return { success: false, error: e.message };
  }
  const c = configSchema.safeParse(jsonData);
  if (!c.success) {
    console.error(c.error);
    return { success: false, error: c.error };
  }
  setFormData(c.data);
  return { success: true, data: undefined };
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

export async function fetchMatchData(teamNumber: number, year: number): Promise<Result<any>> {
  const teamKey = `frc${teamNumber}`;
  const url = `https://www.thebluealliance.com/api/v3/team/${teamKey}/matches/${year}`;
  try {
    const response = await fetch(url, {
      headers: {
        'X-TBA-Auth-Key': 'YOUR_AUTH_KEY_HERE', // Replace with your actual auth key
      },
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch match data: ${response.statusText}`);
    }
    const matchData = await response.json();
    return { success: true, data: matchData };
  } catch (error) {
    return { success: false, error: error as Error };
  }
}

export function setConfigWithMatchData(configText: string, matchData: MatchData): Result<void> {
  let jsonData: any;
  try {
    jsonData = JSON.parse(configText);
  } catch (e: any) {
    return { success: false, error: e.message };
  }
  const c = configSchema.safeParse(jsonData);
  if (!c.success) {
    console.error(c.error);
    return { success: false, error: c.error };
  }

  // TODO: Set the match data in the config
  // Ensure there's no duplicate keys
  console.log(matchData);


  setFormData(c.data);
  return { success: true, data: undefined };
}
