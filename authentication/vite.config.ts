import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';
import * as path from 'path';
import exposes from './ui/exposes';

export default defineConfig(({ mode }) => {
  // const env = loadEnv(mode, process.cwd(), '');
  return {
    root: './ui',
    plugins: [
      react(),
      federation({
        name: 'authentication',
        remotes: {},
        exposes,
        filename: 'remoteEntry.js', // Explicitly set the filename to match what UI is expecting
        shared: [
          'react',
          'react-dom',
          'react-router-dom',
          '@tanstack/react-query',
          'react-redux',
          '@reduxjs/toolkit',
        ],
      }),
    ],
    define: {
      'process.env': {
        BUILD_DATE: JSON.stringify(new Date().toLocaleString()),
      },
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js'],
    },
    build: {
      modulePreload: false,
      target: 'esnext',
      minify: mode === 'production',
      cssCodeSplit: false,
      outDir: 'dist',
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, './ui/index.ts'),
        },
        output: {
          format: 'esm',
          entryFileNames: 'assets/[name].js',
          chunkFileNames: 'assets/[name].js',
        },
      },
    },
    server: {
      port: 4001,
      host: '0.0.0.0',
      // open: true,
      // cors: true,
      // headers: {
      //   'Access-Control-Allow-Origin': '*',
      //   'Access-Control-Allow-Methods':
      //     'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      //   'Access-Control-Allow-Headers':
      //     'X-Requested-With, content-type, Authorization',
      // },
      // historyApiFallback: true,
    },
  };
});
