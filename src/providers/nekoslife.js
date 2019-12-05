const fetch = require('node-fetch')
const Provider = require('./provider')

class NekosLife extends Provider {
  constructor () {
    super([
      'YURI', 'NEKO', 'NEKO_NSFW'
    ])
  }

  provideYuri () {
    return this._getImg('yuri')
  }

  provideNeko () {
    return this._getImg('neko')
  }

  provideNekoNsfw () {
    return this._getImg('lewd')
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
