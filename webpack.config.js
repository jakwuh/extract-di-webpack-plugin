const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {

    entry: './index',
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'index.es5.js',
        libraryTarget: 'commonjs2'
    },
    externals: [
        nodeExternals()
    ],
    target: 'node',

    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel'
        }, {
            test: /\.json$/,
            loader: 'json'
        }]
    }

};
