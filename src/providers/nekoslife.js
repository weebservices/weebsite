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
