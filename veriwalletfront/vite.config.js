import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
  build: {
    rollupOptions: {
      input: {
        main: 'app.html' // تغییر entry point به app.html
      }
    }
  },
  server: {
    allowedHosts: ["veriwallet.com"]
  }
})
