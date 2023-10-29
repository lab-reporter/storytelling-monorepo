const isProduction = process.env.NODE_ENV === 'production'
const buildTarget = process.env.BUILD_TARGET || 'esmodule' // another value could be 'commonjs'

export default {
  presets: [
    [
      '@babel/preset-env',
      {
        modules: buildTarget === 'esmodule' ? false : 'commonjs',
        targets: {
          node: '14',
        },
      },
    ],
  ],
}
