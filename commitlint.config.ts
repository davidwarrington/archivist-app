import { type UserConfig } from '@commitlint/types';

export default defineConfig({
  extends: ['@davidwarrington'],
});

function defineConfig(config: UserConfig) {
  return config;
}
