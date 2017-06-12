var path = require('path')
var webpack = require('webpack')
var ExtractTextPlugin = require("extract-text-webpack-plugin");

var extractCSS = new ExtractTextPlugin('static/styles/default/vender.min.css');
var extractLESS = new ExtractTextPlugin('static/styles/default/index.min.css');

var config = {
    entry: './src/client/index.js',
    output: {
        path: path.join(__dirname, '../'),
        filename: 'static/scripts/[name].js'
    },
    resolve: {
        modulesDirectories: ['node_modules'],
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
            test: /\.(svg)$/i,
            loader: 'svg-sprite',
            include: [require.resolve('antd-mobile').replace(/warn\.js$/, '')]
        }, {
            test: /\.less$/,
            loader: extractLESS.extract(['css', 'less']),
        }, {
            test: /\.css$/,
            loader: extractCSS.extract(['css']),
        }]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': '"production"',
            'process.env.__CLIENT__': 'true',
        }),
        extractCSS,
        extractLESS,
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
