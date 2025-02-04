import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'lib/index.esm.js', // output esmodule
      format: 'es',
    },
  ],
  plugins: [
    resolve(),
    commonjs(),
    typescript({
      tsconfig: './tsconfig.json',
    }),
  ],
  external: ['react', 'three-story-controls', 'three', 'lodash', 'gsap', 'draft-js', 'axios', '@gsap/react', 'nanoid'] // 將不需要打包的依賴列在這裡，例如 ['react', 'lodash']
}
