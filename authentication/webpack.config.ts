/* eslint-disable @typescript-eslint/no-var-requires */
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;
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
        ? 'http://localhost/api/authentication/static/bundle.js'
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
      // new HtmlWebpackPlugin({
      //   template: path.join(__dirname, './public/index.html'),
      // }),
    ],
  };
};
