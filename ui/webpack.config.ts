// @ts-nocheck
/* eslint-disable */
const HtmlWebpackPlugin = require("html-webpack-plugin"); /* eslint-disable */
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const webpack = require("webpack");
const path = require('path');
const Dotenv = require('dotenv-webpack');
const { ModuleFederationPlugin } = webpack.container;
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const deps = require("./package.json").dependencies;
const esbuild = require('esbuild-wasm');

const buildDate = new Date().toLocaleString();

require('dotenv').config({ silent: true });
const enviroments = process?.env ?? {};
process.env.ESBUILD_BINARY_PATH = require.resolve('esbuild-wasm/esbuild.wasm');
const webpackConfig = (env: any, argv: { [key: string]: string }) => {
  const isProduction: boolean = argv.mode === "production";
  
  return {
    entry: path.join(__dirname, "src/index.ts"), // Fixed entry path
    mode: argv?.mode || "development",
    devServer: {
      port: 4003,
      open: true,
      headers: {
        "Access-Control-Allow-Origin": "*",
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
        'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
      },
      client: {
        overlay: true,
      },
      historyApiFallback: true,
    },
    resolve: {
      extensions: [".ts", ".tsx", ".js"],
      modules: ['./node_modules', 'node_modules'],
    },
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist'),
      clean: true,
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx|tsx|ts)$/,
          loader: 'swc-loader',
          exclude: /node_modules/,
          options: {
            jsc: {
              parser: {
                syntax: 'typescript',
                tsx: true,
              },
              transform: {
                react: {
                  runtime: 'automatic',
                  refresh: !isProduction,
                },
              },
              target: 'es2015',
            },
          },
        }
      ],
    },
    plugins: [
      new ReactRefreshWebpackPlugin({ overlay: false }),
      new webpack.EnvironmentPlugin({ BUILD_DATE: buildDate }),
      new ModuleFederationPlugin({
        name: "container",
        remotes: {
          feed: enviroments?.FEED_UI || 'feed@http://localhost:8001/remoteEntry.js',
          authentication: enviroments?.AUTHENTICATION_UI || 'authentication@http://localhost:8002/remoteEntry.js',
        },
        shared: {
          ...deps,
          react: { singleton: true, eager: true, requiredVersion: deps.react },
          "react-dom": {
            singleton: true,
            eager: true,
            requiredVersion: deps["react-dom"],
          },
          "react-router-dom": {
            singleton: true,
            eager: true,
            requiredVersion: deps["react-router-dom"],
          },
          '@tanstack/react-query': {
            singleton: true,
            eager: true,
            requiredVersion: deps["@tanstack/react-query"],
          }
        },
      }),
      new HtmlWebpackPlugin({
        template: path.join(__dirname, "./public/index.html"),
      }),
      // new ForkTsCheckerWebpackPlugin(),
    ]
  };
};

module.exports = webpackConfig;
