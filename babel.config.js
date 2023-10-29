const isProduction = process.env.NODE_ENV === 'production'

module.exports = {
  babelrcRoots: [',', 'packages/*'],
  presets: [
    [
      '@babel/env',
      {
        modules: 'auto',
        targets: {
          node: '14',
        },
      },
    ],
    [
      '@babel/preset-react',
      {
        development: !isProduction,
        runtime: 'automatic',
      },
    ],
    '@babel/preset-typescript',
  ],
  plugins: [
    [
      'babel-plugin-styled-components',
      { ssr: true, displayName: true, preprocess: false },
    ],
  ],
}
