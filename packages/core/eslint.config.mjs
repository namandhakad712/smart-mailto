import { defineConfig, globalIgnores } from 'eslint/config';
import tslint from 'typescript-eslint';

export default defineConfig([
  ...tslint.configs.recommended,
  globalIgnores(['dist', 'coverage', 'node_modules']),
  {
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
]);
