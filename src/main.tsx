import { createRoot } from 'react-dom/client';
import { App } from './app.tsx';
import './index.css';

import { ThemeProvider } from 'next-themes';

const root = createRoot(document.getElementById('app')!);

root.render(
  <ThemeProvider attribute="class">
    <App />
  </ThemeProvider>,
);
