const fetch = require('node-fetch')
const Provider = require('./provider')

class FBI extends Provider {
  constructor () {
    super([
      'SENKO_NSFW'
    ])
  }

  provideSenkoNsfw () {
    return this._provide()
  }

  async _provide () {
    return [ 'gif', await fetch('https://media1.tenor.com/images/e683152889dc703c77ce5bada1e89705/tenor.gif') ]
  }
}

module.exports = FBI
