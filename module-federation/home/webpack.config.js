const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;

module.exports = {
    mode: 'development',
    target: 'web',
    entry: './index.js',
    output: {
        filename: 'main.js',
        path: __dirname + '/dist',
    },
    devServer: {
        port: 3001,
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                loader: "babel-loader",
                exclude: /node_modules/,
                options: {
                    presets: ["@babel/preset-react"],
                },
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './index.html',
        }),
        new ModuleFederationPlugin({
            // 应用名，全局唯一，不可冲突。 
            name: 'homepage',
            // 暴露的文件名称 
            filename: 'remoteEntry.js',
            // 远程应用暴露出的模块名。
            exposes: {
                './Homepage': './src/Homepage.js',
            },
            //远程访问地址入口  host（使用者模块）
            remotes: {
                uicomponents: "uicomponents@http://localhost:3000/remoteEntry.js",
            },
            // 依赖包 依赖的包 webpack在加载的时候会先判断本地应用是否存在对应的包，如果不存在，则加载远程应用的依赖包。
            shared: {
                react: {singleton: true},
                "react-dom": {singleton: true},
                "react-router-dom": {singleton: true}
            }
        }),
    ],
};