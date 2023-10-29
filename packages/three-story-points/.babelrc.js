const isProduction = process.env.NODE_ENV === 'production'

export default {
  presets: [
    [
      '@babel/preset-env',
      {
        // preserve ES modules
        modules: false,
      },
    ],
  ],
}
