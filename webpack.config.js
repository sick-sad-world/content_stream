const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const { mode, c, port, watch } = require('yargs').argv;

const CONTEXT = 'assets';
const P = mode === 'production'
const DEST = (P) ? '/build' : '/dist';

const PLUGINS = [
  new HtmlWebpackPlugin({
    template: './index.html',
    title: 'Content Stream',
    chunks: ['index']
  }),
  new HtmlWebpackPlugin({
    template: './app.html',
    title: 'Content Stream',
    chunks: ['vendor', 'app']
  })
];

if (!P) {
  PLUGINS.push(new webpack.NoEmitOnErrorsPlugin());
}

if (port) {
  PLUGINS.push(new webpack.HotModuleReplacementPlugin());
} else if (!port && !c) {
  PLUGINS.push(new BundleAnalyzerPlugin({
    analyzerMode: (watch) ? 'server' : 'static'
  }));
}


module.exports = {
  devtool: (!P) ? 'source-map' : false,
  context: path.resolve(__dirname, CONTEXT),
  cache: true,
  stats: 'normal',
  entry: {
    app: ['./src/app.js'],
    index: ['./src/index.js']
  },
  output: {
    path: path.join( __dirname, DEST),
    publicPath: '/',
    filename: (P) ? '[chunkhash:12].js' : '[name].js'
  },
  devServer: {
    hot: !!port,
    contentBase: path.resolve(__dirname, CONTEXT),
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all'
        }
      }
    }
  },
  watchOptions: {
    ignored: /node_modules/
  },
  plugins: PLUGINS,
  module: {
    rules: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      use: 'babel-loader'
    }, {
      test: /\.svg$/,
      include: /icons|img/,
      exclude: /node_modules/,
      use: [{
        loader: 'svg-inline-loader',
        options: {
          classPrefix: true
        }
      }]
    }, {
      test: /\.(png|jpe?g|gif)?$/,
      include: /img/,
      exclude: /node_modules/,
      use: [{
        loader: 'file-loader',
        options: {
          name: (P) ? 'img/[hash:12].[ext]' : 'img/[name].[ext]'
        }
      }, {
        loader: 'image-webpack-loader'
      }]
    }, {
      test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9#=&.]+)?$/,
      include: /font/,
      exclude: /(node_modules|img)/,
      use: {
        loader: 'url-loader',
        options: {
          limit: 8192,
          name: (P) ? 'font/[hash:12].[ext]' : 'font/[name].[ext]'
        }
      }
    }]
  }
};
