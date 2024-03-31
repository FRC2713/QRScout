import { useTheme } from 'next-themes';

export function ThemeSelector() {
  const { theme, setTheme } = useTheme();
  return (
    <div className="mx-2 flex flex-col justify-start bg-yellow-500 p-2 rounded">
      <div className="rounded-t pb-2 text-left font-bold text-white">Theme</div>
      <select
        className="rounded bg-white px-4 py-2 dark:bg-yellow-700 dark:text-white"
        name="Theme"
        id="theme"
        onInput={v => setTheme(v.currentTarget.value)}
        value={theme}
      >
        <option key={'system'} value={'system'}>
          System
        </option>
        <option key={'dark'} value={'dark'}>
          Dark
        </option>
        <option key={'light'} value={'light'}>
          Light
        </option>
      </select>
    </div>
  );
}
