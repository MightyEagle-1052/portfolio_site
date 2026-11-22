import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { fetchLiveContent } from './data/content'
import { applySiteContent } from './data/site'
import { applyProjectContent } from './data/projects'

// Load the latest content from the server (when one is configured) before rendering.
// <html data-content-source="server|bundled"> shows where the displayed content came from.
fetchLiveContent()
  .then((live) => {
    if (live) {
      applySiteContent(live);
      applyProjectContent(live);
    }
    document.documentElement.dataset.contentSource = live ? 'server' : 'bundled';
  })
  .finally(() => {
    createRoot(document.getElementById("root")!).render(<App />);
  });
