const webpack = require('webpack');
const path = require('path');

const config = {
  mode: "development",
  devtool: "cheap-module-source-map",
  cache: { type: 'memory' },
  entry: [
    'react-hot-loader/patch',
    './src/index.js'
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.(js|mjs|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', { targets: "defaults" }]
            ]
          }
        }
      },
      {
        loader: "thread-loader",
        // 有同样配置的 loader 会共享一个 worker 池
        options: {
          // 产生的 worker 的数量，默认是 (cpu 核心数 - 1)，或者，
          // 在 require('os').cpus() 是 undefined 时回退至 1
          workers: 5,
    
          // 一个 worker 进程中并行执行工作的数量
          // 默认为 20
          workerParallelJobs: 50
  
        },
      },
    ]
  },
  devServer: {
    'static': {
      directory: './dist'
    }
  }
};

module.exports = config;