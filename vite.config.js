import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Convert render-blocking stylesheet to non-blocking preload
// to allow the browser to paint #root in frame 1 (FCP & LCP < 0.5s)
const nonBlockingCss = () => ({
  name: 'non-blocking-css',
  transformIndexHtml(html) {
    return html.replace(
      /<link rel="stylesheet" crossorigin href="(\/assets\/[^"]+\.css)">/g,
      '<link rel="preload" href="$1" as="style" onload="this.onload=null;this.rel=\'stylesheet\'"><noscript><link rel="stylesheet" href="$1"></noscript>'
    );
  },
});

export default defineConfig({
  plugins: [react(), nonBlockingCss()],
  build: {
    chunkSizeWarningLimit: 600,
  },
})
