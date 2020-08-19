const path = require('path')

module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  devServer: {
    https: true
  },
  outputDir: path.join(__dirname, '/../relay/paradigm')
}