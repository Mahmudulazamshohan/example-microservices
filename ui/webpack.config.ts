const HtmlWebpackPlugin = require("html-webpack-plugin");
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const webpack = require("webpack");
const path = require('path');
const Dotenv = require('dotenv-webpack');
const { ModuleFederationPlugin } = webpack.container;
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const deps = require("./package.json").dependencies;

const buildDate = new Date().toLocaleString();

require('dotenv').config({ silent: true });
const enviroments = process?.env ?? {};

console.log(enviroments);
console.log('FEED_UI', JSON.stringify(process.env.FEED_UI));


module.exports = (env: any, argv: { [key: string]: string }) => {
  const isProduction: boolean = argv.mode === "production";
  console.log(argv);
  console.log({
    feed: env?.FEED_UI,
    authentication: env?.AUTHENTICATION_UI,
  });

  let plugins: any[] = [];

  if (!isProduction) {
    plugins.push(new ReactRefreshWebpackPlugin({
      overlay: false,
    }));
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
        feed: env?.FEED_UI,
        authentication: env?.AUTHENTICATION_UI,
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
  ];
  if(!isProduction){
    plugins.push(new ForkTsCheckerWebpackPlugin());
  }

  plugins.push(new Dotenv({
    path: isProduction ? '.env.prod' : '.env',
  }));

  return {
    entry: path.join(__dirname, "./src/index.ts"),
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
        overlay: !isProduction,
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
      publicPath: 'http://localhost:4003/',
      clean: true,
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
              !isProduction && require.resolve('react-refresh/babel')
            ].filter(Boolean),
          },
        },
      ],
    },
    plugins
  };
};
