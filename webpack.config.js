const path = require('path');
const webpack = require('webpack');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const dotenv = require('dotenv').config({ path: __dirname + '/.env' });

module.exports = {
  entry: './public/main.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js',
    clean: true, // Cleans dist folder on each build
    assetModuleFilename: 'assets/[hash][ext][query]'
  },
  plugins: [
    new HtmlWebPackPlugin({
      hash: true,
      template: './public/index.html',
      filename: 'index.html'
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
      chunkFilename: '[id].[contenthash].css'
    }),
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(process.env || dotenv.parsed),
    }),
    new ESLintPlugin()
  ],
  module: {
    rules: [
      // SCSS handling with MiniCssExtractPlugin
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',    // Translates CSS into CommonJS
          'sass-loader'    // Compiles Sass to CSS
        ],
      },
      // CSS handling with MiniCssExtractPlugin
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader'
        ],
      },
      // Image handling using Webpack 5 asset modules
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/images/[name][ext]'
        }
      },
      // Font handling using asset modules (no file-loader)
      {
        test: /\.(woff|woff2|ttf|eot)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/fonts/[name][ext]'
        }
      }
    ]
  },
  optimization: {
    minimize: true,
    minimizer: [
      '...', // Extends existing minimizers (like Terser)
      new CssMinimizerPlugin()
    ]
  },
  devServer: {
    open: true,
    port: 8000,
    static: {
      directory: path.join(__dirname, 'public')
    },
    hot: true
  }
};
