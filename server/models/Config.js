const mongoose = require('mongoose')

const RouterConfigSchema = new mongoose.Schema({
  flamechat: Boolean,
  satellite: Boolean,
  paradox: Boolean,
  drawer: Boolean,
  media: Boolean
})

const ConfigSchema = new mongoose.Schema({
  sign_up: Boolean,
  migrate: Boolean,
  router: RouterConfigSchema
}, { collection: 'config' })

const ConfigModel = mongoose.Model('config', ConfigSchema)

module.exports = ConfigModel