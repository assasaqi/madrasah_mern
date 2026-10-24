import { defineConfig } from 'vitest/config';

// Konfigurasi Vitest untuk backend testing
export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./test/setup.js'], // Tempat membersihkan mock database
    clearMocks: true,
  },
});
