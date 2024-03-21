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

function WebpackAssetPlugin() {}

WebpackAssetPlugin.prototype.apply = function(compiler) {
  const distDir = './dist'

  compiler.hooks.emit.tap('WebpackAssetPlugin', function(compilation) {
    const chunks = compilation.chunks.forEach((chunk) => {
      return `${publicPath}${chunk.name}.js`
    })
    const entryChunks = compilation.entrypoints
      .get('main')
      .chunks.map((chunk) => {
        return `${publicPath}${chunk.name}.js`
      })

    webpackAssets.chunks = chunks
    webpackAssets.entrypoints = entryChunks
    webpackAssets.version = pkg.version

    if (!fs.existsSync(distDir)) {
      fs.mkdirSync(distDir)
    }

    fs.writeFileSync(
      path.resolve(__dirname, `${distDir}/webpack-assets.json`),
      JSON.stringify(webpackAssets)
    )
  })
}

const webpackConfig = {
  mode: isProduction ? 'production' : 'development',
  entry: {
    main: path.resolve(__dirname, './src/build-code/client.js'),
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, './dist/'),
    library: '@story-telling-reporter/react-embed-code',
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
    }),
    new WebpackAssetPlugin(),
    // new BundleAnalyzerPlugin(),
  ],
}

module.exports = webpackConfig
