import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Computer, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

export function ThemeSelector() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  return (
    <div className="flex items-center space-x-2">
      <span>Theme:</span>
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
    </div>
  );
}
