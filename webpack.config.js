const path = require('path');
const webpack = require('webpack');

const BUILD_DIR = './dist'
const ASSETS = '/assets'

module.exports = {
    context: path.resolve(__dirname, './app/src'),
    entry: {
        app: ['app.js']
    },
    output: {
        path: path.resolve(__dirname, BUILD_DIR + ASSETS),
        filename: '[name].bundle.js',
        publicPath: ASSETS
    },
    devServer: {
        contentBase: path.resolve(__dirname, './app')
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    },
    resolve: {
        modules: [
            path.resolve(__dirname, './app/src'),
            'node_modules'
        ],
        extensions: ['.js']
    }
};
