import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      jsxImportSource: '@emotion/react', // If using emotion, otherwise, you can remove this line
      jsc: {
        transform: {
          react: {
            runtime: 'automatic',
            throwIfNamespace: false, // Disable namespace check
          }
        }
      }
    })
  ],
});