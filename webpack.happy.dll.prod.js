const path = require('path');
const os = require('os');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlIncludeAssetsPlugin = require('html-webpack-include-assets-plugin');
const HappyPackPlugin = require('./happypack.config.js');
const vendorDllManifest = require('./dll/vendor.manifest.json');
const vendorDllConfig = require('./dll/vendor.config.json');
const ExtractTextPlugin = require('extract-text-webpack-plugin');


module.exports = {
    devtool: 'source-map',
    entry: {
        app: ['./src/page/index'],
    },

    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'assets/js/[name].[chunkhash:8].js',
        chunkFilename: 'assets/js/[name].[chunkhash:8].chunk.js'
    },

    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                include: path.resolve(__dirname, 'src'),
                use: ['happypack/loader?id=babel']
            },
            {
                test: /\.css$/,
                exclude: /node_modules/,
                include: path.resolve(__dirname, 'src'),
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'happypack/loader?id=css'
                })
            },
            {
                test: /\.scss$/,
                exclude: /node_modules/,
                include: path.resolve(__dirname, 'src'),
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'happypack/loader?id=scss'
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
        ],
        // 忽略对jquery lodash的进行递归解析
        noParse: function (content) {
            return /jquery|lodash/i.test(content)
        }
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
        extensions: ['.js', '.jsx'],
        // 考虑到 Scope Hoisting 依赖源码需采用 ES6 模块化语法，还需要配置 mainFields。因为大部分 Npm 中的第三方库采用了 CommonJS 语法，但部分库会同时提供 ES6 模块化的代码，为了充分发挥 Scope Hoisting 的作用，需要增加以下配置
        // 针对 Npm 中的第三方模块优先采用 jsnext:main 中指向的 ES6 模块化语法的文件
        mainFields: ['jsnext:main', 'browser', 'main']
    },

    plugins: [
        new HtmlWebpackPlugin({
            title: 'App',
            chunks: ['runtime', 'common', 'app'],
            template: path.resolve(__dirname, './public/layout.ejs'),
            filename: 'index.html'
        }),
        new HtmlIncludeAssetsPlugin({
            assets: [vendorDllConfig.vendor.js], // 添加的资源相对html的路径
            append: false // false 在其他资源的之前添加 true 在其他资源之后添加
        }),
        new webpack.DllReferencePlugin({
            context: process.cwd(),
            manifest: vendorDllManifest
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
        new webpack.optimize.UglifyJsPlugin({
            // 利用多核能力压缩
            beautify: {
                cache: true,
                workers: os.cpus().length
            },
            // 最紧凑的输出
            beautify: false,
            // 删除所有的注释
            comments: false,
            compress: {
                // 在UglifyJs删除没有用到的代码时不输出警告 
                warnings: false,
                // 删除所有的 `console` 语句
                //drop_console: true,
                // 内嵌定义了但是只用到一次的变量
                collapse_vars: true,
                // 提取出出现多次但是没有定义成变量去引用的静态值
                reduce_vars: true,
            },
            sourceMap: true
        })
    ].concat(HappyPackPlugin),

    performance: {
        hints: 'error',
        maxEntrypointSize: 400000, // 入口文件的最大体积 400000bytes = 390kb, 默认是250000bytes (包括 app.js+common.js+runtime.js)
        maxAssetSize: 300000,  // 资源文件大小 300000bytes = 244kb, 默认是250000bytes
        // assetFilter: function (assetFilename) {
        //     // 只给出.js 文件的性能提示
        //     return assetFilename.endsWith('.js');
        // }
    }
};