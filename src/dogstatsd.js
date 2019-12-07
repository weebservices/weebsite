const StatsD = require('hot-shots')
module.exports = new StatsD({
  globalTags: [ 'service:weeb.services' ]
})
