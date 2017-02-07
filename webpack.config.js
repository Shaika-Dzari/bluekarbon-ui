const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const isDev = (process.env.NODE_ENV === 'dev');

const APP_DIR = path.join(__dirname, 'app');
const BUILD_DIR = path.join(__dirname, '../bluekarbon-node/public');

const PLUGINS = [
    new ExtractTextPlugin("style.css", {
        allChunks: true
    })
];

if (!isDev) {
    PLUGINS.push(
        new webpack.optimize.UglifyJsPlugin({
            compress: { warnings: false},
            output: { comments: false }
        }));
}

const LOADERS = [
    {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('style', 'css!sass')
    },
    {
        test: /\.css$/, loader: "style-loader!css-loader"
    },
    {
        test : /\.jsx?$/,
        include : APP_DIR,
        loader : 'babel?cacheDirectory'
    }
];

module.exports = {
    entry: {app: ['babel-polyfill', APP_DIR]},
    resolve: {extensions: ['', '.js', '.jsx']},
    output: {
        path: BUILD_DIR,
        filename: 'bundle.js',
        publicPath: '/'
    },
    module: {loaders: LOADERS},
    plugins: PLUGINS
}