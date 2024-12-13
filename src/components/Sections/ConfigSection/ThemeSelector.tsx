import { useTheme } from '@/components/ThemeProvider';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Computer, Moon, Sun } from 'lucide-react';

export function ThemeSelector() {
  const { theme, setTheme } = useTheme();

  return (
    <ToggleGroup type="single" value={theme} onValueChange={setTheme}>
      <ToggleGroupItem value="light" aria-label="light theme">
        <Sun className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="dark" aria-label="dark theme">
        <Moon className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="system" aria-label="system theme">
        <Computer className="h-4 w-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
