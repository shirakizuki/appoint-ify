import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  define: {
    __BASE_URL__: JSON.stringify(process.env.VITE_SERVER_API),
    __APP_VERSION__: JSON.stringify('v1.0.0'),
  },
  plugins: [react()],
})
