/*
 * Copyright (c) 2020 Weeb Services
 * Licensed under the Open Software License version 3.0
 */

const AbstractDanbooru = require('./AbstractDanbooru')

class Yandere extends AbstractDanbooru {
  constructor () {
    super([
      'SENKO', 'KANNA', 'TOHRU',
      'YURI', 'BDSM',
      'THIGH', 'THIGH_NSFW',
      'NEKO', 'NEKO_NSFW',
      'MAID', 'MAID_NSFW',
      'FUTA', 'FEET',
      'TENTACLE', 'YAOI',
      'TRAP' // I hate humanity for this
    ])
  }

  get url () {
    return 'https://yande.re/post.json?tags=#{tag}&limit=500'
  }

  provide (type) {
    switch (type) {
      case 'SENKO':
        return this._getPost('senko-san', [ Yandere.SAFE ])
      case 'KANNA':
        return this._getPost('kanna_kamui', [ Yandere.SAFE ])
      case 'TOHRU':
        return this._getPost('tooru_(kobayashi-san_chi_no_maid_dragon)', [ Yandere.SAFE ])
      case 'YURI':
        return this._getPost('yuri', [ Yandere.SAFE, Yandere.QUESTIONABLE, Yandere.EXPLICIT ])
      case 'BDSM':
        return this._getPost('bondage', [ Yandere.SAFE, Yandere.QUESTIONABLE, Yandere.EXPLICIT ])
      case 'THIGH':
        return this._getPost('thighhighs', [ Yandere.SAFE ])
      case 'THIGH_NSFW':
        return this._getPost('thighhighs', [ Yandere.QUESTIONABLE, Yandere.EXPLICIT ])
      case 'NEKO':
        return this._getPost('neko', [ Yandere.SAFE ])
      case 'NEKO_NSFW':
        return this._getPost('neko', [ Yandere.QUESTIONABLE, Yandere.EXPLICIT ])
      case 'MAID':
        return this._getPost('maid', [ Yandere.SAFE ])
      case 'MAID_NSFW':
        return this._getPost('maid', [ Yandere.QUESTIONABLE, Yandere.EXPLICIT ])
      case 'FUTA':
        return this._getPost('futanari', [ Yandere.SAFE, Yandere.QUESTIONABLE, Yandere.EXPLICIT ])
      case 'FEET':
        return this._getPost('feet', [ Yandere.SAFE, Yandere.QUESTIONABLE, Yandere.EXPLICIT ])
      case 'TENTACLE':
        return this._getPost('tentacles', [ Yandere.SAFE, Yandere.QUESTIONABLE, Yandere.EXPLICIT ])
      case 'YAOI':
        return this._getPost('yaoi', [ Yandere.SAFE, Yandere.QUESTIONABLE, Yandere.EXPLICIT ])
      case 'TRAP':
        return this._getPost('trap', [ Yandere.SAFE, Yandere.QUESTIONABLE, Yandere.EXPLICIT ], true)
      default:
        return null
    }
  }
}

Yandere.SAFE = 's'
Yandere.QUESTIONABLE = 'q'
Yandere.EXPLICIT = 'e'

module.exports = Yandere
