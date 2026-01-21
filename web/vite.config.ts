import { defineConfig } from 'vite';
import { resolve } from 'path';

const figs = Array.from({ length: 14 }, (_, i) => `fig_1_${i + 3}.html`);
const input: Record<string, string> = {};
figs.forEach((f) => {
  input[f.replace('.html', '')] = resolve(__dirname, f);
});

export default defineConfig({
  base: '/atomic_orbitals_interactive/',
  build: {
    rollupOptions: {
      input
    },
    outDir: 'dist'
  }
});
