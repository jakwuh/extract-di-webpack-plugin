const path = require('path');
const nodeExternals = require('webpack-node-externals');
const ExtractDIPlugin = require('./');

module.exports = {

    entry: './test/spec',
    target: 'node',
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'spec.es5.js'
    },
    externals: [nodeExternals()],
    resolve: {
        alias: {
            'extract-di-webpack-plugin': '..'
        }
    },
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel'
        }, {
            test: /\.json$/,
            loader: 'json'
        }]
    },
    plugins: [new ExtractDIPlugin()]

};
