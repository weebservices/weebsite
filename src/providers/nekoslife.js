/*
 * Copyright (c) 2020 Weeb Services
 * Licensed under the Open Software License version 3.0
 */

const fetch = require('node-fetch')
const Provider = require('./provider')

class NekosLife extends Provider {
  constructor () {
    super([
      'YURI', 'NEKO', 'NEKO_NSFW',
      'FUTA', 'FEMDOM', 'FEET',
      'TRAP' // .
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
      case 'FUTA':
        return this._getImg('futanari')
      case 'FEMDOM':
        return this._getImg('femdom')
      case 'FEET':
        return this._getImg('erofeet')
      case 'TRAP':
        return this._getImg('trap')
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
