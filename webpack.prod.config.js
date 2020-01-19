const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    'entry': './src/index.js',
    'mode': 'production',
    'output': {
        'path': path.resolve(__dirname, 'dist'),
        'filename': 'bundle.js'
    },
    'plugins': [
        new webpack.HotModuleReplacementPlugin(),
        new CopyWebpackPlugin([
            { from: 'public/index.html', to: './'},
            { from: 'public/styles.css', to: './'}
        ])        
    ],
    'resolve': {
        'extensions': ['*', '.js', '.jsx']
    },
    'module': {
        'rules': [
            {
                'test': /\.(js|jsx)$/,
                'loader': 'babel-loader',
                'query': {
                    'presets': ['@babel/preset-env', '@babel/preset-react']
                },
                'exclude': /node_modules/
            },
            {
                'test': /\.css$/,
                'use': ['styles-loader', 'css-loader']
            }
        ]
    },
    'devServer': {
        'contentBase': 'dist',
        'port': 4000,
        'hotOnly': true
    }
};