const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    background: './src/background/index.ts',
    popup: './src/popup/index.tsx',
    aiMonitor: './src/contents/aiMonitor.ts'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true
            }
          }
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.json'],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: 'assets', to: 'assets' },
        { 
          from: 'src/manifest.json',
          to: 'manifest.json'
        },
        {
          from: 'src/popup/index.html',
          to: 'popup.html'
        },
        {
          from: 'src/popup/style.css',
          to: 'popup.css'
        }
      ],
    }),
  ],
};