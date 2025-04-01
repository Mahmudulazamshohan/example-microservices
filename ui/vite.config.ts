import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [
      react(),
      federation({
        name: 'ui',
        filename: 'remoteEntry.js',
        remotes: {
          // feed: env.FEED_UI || 'feed@http://localhost:4001/assets/remoteEntry.js',
          authentication: 'http://localhost:4001/remoteEntry.js',
        },
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
      manifest: true,
      modulePreload: false,
      target: 'esnext',
      minify: mode === 'production',
      cssCodeSplit: false,
      outDir: 'dist',
      assetsInlineLimit: 0,
      rollupOptions: {
        output: {
          format: 'esm',
          entryFileNames: 'assets/[name].js',
          chunkFileNames: 'assets/[name].js',
        },
      },
    },
    server: {
      host: '0.0.0.0',
      port: 4003,
      open: true,
      strictPort: true,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'X-Requested-With'
      },
      historyApiFallback: true,
    },
  };
});