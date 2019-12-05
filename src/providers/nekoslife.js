const fetch = require('node-fetch')
const Provider = require('./provider')

class NekosLife extends Provider {
  constructor () {
    super([
      'YURI', 'NEKO', 'NEKO_NSFW'
    ])
  }

  provideYuri () {
    return this._getPost('yuri')
  }

  provideNeko () {
    return this._getPost('neko')
  }

  provideNekoNsfw () {
    return this._getPost('lewd')
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
