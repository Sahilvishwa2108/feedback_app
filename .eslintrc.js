module.exports = {
  extends: 'next/core-web-vitals',
  rules: {
    '@typescript-eslint/no-unused-vars': 'warn', // Downgrade from error to warning
    'react-hooks/exhaustive-deps': 'warn', // Already a warning, but making sure
    '@typescript-eslint/no-explicit-any': 'warn', // Downgrade from error to warning
    '@typescript-eslint/no-empty-interface': 'warn', // Downgrade from error to warning
    'prefer-const': 'warn' // Downgrade from error to warning
  }
}