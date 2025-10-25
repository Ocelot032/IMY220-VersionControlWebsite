const path = require("path");

module.exports = {
    entry: "./frontend/src/index.js",
    output: {
        path: path.resolve(__dirname, "frontend", "public"),
        filename: "bundle.js"
    },
    mode: "development",
    module: {
    rules: [
        {
            test: /\.js$/, //only bundle .js files
            exclude: /node_modules/, //leave out node modules (obv)
            use: {
                loader: "babel-loader"
            }
        }
    ]
    },
    devServer: {
        static: {
            directory: path.join(__dirname, 'public'),
        },
        compress: true,
        hot: true,
        port: 8080,
    }
}