import config from '@davidwarrington/prettier-config';
import { defineConfig } from '@davidwarrington/prettier-config/utils';
import * as tailwindcss from 'prettier-plugin-tailwindcss';

export default defineConfig({
  ...config,

  plugins: [tailwindcss],
});
