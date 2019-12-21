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

class Reddit extends Provider {
  constructor () {
    super([
      'YURI', 'BDSM', 'THIGH_NSFW',
      'MAID_NSFW', 'ANIME_MEMES',
      'FUTA', 'FEMDOM', 'TRAP',
      'TENTACLE', 'YAOI',
      'HANDHOLDING'
    ])
  }

  provide (type) {
    switch (type) {
      case 'YURI':
        return this._getPost('yuri', true)
      case 'BDSM':
        return this._getPost([ 'hentaibondage', 'HookedUpHentai', 'HardcodeHentaiBondage' ], true)
      case 'THIGH_NSFW':
        return this._getPost([ 'thighdeology', 'thighhighhentai' ], true)
      case 'MAID_NSFW':
        return this._getPost([ 'MaidHentai', 'HentaiMaid' ], true)
      case 'ANIME_MEMES':
        return this._getPost('animemes', false)
      case 'FUTA':
        return this._getPost([ 'FutaCum', 'futanari', 'futanari_comics', 'FutanariPegging' ], true)
      case 'FEMDOM':
        return this._getPost('hentaifemdom', true)
      case 'TRAP':
        return this._getPost([ 'traphentai', 'DeliciousTraps' ], true)
      case 'TENTACLE':
        return this._getPost([ 'consentacles', 'Tentai' ], true)
      case 'YAOI':
        return this._getPost('yaoi', true)
      case 'HANDHOLDING':
        return this._getPost('handholding', true) // r/handholding is marked nsfw but doesn't have anything nsfw
      default:
        return null
    }
  }

  async _getPost (sub, acceptNsfw) {
    if (Array.isArray(sub)) {
      sub = sub[Math.floor(Math.random() * sub.length)]
    }
    const hot = await fetch(`https://www.reddit.com/r/${sub}/hot.json?limit=100`, {
      headers: {
        'User-Agent': 'NodeJS:weeb.services:v0.0.1 (by /u/Bowser65) - https://weeb.services/github, bowoser@weeb.services'
      }
    }).then(res => res.json())
    const posts = hot.data.children.map(p => p.data).filter(post => (!post.over_18 || acceptNsfw) && post.post_hint === 'image')
    const post = posts[Math.floor(Math.random() * posts.length)]
    return [
      post.url.split('.').pop(),
      await fetch(post.url)
    ]
  }
}

module.exports = Reddit
