const buildValidations = require('./build-utils/build-validations').default;
const commonConfig = require('./build-utils/webpack.common');
const { merge } = require('webpack-merge')

//es6
// import buildValidations from './build-utils/build-validations.js';
// import {commonConfig} from './build-utils/webpack.common.js';
// import {webpackMerge} from 'webpack-merge';

// We can include Webpack plugins, through addons, that do 
// not need to run every time we are developing.
// We will see an example when we set up 'Bundle Analyzer'
const addons = (/* string | string[] */ addonsArg) => {
  
  // Normalize array of addons (flatten)
  let addons = [...[addonsArg]] 
    .filter(Boolean); // If addons is undefined, filter it out

  return addons.map(addonName =>
    require(`./build-utils/addons/webpack.${addonName}.js`)
  );
};

// 'env' will contain the environment variable from 'scripts' 
// section in 'package.json'.
// console.log(env); => { env: 'dev' }
module.exports = env => {

  // We use 'buildValidations' to check for the 'env' flag
  if (!env) {
    throw new Error(buildValidations.ERR_NO_ENV_FLAG);
  }

  // Select which Webpack configuration to use; development 
  // or production
  // console.log(env.env); => dev
  const envConfig = require(`./build-utils/webpack.${env.env}.js`);
  
  // 'webpack-merge' will combine our shared configurations, the 
  // environment specific configurations and any addons we are
  // including
  const mergedConfig = merge(
    commonConfig,
    envConfig,
    ...addons(env.addons)
  );

  // Then return the final configuration for Webpack
  return mergedConfig;
};






const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const port = process.env.PORT || 3000;

module.exports = {
  mode: 'development',
  entry: {
    vendor: ['semantic-ui-react'],
    app: './src/index.js'
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        styles: {
          name: 'styles',
          test: /\.css$/,
          chunks: 'all',
          enforce: true
        },
        vendor: {
          chunks: 'initial',
          test: 'vendor',
          name: 'vendor',
          enforce: true
        }
      }
    }
  },
  output: {
    filename: '[name].[hash].js',
    publicPath: '/'
  },
  resolve: {
    alias: {
      "react-dom": "@hot-loader/react-dom",
    },
  },
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      template: 'public/index.html',
      favicon: 'public/favicon.ico'
    })
  ],
  devServer: {
    host: 'localhost',
    port: port,
    historyApiFallback: true,
    open: true,
    hot: true
  }
};




