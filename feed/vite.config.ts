import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      federation({
        name: 'feed',
        filename: 'remoteEntry.js',
        exposes: {
          './sections/FeedSection': './src/components/sections/FeedSection.tsx',
          './store': './src/store/index.ts',
          './api': './src/store/api/feedApi.ts',
        },
        remotes: {
          authentication:
            env.AUTHENTICATION_UI ||
            'http://localhost:8001/assets/remoteEntry.js',
        },
        shared: [
          'react',
          'react-dom',
          'react-router-dom',
          '@reduxjs/toolkit',
          'react-redux',
        ],
      }),
    ],
    define: {
      'process.env': {
        STORAGE_KEY: JSON.stringify(env.STORAGE_KEY),
        SWAGGER_URL: JSON.stringify(env.SWAGGER_URL),
        AUTHENTICATION_API: JSON.stringify(env.AUTHENTICATION_API),
      },
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js'],
    },
    build: {
      modulePreload: false,
      target: 'esnext',
      minify: false,
      cssCodeSplit: false,
      outDir: 'dist/public',
      rollupOptions: {
        output: {
          format: 'esm',
          entryFileNames: 'assets/[name].js',
          chunkFileNames: 'assets/[name].js',
        },
      },
    },
    server: {
      port: 8002,
      cors: true,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods':
          'GET, POST, PUT, DELETE, PATCH, OPTIONS',
        'Access-Control-Allow-Headers':
          'X-Requested-With, content-type, Authorization',
      },
    },
  };
});
