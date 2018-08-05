const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: path.join(__dirname, "src/docs"),
  output: {
    path: path.join(__dirname, "docs"),
    filename: "bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: {
          loader: "babel-loader",
          options:{
            babelrc: true
          }
        },
        exclude: /node_modules/
      },
      {
        test: /\.scss$|\.css$/,
        use: [{
            loader: "style-loader" // creates style nodes from JS strings
        }, {
            loader: "css-loader",
            options: {
                    sourceMap: true
            } // translates CSS into CommonJS
        }, {
            loader: "sass-loader",
            options: {
              sourceMap: true
            } // compiles Sass to CSS
        }]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "src/docs/index.html")
    })
  ],
  resolve: {
    extensions: [".js", ".jsx"]
  },
  devServer: {
    contentBase: path.join(__dirname, "docs"),
    port: 8000,
    stats: "minimal"
  }
};
