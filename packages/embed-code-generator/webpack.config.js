/* eslint-disable */
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const fs = require('fs')
const path = require('path')
const pkg = require('./package.json')
const webpack = require('webpack')
const port = process.env.PORT || 8080
const { WebpackManifestPlugin } = require('webpack-manifest-plugin')

const webpackAssets = {
  chunks: [],
  entrypoints: [],
}

const isProduction = process.env.NODE_ENV === 'production'
const publicPath = isProduction
  ? `https://unpkg.com/${pkg.name}@${pkg.version}/dist/`
  : `http://localhost:${port}/dist/`

const distDir = './dist'
const manifestFileName = 'manifest.json'

function AfterManifestPlugin() {}

AfterManifestPlugin.prototype.apply = function(compiler) {

  compiler.hooks.afterEmit.tap('AfterManifestPlugin', function(compilation) {
    const manifestFilePath = path.resolve(distDir, manifestFileName)
    const manifest = require(path.resolve(distDir, manifestFileName))
    manifest.version = pkg.version

    fs.writeFileSync(
      manifestFilePath,
      JSON.stringify(manifest)
    )
  })
}

const webpackConfig = {
  mode: isProduction ? 'production' : 'development',
  entry: {
    // @TODO import `pkgNames` from './src/build-codes/constants.js'
    karaoke: {import: './src/build-code/karaoke.js'},
    'scrollable-video': { import: './src/build-code/scrollable-video.js' },
    'scroll-to-audio': { import: './src/build-code/scroll-to-audio.js' },
    'subtitled-audio': { import: './src/build-code/subtitled-audio.js' },
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, distDir),
    library: '@story-telling-reporter/react-embed-code-generator',
    libraryTarget: 'umd',
    publicPath,
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        resolve: {
          fullySpecified: false,
        },
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          presets: [
            '@babel/preset-env',
            [
              '@babel/preset-react',
              { development: !isProduction, runtime: 'automatic' },
            ],
          ],
          plugins: [
            [
              'styled-components',
              { ssr: true, displayName: true, preprocess: false },
            ],
          ],
        },
      },
      {
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      },
    ],
  },
  optimization: {
    usedExports: true,
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: Infinity,
      minSize: 0,
      minChunks: 1,
      cacheGroups: {
        'threejs-vendor': {
          test: /[\\/]node_modules[\\/](three|three-story-controls)[\\/]/,
          name: 'threejs-vendor',
          filename: '[name].js',
        },
        'react-vendor': {
          test: /[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/,
          name: 'react-vendor',
          filename: '[name].js',
        },
        'regenerator-runtime': {
          test: /[\\/]node_modules[\\/](regenerator-runtime)[\\/]/,
          name: 'regenerator-runtime',
          filename: '[name].js',
        },
        'styled-components': {
          test: /[\\/]node_modules[\\/](styled-components)[\\/]/,
          name: 'styled-components',
          filename: '[name].js',
        },
        'draft-js': {
          test: /[\\/]node_modules[\\/](draft-js)[\\/]/,
          name: 'draftjs',
          filename: '[name].js',
        },
        immutable: {
          test: /[\\/]node_modules[\\/](immutable)[\\/]/,
          name: 'immutable',
          filename: '[name].js',
        },
        lodash: {
          test: /[\\/]node_modules[\\/](lodash)[\\/]/,
          name: 'lodash',
          filename: '[name].js',
        },
        gsap: {
          test: /[\\/]node_modules[\\/](gsap)[\\/]/,
          name: 'gsap',
          filename: '[name].js',
        },
        staticFile: {
          test: /.svg$/,
          name: 'static-file',
          filename: '[name].js',
        },
        //vendor: {
        //  test: /[\\/]node_modules[\\/]/,
        //  name: 'vendor',
        //  filename: '[name].js',
        //  priority: -10,
        //},
      },
    },
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: process.env.NODE_ENV,
      EMBED_CODE_GENERATOR_VERSION: pkg.version,
    }),
    new WebpackManifestPlugin({
      useEntryKeys: true,
      fileName: manifestFileName,
    }),
    new AfterManifestPlugin(),
    // new BundleAnalyzerPlugin(),
  ],
}

module.exports = webpackConfig
