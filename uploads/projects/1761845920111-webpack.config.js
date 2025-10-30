const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

//Louise Bruwer u23673941 p29
module.exports = {
    mode: process.env.NODE_ENV || 'development',
    entry: path.resolve(__dirname, 'src', 'client', 'index.tsx'),
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
        publicPath: '/'
    },
    devtool: 'source-map',
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.json']
    },
    module: {
        rules: [
        { test: /\.tsx?$/, loader: 'ts-loader', exclude: /node_modules/ },
        { test: /\.jsx?$/, exclude: /node_modules/, use: 'babel-loader' },
        { test: /\.css$/, use: ['style-loader', 'css-loader'] },
        { enforce: 'pre', test: /\.js$/, loader: 'source-map-loader' }
        ]
    },
    devServer: {
        historyApiFallback: true,
        static: {
            directory: path.join(__dirname, 'public'),
        },
        hot: true,
        port: 3000,
        proxy: [
            {
            context: ['/api'],
            target: 'http://localhost:3001',
            },
        ],
    },

    plugins: [
        new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'public', 'index.html')
        })
    ]
};
