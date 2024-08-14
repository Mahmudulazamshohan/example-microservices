const HtmlWebpackPlugin = require("html-webpack-plugin");
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const webpack = require("webpack");
const path = require('path');
const { ModuleFederationPlugin } = webpack.container;
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const deps = require("./package.json").dependencies;
require("dotenv").config({ path: path.join(__dirname, "./.env") });

const buildDate = new Date().toLocaleString();
const enviroments = process?.env ?? {};


module.exports = (env: any, argv: { [key: string]: string }) => {
  const isProduction = argv.mode === "production";
  console.log('Mode', argv.mode);
  let plugins: any[] = [];

  if (!isProduction) {
    plugins.push(new ReactRefreshWebpackPlugin({
      overlay: false,
    }))
  }

  plugins = [
    ...plugins,
    new webpack.EnvironmentPlugin({ BUILD_DATE: buildDate }),
    new webpack.DefinePlugin({
      "process.env": JSON.stringify(enviroments),
    }),
    new ModuleFederationPlugin({
      name: "container",
      remotes: {
        feed: enviroments?.FEED_UI,
        authentication: enviroments?.AUTHENTICATION_UI,
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
      },
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "./public/index.html"),
    }),
  ];
  if(!isProduction){
    plugins.push(new ForkTsCheckerWebpackPlugin());
  }
  console.log(plugins);

  return {
    entry: path.join(__dirname, "./src/index.ts"),
    mode: argv.mode || "development",
    devServer: {
      port: enviroments?.PORT || 4003,
      open: true,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      client: {
        overlay: !isProduction,
      }
    },
    resolve: {
      extensions: [".ts", ".tsx", ".js"],
      modules: ['./node_modules', 'node_modules'],
    },
    output: {
      filename: '[name].js',
      path: path.resolve(__dirname, 'dist'),
      publicPath: 'http://localhost:3000/', // Set your URL prefix here
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx|tsx|ts)$/,
          loader: "babel-loader",
          exclude: /node_modules/,
          options: {
            cacheDirectory: true,
            babelrc: false,
            presets: [
              [
                "@babel/preset-env",
                { targets: { browsers: "last 2 versions" } },
              ],
              "@babel/preset-typescript",
              "@babel/preset-react",
            ],
            plugins: [
              !isProduction && require.resolve('react-refresh/babel'),
              // "react-hot-loader/babel",
              // ["@babel/plugin-proposal-class-properties", { loose: true }],
              // [
              //   "@babel/plugin-proposal-private-property-in-object",
              //   { loose: true },
              // ],
              // ["@babel/plugin-proposal-private-methods", { loose: true }],
            ].filter(Boolean),
          },
        },
      ],
    },
    plugins
  };
};





const HtmlWebpackPlugin = require("html-webpack-plugin");
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const webpack = require("webpack");
const path = require('path');
const { ModuleFederationPlugin } = webpack.container;
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const deps = require("./package.json").dependencies;
require("dotenv").config({ path: path.join(__dirname, "./.env") });

const buildDate = new Date().toLocaleString();
const enviroments = process?.env ?? {};

module.exports = (env: any, argv: any) => {
  const isProduction = argv.mode === "production";
  return {
    entry: path.join(__dirname, "./src/index.ts"),
    mode: enviroments?.NODE_ENV || "development",
    devServer: {
      port: enviroments?.PORT || 4003,
      open: true,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      client: {
        overlay: false,
      },
    },
    resolve: {
      extensions: [".ts", ".tsx", ".js"],
      modules: ['./node_modules', 'node_modules'],
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx|tsx|ts)$/,
          loader: "babel-loader",
          exclude: /node_modules/,
          options: {
            cacheDirectory: true,
            babelrc: false,
            presets: [
              [
                "@babel/preset-env",
                { targets: { browsers: "last 2 versions" } },
              ],
              "@babel/preset-typescript",
              "@babel/preset-react",
            ],
            plugins: [
              require.resolve('react-refresh/babel'),
              // "react-hot-loader/babel",
              // ["@babel/plugin-proposal-class-properties", { loose: true }],
              // [
              //   "@babel/plugin-proposal-private-property-in-object",
              //   { loose: true },
              // ],
              // ["@babel/plugin-proposal-private-methods", { loose: true }],
            ],
          },
        },
      ],
    },

    plugins: [
      new ReactRefreshWebpackPlugin({
        overlay: false,
      }),
      new webpack.EnvironmentPlugin({ BUILD_DATE: buildDate }),
      new webpack.DefinePlugin({
        "process.env": JSON.stringify(enviroments),
      }),
      new ModuleFederationPlugin({
        name: "container",
        remotes: {
          feed: enviroments?.FEED_UI,
          authentication: enviroments?.AUTHENTICATION_UI,
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
        },
      }),
      new HtmlWebpackPlugin({
        template: path.join(__dirname, "./public/index.html"),
      }),
      new ForkTsCheckerWebpackPlugin(),
    ],
  };
};
