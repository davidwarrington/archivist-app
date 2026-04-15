import type { Config } from '@react-router/dev/config';

export default defineConfig({
  appDirectory: 'src',
  buildDirectory: 'dist',

  future: {
    v8_middleware: true,
  },
});

function defineConfig(config: Config) {
  return config;
}
