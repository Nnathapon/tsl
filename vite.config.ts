import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';
  
  if (isProduction) {
    return {
      plugins: [react(), tailwindcss()],
      base: '/tsl/', 
    };
  } else {
    return {
      plugins: [react(), tailwindcss()],
      base: '/', 
    };
  }
});
