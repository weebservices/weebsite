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

class Yandere extends Provider {
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

  async _getPost (tag, ratings, allowInsanity) {
    const allPosts = await fetch(`https://yande.re/post.json?tags=${tag}&limit=500`).then(res => res.json())
    const posts = allPosts.filter(post =>
      post.file_url && ratings.includes(post.rating) && (allowInsanity || !post.tags.split(' ').includes('trap'))
    )
    const post = posts[Math.floor(Math.random() * posts.length)]
    return [
      post.file_url.split('.').pop(),
      await fetch(post.file_url)
    ]
  }
}

Yandere.SAFE = 's'
Yandere.QUESTIONABLE = 'q'
Yandere.EXPLICIT = 'e'

module.exports = Yandere
