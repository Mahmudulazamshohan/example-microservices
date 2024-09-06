/* eslint-disable @typescript-eslint/no-var-requires */
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;
const path = require('path');
const deps = require('./package.json').dependencies;
const exposes = require('./src/components/exposes');

module.exports = (env: unknown, argv: { [key: string]: string }) => {
  const isProduction = argv.mode === 'production';

  return {
    entry: path.join(__dirname, './src/components/index.ts'),
    mode: argv.mode || 'development',
    devServer: {
      host: '0.0.0.0',
      allowedHosts: 'all',
      port: 8002,
      open: false,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods':
          'GET, POST, PUT, DELETE, PATCH, OPTIONS',
        'Access-Control-Allow-Headers':
          'X-Requested-With, content-type, Authorization',
        'X-Webpack-Dev-Server': '1',
      },
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js'],
    },
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist/public'),
      publicPath: isProduction  ? 'http://localhost/api/feed/static/bundle.js' : 'http://localhost:8002/',
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx|tsx|ts)$/,
          loader: 'ts-loader',
          exclude: /node_modules/,
          options: {
            configFile: 'tsconfig.webpack.json',
            transpileOnly: true,
          },
        },
      ],
    },
    plugins: [
      new ModuleFederationPlugin({
        name: 'feed',
        filename: 'remoteEntry.js',
        exposes: {
          './CounterAppOne': './src/components/CounterAppOne.tsx',
          './sections/FeedSection': './src/components/sections/FeedSection.tsx',
        },
        shared: {
          ...deps,
          react: { singleton: true, eager: true, requiredVersion: deps.react },
          'react-dom': {
            singleton: true,
            eager: true,
            requiredVersion: deps['react-dom'],
          },
          'react-router-dom': {
            singleton: true,
            eager: true,
            requiredVersion: deps['react-router-dom'],
          },
        },
      }),
    ],
  };
};
