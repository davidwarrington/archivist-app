import { typescript } from '@davidwarrington/eslint-config';
import react from '@eslint-react/eslint-plugin';
import { defineConfig } from 'eslint/config';
import gitignore from 'eslint-config-flat-gitignore';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';

export default defineConfig([
  typescript,
  jsxA11y.flatConfigs.recommended,
  react.configs['recommended-type-checked'],
  reactHooks.configs.flat.recommended,

  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    settings: {
      'react-x': {
        version: 'detect',
      },
    },
  },

  gitignore({ strict: true }),
]);
