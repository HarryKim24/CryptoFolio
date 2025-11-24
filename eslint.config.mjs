import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const filePath = fileURLToPath(import.meta.url);
const baseDir = dirname(filePath);

const compat = new FlatCompat({
  baseDirectory: baseDir,
});

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
];

export default eslintConfig;