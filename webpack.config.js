var webpack = require('webpack');

module.exports = {
  entry: './src/index.jsx',

  output: {
    path: './dist',
    filename: 'react-tournament-bracket.js',
    library: 'ReactTournamentBracket',
    libraryTarget: 'umd'
  },

  externals: {
    'react': { commonjs: 'react', commonjs2: 'react', amd: 'react', root: 'React' },
    'underscore': { commonjs: 'underscore', commonjs2: 'underscore', amd: 'underscore', root: '_' }
  },

  module: {
    loaders: [
      // interpret ES6
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel'
      }
    ]
  },

  resolve: {
    extensions: [ '', '.js', '.jsx' ]
  }
};