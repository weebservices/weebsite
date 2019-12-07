const StatsD = require('node-dogstatsd')
module.exports = new StatsD({
  globalTags: { service: 'weeb.services' }
})
