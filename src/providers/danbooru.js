/*
 * Copyright (c) 2020 Weeb Services
 * Licensed under the Open Software License version 3.0
 */

const AbstractDanbooru = require('./AbstractDanbooru')

class Danbooru extends AbstractDanbooru {
  constructor () {
    super([
      'SENKO', 'KANNA', 'TOHRU',
      'YURI', 'BDSM', 'TIED',
      'THIGH', 'THIGH_NSFW',
      'NEKO', 'NEKO_NSFW',
      'MAID', 'MAID_NSFW',
      'HANDHOLDING', 'HANDHOLDING_NSFW',
      'FUTA', 'FEMDOM', 'FEET',
      'TENTACLE', 'YAOI',
      'TRAP' // no comment
    ])
  }

  get url () {
    return 'https://danbooru.donmai.us/posts.json?tags=#{tag}&limit=200'
  }

  provide (type) {
    switch (type) {
      case 'SENKO':
        return this._getPost('senko_(sewayaki_kitsune_no_senko-san)', [ Danbooru.SAFE ])
      case 'KANNA':
        return this._getPost('kanna_kamui', [ Danbooru.SAFE ])
      case 'TOHRU':
        return this._getPost('tooru_(maidragon)', [ Danbooru.SAFE ])
      case 'YURI':
        return this._getPost('yuri', [ Danbooru.SAFE, Danbooru.QUESTIONABLE, Danbooru.EXPLICIT ])
      case 'BDSM':
        return this._getPost('bdsm', [ Danbooru.SAFE, Danbooru.QUESTIONABLE, Danbooru.EXPLICIT ])
      case 'TIED':
        return this._getPost('bound', [ Danbooru.SAFE, Danbooru.QUESTIONABLE, Danbooru.EXPLICIT ])
      case 'THIGH':
        return this._getPost('thighs', [ Danbooru.SAFE ])
      case 'THIGH_NSFW':
        return this._getPost('thighs', [ Danbooru.QUESTIONABLE, Danbooru.EXPLICIT ])
      case 'NEKO':
        return this._getPost('cat', [ Danbooru.SAFE ])
      case 'NEKO_NSFW':
        return this._getPost('cat', [ Danbooru.QUESTIONABLE, Danbooru.EXPLICIT ])
      case 'MAID':
        return this._getPost('maid', [ Danbooru.SAFE ])
      case 'MAID_NSFW':
        return this._getPost('maid', [ Danbooru.QUESTIONABLE, Danbooru.EXPLICIT ])
      case 'HANDHOLDING':
        return this._getPost('holding_hands', [ Danbooru.SAFE ])
      case 'HANDHOLDING_NSFW':
        return this._getPost('holding_hands', [ Danbooru.QUESTIONABLE, Danbooru.EXPLICIT ])
      case 'FUTA':
        return this._getPost('futanari', [ Danbooru.SAFE, Danbooru.QUESTIONABLE, Danbooru.EXPLICIT ])
      case 'FEMDOM':
        return this._getPost('femdom', [ Danbooru.SAFE, Danbooru.QUESTIONABLE, Danbooru.EXPLICIT ])
      case 'FEET':
        return this._getPost('feet', [ Danbooru.SAFE, Danbooru.QUESTIONABLE, Danbooru.EXPLICIT ])
      case 'TENTACLE':
        return this._getPost('tentacles', [ Danbooru.SAFE, Danbooru.QUESTIONABLE, Danbooru.EXPLICIT ])
      case 'YAOI':
        return this._getPost('yaoi', [ Danbooru.SAFE, Danbooru.QUESTIONABLE, Danbooru.EXPLICIT ])
      case 'TRAP':
        return this._getPost('trap', [ Danbooru.SAFE, Danbooru.QUESTIONABLE, Danbooru.EXPLICIT ], true)
      default:
        return null
    }
  }
}

Danbooru.SAFE = 's'
Danbooru.QUESTIONABLE = 'q'
Danbooru.EXPLICIT = 'e'

module.exports = Danbooru
