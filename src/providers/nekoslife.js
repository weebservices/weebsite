const fetch = require('node-fetch')
const Provider = require('./provider')

class NekosLife extends Provider {
  constructor () {
    super([
      'YURI', 'NEKO', 'NEKO_NSFW'
    ])
  }

  provide (type) {
    switch (type) {
      case 'YURI':
        return this._getImg('yuri')
      case 'NEKO':
        return this._getImg('neko')
      case 'NEKO_NSFW':
        return this._getImg('lewd')
      default:
        return null
    }
  }

  async _getImg (tag) {
    const img = await fetch(`https://nekos.life/api/v2/img/${tag}`).then(res => res.json())
    return [
      img.url.split('.').pop(),
      await fetch(img.url)
    ]
  }
}

module.exports = NekosLife
