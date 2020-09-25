/*
 * Copyright (c) 2020 Weeb Services
 * Licensed under the Open Software License version 3.0
 */

const fetch = require('node-fetch')
const Provider = require('./provider')

class Reddit extends Provider {
  constructor () {
    super([
      'YURI', 'BDSM', 'THIGH_NSFW',
      'MAID_NSFW', 'HANDHOLDING',
      'ANIME_MEMES', 'FUTA',
      'FEMDOM', 'TENTACLE', 'YAOI',
      'TRAP' // Sadly...
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
      case 'HANDHOLDING':
        return this._getPost('handholding', true) // r/handholding is marked nsfw but doesn't have anything nsfw
      case 'ANIME_MEMES':
        return this._getPost([ 'animemes', 'goodanimemes' ], false)
      case 'FUTA':
        return this._getPost([ 'FutaCum', 'futanari', 'futanari_comics', 'FutanariPegging' ], true)
      case 'FEMDOM':
        return this._getPost('hentaifemdom', true)
      case 'TENTACLE':
        return this._getPost([ 'consentacles', 'Tentai' ], true)
      case 'YAOI':
        return this._getPost('yaoi', true)
      case 'TRAP':
        return this._getPost([ 'traphentai', 'DeliciousTraps' ], true)
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
