// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Use this structure to set the base path ONLY for the production build
export default defineConfig(({ mode }) => {
  const config = {
    plugins: [react()],
    // Default base is '/', so only change it for production
    base: '/',
  };

  if (mode === 'production') {
    // Set to your repository name, including the surrounding slashes
    config.base = '/tsl/'; 
  }

  return config;
});