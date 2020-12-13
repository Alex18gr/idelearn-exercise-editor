const path = require('path');
const baseConfig = require('./webpack.electron.config');

module.exports = {
  ...baseConfig,
  mode: 'development',
  devtool: 'source-map',
  output: {
    path: path.join(process.cwd(), 'dist', 'idelearn-exercise-editor'),
    filename: 'shell.js'
  }
};