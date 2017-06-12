var path = require('path')
var webpack = require('webpack')
var autoprefixer = require('autoprefixer')
var pxtorem = require('postcss-pxtorem')

var config = {
    entry: './src/client/index.js',
    output: {
        path: path.join(__dirname, '../'),
        filename: 'static/scripts/[name].js'
    },
    resolve: {
        modulesDirectories: ['node_modules', path.join(__dirname, '../node_modules')],
        extensions: ['', '.web.js', '.jsx', '.js', '.json'],
    },
    module: {
        modulesDirectories: ['node_modules'],
        loaders: [{
            test: /\.js$/,
            loader: 'babel',
            exclude: /node_modules/,
            query: {
                plugins: [
                    // ["transform-runtime", { polyfill: false }],
                    ["transform-runtime", {
                        "transforms": [{
                            "imports": ["react"],
                            "locals": ["module"]
                        }]
                    }],
                    ["import", [{ "style": "css", "libraryName": "antd-mobile" }]]
                ],
                presets: ['es2015', 'stage-0', 'react'],
                cacheDirectory: true
            }
        }, {
            test: /\.(jpg|png|gif)$/,
            loader: 'url?limit=8192',
        }, {
            test: /\.(svg)$/i, loader: 'svg-sprite', include: [
                require.resolve('antd-mobile').replace(/warn\.js$/, ''),  // 1. 属于 antd-mobile 内置 svg 文件
                // path.resolve(__dirname, 'src/my-project-svg-foler'),  // 自己私人的 svg 存放目录
            ]
        }, {
            test: /\.less$/,
            loaders: ["style", "css", "less"],
        }, {
            test: /\.css$/,
            loader: 'css?sourceMap&modules&localIdentName=[local]___[hash:base64:5]!!',
            exclude: /node_modules/
        }, {
            test: /\.css$/i,
            loaders: ["style", "css"],
        }]
    },
    postcss: [
        autoprefixer({
            browsers: ['last 2 versions', 'Firefox ESR', '> 1%', 'ie >= 8', 'iOS >= 8', 'Android >= 4'],
        }),
        pxtorem({ rootValue: 100, propWhiteList: [] })
    ],
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': '"production"',
            'process.env.__CLIENT__': 'true',
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.optimize.UglifyJsPlugin({
            output: {
                comments: false,
            },
            compress: {
                warnings: false
            }
        }),
    ],
    devtool: 'hidden-source-map',
    cache: true,
}

module.exports = config
