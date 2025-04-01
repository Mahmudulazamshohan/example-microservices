/* eslint-disable @typescript-eslint/no-var-requires */
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const { ModuleFederationPlugin } = webpack.container;

const path = require('path');
const deps = require('./package.json').devDependencies;

// Configure esbuild to use WASM
process.env.ESBUILD_BINARY_PATH = require.resolve('esbuild-wasm/esbuild.wasm');

module.exports = (_: unknown, argv: { [key: string]: string }) => {
  const isProduction = argv.mode === 'production';

  return {
    entry: path.join(__dirname, './ui/index.ts'),
    mode: argv?.mode || 'development',
    devServer: {
      host: '0.0.0.0',
      allowedHosts: 'all',
      port: 8001,
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
    devtool: isProduction ? false : 'source-map',
    resolve: {
      extensions: ['.ts', '.tsx', '.js'],
    },
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist/ui'),
      publicPath: isProduction
        ? 'http://localhost/api/authentication/static/'
        : 'http://localhost:8001/',
    },
    module: {
      rules: [
        // {
        //   test: /\.(js|jsx|tsx|ts)$/,
        //   loader: 'ts-loader',
        //   exclude: /node_modules/,
        //   options: {
        //     configFile: 'tsconfig.webpack.json',
        //     transpileOnly: true,
        //   },
        // },
        {
          test: /\.(js|jsx|tsx|ts)$/,
          loader: 'esbuild-loader',
          exclude: /node_modules/,
          options: {
            loader: 'tsx',
            target: 'es2015',
            tsconfigRaw: require('./tsconfig.webpack.json'),
            implementation: require('esbuild-wasm'),
          },
        },
      ],
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': JSON.stringify({
          STORAGE_KEY: process?.env?.STORAGE_KEY,
          SWAGGER_URL: process?.env?.SWAGGER_URL,
          AUTHENTICATION_API: process?.env?.AUTHENTICATION_API,
        }),
      }),
      new ModuleFederationPlugin({
        name: 'authentication',
        filename: 'remoteEntry.js',
        exposes: {
          './useFetch': './ui/query/useFetch.ts',
          './SwaggerApiClient': './ui/SwaggerApiClient.ts',
          './AuthGuard': './ui/AuthGuard.tsx',
          './useAuth': './ui/query/useAuth.ts', // Fixed path - was '../ui/query/useAuth'
          './LoginPage': './ui/LoginPage.tsx',
          './SignupPage': './ui/SignupPage.tsx',
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
          '@reduxjs/toolkit': {
            singleton: true,
            eager: true,
            requiredVersion: deps['@reduxjs/toolkit'],
          },
          'react-redux': {
            singleton: true,
            eager: true,
            requiredVersion: deps['react-redux'],
          },
        },
      }),
    ],
  };
};
