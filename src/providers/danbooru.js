/**
 * A random image service for weebs because weebs are superior
 * Copyright (C) 2019 Weeb Services
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
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
      'HANDHOLDING',
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
