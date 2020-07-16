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

const getEntry = () => {
  const entry = {};
  glob.sync('./src/js/**/*.js').forEach((name) => {
     const start = name.indexOf('/src/js/') + 8; //前面路徑共8個位元的字串，設定的資料夾路徑不同，也要記得更改位元數喔!
     const end = name.length - 3; //減去附檔名 .js 共三個位元的字串
     const eArr = [];
     const n = name.slice(start,end); //取得每個js的名稱
     eArr.push(name); //push至陣列中
     entry[n] = eArr; //就會產生多筆入口的陣列囉！
  });
  console.log(entry);
  return entry;
};


module.exports = (env = {}) => ({
  context: path.resolve(__dirname, 'src'),
  mode: env.production ? 'production' : 'development',
  //entry: getEntry(),
  entry: {
    app: [ './js/app.js' ],
    app2: [ './js/app2.js' ],
    app4: [ './js/dir1/app4.js' ],
    app3: [ './js/dir2/subdir1/app3.js' ]
  },
  output: {
    path: path.resolve(__dirname, "dist"),
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
  // optimization: {
  //   runtimeChunk: 'single',
  //   splitChunks: {
  //     cacheGroups: {
  //       vendor: {
  //         test: /[\\/]node_modules[\\/]/,
  //         name: 'vendors',
  //         chunks: 'all'
  //       }
  //     }
  //   }
  // },
  devtool: 'source-map',
  devServer: {
    contentBase: path.join(__dirname, 'src'),
    publicPath: process.env.BASE_URL,
    index: './index.html',
    hot: true,
    stats: 'minimal',
    quiet: true,
    overlay: {
      warnings: true,
      errors: true
    },
    historyApiFallback: true,
  }
});
