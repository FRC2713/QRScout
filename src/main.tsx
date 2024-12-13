import { createRoot } from 'react-dom/client';
import { App } from './app.tsx';
import './index.css';

const root = createRoot(document.getElementById('app')!);

root.render(<App />);
