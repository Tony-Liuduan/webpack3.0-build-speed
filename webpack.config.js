const path = require('path');
const os = require('os');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const AddTitlePlugin = require('./plugins/add-title-plugin.js');


module.exports = {
    devtool: 'source-map',

    entry: {
        app: ['./src/page/index'],
        user: ['./src/page/user'],
        vendor: ['react', 'react-dom'],
    },

    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'assets/js/[name].[chunkhash:8].js',
        chunkFilename: 'assets/js/[name].[chunkhash:8].chunk.js'
    },

    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                include: path.resolve(__dirname, 'src'),
                use: [
                    'babel-loader?cacheDirectory'
                ]
            },
            {
                test: /\.css$/,
                exclude: /node_modules/,
                include: path.resolve(__dirname, 'src'),
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        'fast-css-loader',
                        {
                            loader: 'postcss-loader',
                            options: { sourceMap: true, config: { path: 'postcss.config.js' } }
                        }
                    ]
                })
            },
            {
                test: /\.scss$/,
                exclude: /node_modules/,
                include: path.resolve(__dirname, 'src'),
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        'fast-css-loader',
                        {
                            loader: 'postcss-loader',
                            options: { sourceMap: true, config: { path: 'postcss.config.js' } }
                        },
                        'fast-sass-loader'
                    ]
                })
            },
            {
                test: /\.(png|svg|jpe?g|gif)$/,
                exclude: /node_modules/,
                include: path.resolve(__dirname, 'src'),
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192,
                            name: 'assets/img/[name].[hash:8].[ext]'
                        }
                    }
                ]
            },
            {
                test: /\.(woff2?|eot|ttf|otf)$/,
                exclude: /node_modules/,
                include: path.resolve(__dirname, 'src'),
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10000,
                            name: 'assets/font/[name].[hash:8].[ext]'
                        }
                    }
                ]
            }
        ]
    },

    resolve: {
        modules: [ // 优化模块查找路径
            path.resolve(__dirname, 'src'),
            path.resolve(__dirname, 'node_modules') // 指定node_modules所在位置 当你import 第三方模块时 直接从这个路径下搜索寻找
        ],
        alias: {
            assets: path.resolve(__dirname, 'src/assets/'),
            components: path.resolve(__dirname, 'src/components/'),
            style: path.resolve(__dirname, 'src/style/')
        },
        extensions: ['.js', '.jsx']
    },

    plugins: [
        new CleanWebpackPlugin(['build']),
        new HtmlWebpackPlugin({
            title: 'App',
            chunks: [/* 'runtime',  */'vendor', 'common', 'app'],
            template: path.resolve(__dirname, './public/layout.ejs'),
            filename: 'index.html'
        }),
        new HtmlWebpackPlugin({
            title: 'User',
            chunks: [/* 'runtime',  */'vendor', 'common', 'user'],
            template: path.resolve(__dirname, './public/layout.ejs'),
            filename: 'user.html'
        }),
        new ExtractTextPlugin('assets/css/[name].[contenthash:8].css'),
        new webpack.HashedModuleIdsPlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: ['vendor', 'common'],
            // minChunks: Infinity // 随着 入口chunk 越来越多，这个配置保证没其它的模块会打包进 公共chunk
            minChunks: function (module, count) {
                const resource = module.resource
                // 以 .css 结尾的资源，重复 require 大于 1 次
                return resource && /\.(css|scss)$/.test(resource) && count > 1
            }
        }),
        new webpack.optimize.ModuleConcatenationPlugin(), // Scope Hoisting
        // new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /zh|en/), 语言支持过滤
        // new webpack.optimize.UglifyJsPlugin({ 
        //     // 利用多核能力压缩
        //     beautify: {
        //         cache: true,
        //         workers: os.cpus().length
        //     },
        //     // 最紧凑的输出
        //     beautify: false,
        //     // 删除所有的注释
        //     comments: false,
        //     compress: {
        //         // 在UglifyJs删除没有用到的代码时不输出警告 
        //         warnings: false,
        //         // 删除所有的 `console` 语句
        //         //drop_console: true,
        //         // 内嵌定义了但是只用到一次的变量
        //         collapse_vars: true,
        //         // 提取出出现多次但是没有定义成变量去引用的静态值
        //         reduce_vars: true,
        //     },
        //     sourceMap: true
        // }),
        new AddTitlePlugin()
    ]
};
