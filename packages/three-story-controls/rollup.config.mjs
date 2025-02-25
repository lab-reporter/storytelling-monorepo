import commonjs from '@rollup/plugin-commonjs'
import glob from 'glob'
import path from 'node:path'
import resolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import { fileURLToPath } from 'node:url'

export default {
  input: Object.fromEntries(
    glob.sync('src/**/*.{ts,tsx}').map(file => [
      // This removes `src/` as well as the file extension from each
      // file, so e.g. src/nested/foo.js becomes nested/foo
      path.relative(
        'src',
        file.slice(0, file.length - path.extname(file).length)
      ),
      // This expands the relative paths to absolute paths, so e.g.
      // src/nested/foo becomes /project/src/nested/foo.js
      fileURLToPath(new URL(file, import.meta.url))
    ])
  ),
  output: {
    format: 'es',
    dir: 'lib/esm'
  },
  plugins: [
    resolve(),
    commonjs(),
    typescript({
      tsconfig: './tsconfig.json',
    }),
  ],
  external: ['react', 'three-story-controls', 'three', /^three\//, 'lodash', /^lodash\//, 'gsap', /^gsap\//, 'draft-js', 'axios', '@gsap/react', 'nanoid', 'styled-components', '@story-telling-reporter/draft-editor', '@keystone-ui/fields', '@keystone-ui/modals', 'immutable']
}
