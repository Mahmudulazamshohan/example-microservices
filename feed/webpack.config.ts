const path = require('path');

export default {
  entry: {
    index: './index.tsx',
  },
  context: path.join(__dirname, './src/components'),
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',

  stats: {
    all: false,
    warnings: true,
    errors: true,
    errorDetails: true,
    colors: true,
    chunks: true,
  },

  devServer: {
    compress: true,
    port: 8082,
    host: '0.0.0.0',
    allowedHosts: 'all',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers':
        'X-Requested-With, content-type, Authorization',
      'X-Webpack-Dev-Server': '1',
    },
    static: {
      directory: path.join(__dirname, 'fontend'),
    },
  },

  output: {
    filename: '[name].fontend.js',
    path: path.join(__dirname, 'fontend'),
  },

  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [],
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
  },
};
