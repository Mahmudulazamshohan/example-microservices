/* eslint-disable @typescript-eslint/no-var-requires */
const HtmlWebpackPlugin = require('html-webpack-plugin');
const exposes = require('./src/components/shared');
const webpack = require('webpack');
const { ModuleFederationPlugin } = webpack.container;

const path = require('path');
const deps = require('./package.json').devDependencies;

module.exports = (env: unknown, argv: { [key: string]: string }) => {
  const isProduction = argv.mode === 'production';
  return {
    entry: path.join(__dirname, './src/components/index.ts'),
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
      path: path.resolve(__dirname, 'dist/public'),
      publicPath: isProduction
        ? 'http://localhost/api/authentication/static/'
        : 'http://localhost:8001/',
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
          './useFetch': './src/components/query/useFetch.ts',
          './SwaggerApiClient': './src/components/SwaggerApiClient.ts',
          './AuthGuard': './src/components/AuthGuard.tsx',
          './useAuth': './src/components/query/useAuth',
          './LoginPage': './src/components/LoginPage.tsx',
          './SignupPage': './src/components/SignupPage.tsx',
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
    ],
  };
};
