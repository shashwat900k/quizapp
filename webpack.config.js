let path = require('path');
let webpack = require('webpack');
let ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: ['./src/app.js'],
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'public/app.bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'react','stage-0']
        },
        exclude: /node_modules/
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('css-loader!sass-loader'),
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      },
      { test: /\.(png|woff|woff2|eot|ttf|svg)$/,
        loader: 'url-loader?limit=100000'
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin({filename: 'public/styles.css', allChunks: true
    })
  ],
  stats: {
    colors: true
  },
  node: {
    fs: "empty",
    net: "empty",
    tls: "empty"
  },
  //target: "web",
  devtool: 'source-map'
};
