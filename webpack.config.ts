/* eslint-disable import/no-extraneous-dependencies */
import * as webpack from 'webpack';

export default (): webpack.Configuration => ({
  mode: 'production',
  entry: './src/index.ts',
  output: {
    filename: 'index.js',
    libraryTarget: 'module',
    globalObject: 'this',
    umdNamedDefine: true,
  },
  externals: 'escape-html',
  experiments: {
    outputModule: true,
  },
  resolve: { extensions: ['.ts', '.js'] },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
    ],
  },
});
