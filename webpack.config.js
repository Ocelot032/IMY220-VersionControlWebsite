const path = require("path");

module.exports = {
  entry: "./frontend/src/index.js",
  output: {
    path: path.resolve("frontend/public"), 
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
        },
         {
          test: /\.css$/i,
          use: ["style-loader", "css-loader"], 
        },
    ]
  },
  resolve: {
    extensions: [".js", ".jsx"]
  },
  devServer: {
    historyApiFallback: true,
    static: path.join(__dirname, "frontend/public"),
    port: 8080,
    hot: true
  },
};
