const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: './src/index.tsx',  // Entry point for the React app
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
        publicPath: '/',
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'], // Resolve TypeScript and JavaScript files
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/, // Match TypeScript files
                use: 'ts-loader',
                exclude: /node_modules/, // Exclude node_modules
            },
            {
                test: /\.css$/, // Match CSS files
                use: ['style-loader', 'css-loader'], // Loaders for CSS
            },
        ],
    },
    devtool: 'source-map', // Enable source maps for easier debugging
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 9000,
        historyApiFallback: true, // Support for React Router
    },
    plugins: [
        new CleanWebpackPlugin(), // Clean the output directory before each build
    ],
};