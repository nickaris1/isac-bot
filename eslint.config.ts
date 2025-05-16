import tseslint from 'typescript-eslint';
import prettier from 'eslint-plugin-prettier';

export default tseslint.config({
  ...tseslint.configs.base,
  files: ['**/*.ts', '**/*.tsx'],
  languageOptions: {
    ...tseslint.configs.base.languageOptions,
    parserOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      project: ['./tsconfig.json'],
      tsconfigRootDir: __dirname,
    },
  },
  rules: {
    'prettier/prettier': 'error',
    'no-multiple-empty-lines': 'off',
    'no-constant-condition': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/ban-types': 'off',
    'prefer-const': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
  },
  plugins: {
    prettier,
  },
});
