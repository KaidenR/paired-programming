const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports =  {
  entry: './menu/index.js',

  output: {
    filename: 'bundle.js',
    path: path.resolve('./menu/build/'),
    publicPath: '/'
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /^.*node_modules[\/\\](?!@pluralsight).*$/
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract({
          use: [
            'css-loader?modules&importLoaders=1&localIdentName=[local]---[hash:base64:5]',
            {
              loader: 'postcss-loader',
              options: {
                plugins: {
                  'postcss-import': {},
                  'postcss-cssnext': {},
                  'postcss-nested': {}
                }
              }
            }
          ],
        })
      }
    ]
  },

  plugins: [
    new ExtractTextPlugin('styles.css')
  ],

  devServer: {
    contentBase: path.join(__dirname, 'menu')
  }
}