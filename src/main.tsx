import { render } from 'preact'
import { App } from './app.tsx'
import './index.css'

import { ThemeProvider } from "next-themes"

render( <ThemeProvider attribute='class'>
<App />
</ThemeProvider>, document.getElementById('app')!)
