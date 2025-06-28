
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// Conditionally import componentTagger only in development
let componentTagger;
try {
  if (process.env.NODE_ENV === 'development') {
    componentTagger = require("lovable-tagger")?.componentTagger;
  }
} catch (error) {
  console.log('lovable-tagger not available, skipping...');
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      '/functions/v1': {
        target: 'http://127.0.0.1:54321',
        changeOrigin: true,
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            console.log('Proxy error - Supabase functions may not be running locally');
          });
        }
      },
    }
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger ? componentTagger() : null,
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
