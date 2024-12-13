import { useEffect, useMemo, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

export function useTheme() {
  const systemTheme: Theme = useMemo(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    }
    return 'light';
  }, []);

  const [theme, setThemeState] = useState<Theme>(systemTheme);

  useEffect(() => {
    const isDark = theme === 'dark';

    document.documentElement.classList.remove(isDark ? 'light' : 'dark');
    document.documentElement.classList.add(theme);

    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (!localStorage.getItem('theme')) {
        setThemeState(systemTheme);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const setTheme = (newTheme: Theme) => {
    if (newTheme === 'light' || newTheme === 'dark') {
      setThemeState(newTheme);
    }
    if (newTheme === 'system') {
      setThemeState(systemTheme);
    }
  };

  return { theme, setTheme };
}
