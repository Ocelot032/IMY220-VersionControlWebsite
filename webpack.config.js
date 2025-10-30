










const path = require("path");

module.exports = {
  entry: "./frontend/src/index.js",
  output: {
    path: path.resolve(__dirname, "frontend", "public"),
    filename: "bundle.js",
  },
  mode: "development",
  module: {
    rules: [
      {
        test: /\.js$/, // only bundle .js files
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.css$/i, // 👈 this handles normal CSS imports
        use: [
          "style-loader", // injects CSS into the DOM
          "css-loader",   // allows importing CSS files into JS
        ],
      },
    ],
  },
  devServer: {
    static: {
      directory: path.join(__dirname, "frontend/public"),
    },
    port: 3000,
    historyApiFallback: true,
    proxy: [
      {
        context: ["/api"],
        target: "http://localhost:8080",
        changeOrigin: true,
      },
    ],
  },
};
// const path = require("path");

// module.exports = {
//     entry: "./frontend/src/index.js",
//     output: {
//         path: path.resolve(__dirname, "frontend", "public"),
//         filename: "bundle.js"
//     },
//     mode: "development",
//     module: {
//     rules: [
//         {
//             test: /\.js$/, //only bundle .js files
//             exclude: /node_modules/, //leave out node modules (obv)
//             use: {
//                 loader: "babel-loader"
//             },
            
//         }
//     ]
//     },
//     devServer: {
//   static: {
//     directory: path.join(__dirname, 'frontend/public'),
//   },
//   port: 3000,
//   historyApiFallback: true,
//   proxy: [
//     {
//       context: ['/api'],
//       target: 'http://localhost:8080',
//       changeOrigin: true,
//     },
//   ],
// },

// }