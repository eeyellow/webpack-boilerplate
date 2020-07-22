// webpack config
const path = require('path');
const glob = require('glob');
const fs = require('fs');
const WebpackBar = require('webpackbar');
const {
  CleanWebpackPlugin
} = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const {
  VueLoaderPlugin
} = require('vue-loader');

const entryDir = path.resolve(__dirname, 'src'); //src目錄
const outDir = path.resolve(__dirname, "dist"); //dist目錄

/** 產生webpack entry point
 *  路徑一比一對應
 * @param {*} targetPath 來源目錄
 */
const getEntry = (targetPath) => {
  const entry = {};
  glob.sync(targetPath + '/**/*.js').forEach((name) => {
    var dir = path.relative(targetPath, path.dirname(name));
    var basename = path.basename(name);
    var extname = path.extname(name);
    var re = new RegExp(extname, "g");
    var filename = basename.replace(re, '');

    var key = path.join(dir, filename).split("\\").join("/");
    var value = "./" + (key + extname).split("\\").join("/");

    entry[key] = value;
  });
  return entry;
};



module.exports = (env = {}) => ({
  context: entryDir,
  mode: 'production',
  entry: getEntry(entryDir),
  output: {
    path: outDir,
    filename: './[name].js'
  },
  module: {
    rules: [{
        test: /\.vue$/,
        use: 'vue-loader'
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      },
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [{
            loader: "babel-loader",
            options: {
              babelrc: true
            }
          },
          {
            loader: "ts-loader",
            options: {
              appendTsSuffixTo: [/\.vue$/]
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: [{
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: !env.production
            }
          },
          'css-loader'
        ]
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js', '.vue', '.json'],
    alias: {
      'vue': '@vue/runtime-dom'
    }
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './index.html'
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css'
    }),
    new WebpackBar(),
    new VueLoaderPlugin(),
  ],
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    }
  },
  // devtool: 'source-map',
  // devServer: {
  //   contentBase: entryDir,
  //   publicPath: process.env.BASE_URL,
  //   index: './index.html',
  //   hot: true,
  //   stats: 'minimal',
  //   quiet: true,
  //   overlay: {
  //     warnings: true,
  //     errors: true
  //   },
  //   historyApiFallback: true,
  // }
});