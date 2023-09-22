module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  settings: {
    'import/resolver': {
      node: {
        extensions: [ '.js', '.ts' ],
        paths: [ 'src' ],
      },
    },
  },
  extends: [
    'airbnb-base',
    'plugin:@typescript-eslint/recommended',
  ],
  plugins: [
    '@typescript-eslint',
    'only-warn',
  ],
  rules: {
    'import/extensions': [ 'error', 'never' ],
    'array-bracket-spacing': [ 'error', 'always', { objectsInArrays: false, arraysInArrays: false }],
    '@typescript-eslint/consistent-type-imports': 1,
  },
  ignorePatterns: [ 'dist' ],
};
