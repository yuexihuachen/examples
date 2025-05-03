import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
  plugins: [pluginReact()],
  output: {
    sourceMap: {
      js:  'source-map',
      css: true
    },
    manifest: true,
  }
});
