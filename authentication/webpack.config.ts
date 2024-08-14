/* eslint-disable @typescript-eslint/no-var-requires */
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;
const path = require('path');
const deps = require('./package.json').dependencies;

module.exports = {
  entry: path.join(__dirname, './src/components/index.ts'),
  mode: 'development',
  devServer: {
    host: '0.0.0.0',
    allowedHosts: 'all',
    port: 8001,
    open: false,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers':
        'X-Requested-With, content-type, Authorization',
      'X-Webpack-Dev-Server': '1',
    },
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: 'http://localhost:8001/',
    clean: true,
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
      name: 'authentication',
      filename: 'remoteEntry.js',
      exposes: {
        './AuthGuard': './src/components/AuthGuard.tsx',
        './useAuth': './src/components/query/useAuth',
        './LoginPage': './src/components/LoginPage.tsx',
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
        '@tanstack/react-query': {
          singleton: true,
          eager: true,
          requiredVersion: deps['@tanstack/react-query'],
        },
      },
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, './public/index.html'),
    }),
  ],
};
