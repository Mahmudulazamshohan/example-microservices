// const path = require('path');
// const HtmlWebPackPlugin = require('html-webpack-plugin');
// const deps = require('./package.json').dependencies;
// const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');

// export default {
//   entry: {
//     index: './index.tsx',
//   },
//   context: path.join(__dirname, './components'),
//   mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',

//   stats: {
//     all: false,
//     warnings: true,
//     errors: true,
//     errorDetails: true,
//     colors: true,
//     chunks: true,
//   },

//   devServer: {
//     compress: true,
//     port: 4002,
//     host: '0.0.0.0',
//     allowedHosts: 'all',
//     headers: {
//       'Access-Control-Allow-Origin': '*',
//       'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
//       'Access-Control-Allow-Headers':
//         'X-Requested-With, content-type, Authorization',
//       'X-Webpack-Dev-Server': '1',
//     },
//     static: {
//       directory: path.join(__dirname, 'dist'),
//     },
//     open: false,
//   },

//   output: {
//     // filename: 'remoteEntry.js',
//     // path: path.join(__dirname, 'dist'),
//     publicPath: 'http://localhost:4002/',
//   },
//   resolve: {
//     extensions: ['.ts', '.tsx', '.js', '.json'],
//     aliasFields: ['module'],
//   },

//   module: {
//     rules: [
//       {
//         test: /\.tsx?$/,
//         use: 'ts-loader',
//         exclude: /node_modules/,
//       },
//       {
//         test: /\.css$/i,
//         use: ['style-loader', 'css-loader'],
//       },
//     ],
//   },
//   plugins: [
//     new ModuleFederationPlugin({
//       name: 'feed',
//       filename: 'remoteEntry.js',
//       remotes: {
//         feed: 'feed@http://localhost:4002/remoteEntry.js',
//         ui: 'ui@http://localhost:4003/remoteEntry.js',
//       },
//       exposes: {
//         './features/Card': './src/components/features/Card.tsx',
//       },
//       shared: {
//         ...deps,
//         react: {
//           singleton: true,
//           requiredVersion: deps.react,
//           eager: true,
//         },
//         'react-dom': {
//           singleton: true,
//           requiredVersion: deps['react-dom'],
//           eager: true,
//         },
//         '@emotion/react': {
//           singleton: true,
//           requiredVersion: deps['@emotion/react'],
//           eager: true,
//         },
//         '@emotion/styled': {
//           singleton: true,
//           requiredVersion: deps['@emotion/styled'],
//           eager: true,
//         },
//         '@mui/material': {
//           singleton: true,
//           requiredVersion: deps['@mui/material'],
//           eager: true,
//         },
//       },
//     }),
//     // new HtmlWebPackPlugin({
//     //   template: path.join(__dirname, './public/index.html'),
//     // }),
//   ],
// };
