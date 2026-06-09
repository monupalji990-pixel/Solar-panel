exports.general = require('./modules/general')
exports.database = require('./modules/resetModule')

exports.apis = {}
exports.apis.roles = require('./apis/roles')
exports.apis.user = require('./apis/users')
exports.apis.auth = require('./apis/auth')

exports.data = {};
exports.data.sampledata = require('./modules/sampleData')

exports.hooks = {};
exports.hooks.resetDatabase = require('./hooks/resetDatabase')
exports.hooks.general = require('./hooks/general')