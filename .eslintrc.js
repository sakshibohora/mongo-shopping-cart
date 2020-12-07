module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: "airbnb-base",
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module"
  },
  globals: {
      Atomics: 'readonly',
      SharedArrayBuffer: 'readonly',
  },
  rules: {}
};
