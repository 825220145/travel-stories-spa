const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development', // Atau 'production' jika untuk produksi
  entry: './src/app.js', // Entry point ke app.js
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader', // Pastikan menggunakan Babel untuk file JS
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html', // Pastikan file HTML ada di root folder
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'), // Menentukan folder statis
    },
    open: true, // Otomatis membuka browser saat server dijalankan
    hot: true,  // Mengaktifkan Hot Module Replacement (HMR)
  },
};
