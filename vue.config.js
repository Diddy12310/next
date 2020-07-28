const path = require('path')

module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  devServer: {
    https: true,
    proxy: {
      '/': {
        target: 'https://localhost:8080',
        ws: true,
        changeOrigin: true
      }
    }
  },
  outputDir: path.join(__dirname, '/../relay/paradigm')
}