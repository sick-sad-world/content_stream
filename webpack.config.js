const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const { mode, port } = require('yargs').argv;

const CONTEXT = 'assets';
const P = mode === 'production'
const DEST = (P) ? '/build' : '/dist';

const Extract = new ExtractTextPlugin({
  filename: '[name].css'
});

const makeOutput = (path) => (P) ? `${path}/[hash:12].[ext]` : `${path}/[name].[ext]`;

const PLUGINS = [
  Extract,
  new HtmlWebpackPlugin({
    template: './index.html',
    filename: './index.html',
    title: 'Content Stream',
    chunks: ['vendor', 'index']
  }),
  new HtmlWebpackPlugin({
    template: './app.html',
    filename: './app.html',
    title: 'Content Stream',
    chunks: ['vendor', 'app']
  }),
  new BundleAnalyzerPlugin({
    analyzerMode: (port) ? 'server' : 'static'
  })
];

if (!P) {
  PLUGINS.push(new webpack.NoEmitOnErrorsPlugin());
}

if (port) {
  PLUGINS.push(new webpack.HotModuleReplacementPlugin());
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
      test: /\.css$/,
      exclude: /node_modules/,
      use: Extract.extract({
        fallback: 'style-loader',
        use: [{
          loader: 'css-loader',
          options: {
            sourceMap: P
          }
        }]
      })
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
          name: makeOutput('img')
        }
      }, {
        loader: 'image-webpack-loader'
      }]
    }, {
      test: /\.woff2?$/,
      include: /fonts/,
      exclude: /(node_modules|img)/,
      use: {
        loader: 'file-loader',
        options: {
          name: makeOutput('fonts')
        }
      }
    }]
  }
};
