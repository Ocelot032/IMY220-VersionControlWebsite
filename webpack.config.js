const path = require("path");

module.exports = {
  entry: "./frontend/src/index.js",
  output: {
    path: path.resolve("frontend/public"), // bundle goes here
    filename: "bundle.js" 
  },
  mode: "development",
  module: {
    rules: [
        { 
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
                loader: "babel-loader"
            }
        }
    ]
  },
  resolve: {
    extensions: [".js", ".jsx"]
  },
};
