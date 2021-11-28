var webpack = require('webpack');

module.exports = {
    entry: "./src/base.js",

    output: {
        filename: "build.js",
    },
    module: {
        loaders: [
            { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
        ]
    }
};
