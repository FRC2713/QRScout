import {
  resetToDefaultConfig,
  uploadConfig,
  useQRScoutState,
} from '../../../store/store';
import Button, { Variant } from '../../core/Button';
import { Modal } from '../../core/Modal';
import { Config } from '../../inputs/BaseInputProps';
import { ThemeSelector } from './ThemeSelector';

export interface ModalProps {
  show: boolean;
  onDismiss?: () => void;
}

/**
 * Download a text file
 * @param filename The name of the file
 * @param text The text to put in the file
 */
function download(filename: string, text: string) {
  var element = document.createElement('a');
  element.setAttribute(
    'href',
    'data:text/plain;charset=utf-8,' + encodeURIComponent(text),
  );
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

/**
 * Download the current form data as a json file
 * @param formData The form data to download
 */
function downloadConfig(formData: Config) {
  const configDownload = { ...formData };

  configDownload.sections.forEach(s =>
    s.fields.forEach(f => (f.value = undefined)),
  );
  download('QRScout_config.json', JSON.stringify(configDownload));
}

export function SettingsModal(props: ModalProps) {
  const formData = useQRScoutState(state => state.formData);
  return (
    <Modal show={props.show} onDismiss={props.onDismiss}>
      <div className="flex flex-col justify-start rounded bg-white dark:bg-gray-600 gap-2 p-2">
        <Button
          variant={Variant.Secondary}
          onClick={() =>
            navigator.clipboard.writeText(
              formData.sections
                .map(s => s.fields)
                .flat()
                .map(f => f.title)
                .join('\t'),
            )
          }
        >
          Copy Column Names
        </Button>
        <Button
          variant={Variant.Secondary}
          onClick={() => downloadConfig(formData)}
        >
          Download Config
        </Button>
        <label className="mx-2 flex cursor-pointer flex-row justify-center rounded bg-gray-500 py-2 text-center font-bold text-white shadow-sm hover:bg-gray-600">
          <span className="text-base leading-normal">Upload Config</span>
          <input
            type="file"
            className="hidden"
            accept=".json"
            onChange={e => uploadConfig(e)}
          />
        </label>

        <ThemeSelector />
        <Button variant={Variant.Danger} onClick={() => resetToDefaultConfig()}>
          Reset Config to Default
        </Button>
      </div>
    </Modal>
  );
}
