const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const outputDir = 'dist';

module.exports = {
  entry: ['./src/client/index.tsx'],
  output: {
    path: path.resolve(outputDir),
    filename: 'bundle.js'
  },
  resolve: {
    modules: [
      path.resolve('./src/client'),
      'node_modules',
    ],
    extensions: ['.ts', '.tsx', '.js', '.json']
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader'
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg)$/,
        loader: 'url-loader?limit=100000'
      }
    ]
  },
  devServer: {
    port: 3000,
    open: true,
    proxy: {
      '/api': 'http://localhost:8080'
    }
  },
  plugins: [
    new CleanWebpackPlugin([outputDir, 'data/uploads', 'data/zip-archives']),
    new HtmlWebpackPlugin({
      template: './public/index.html',
      favicon: './public/favicon.png'
    })
  ]
};
