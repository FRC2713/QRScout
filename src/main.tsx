import { render } from 'preact';
import ShadcnThemeEditor from 'shadcn-theme-editor';
import { App } from './app.tsx';
import './index.css';

import { ThemeProvider } from 'next-themes';

render(
  <ThemeProvider attribute="class">
    <ShadcnThemeEditor />
    <App />
  </ThemeProvider>,
  document.getElementById('app')!,
);
