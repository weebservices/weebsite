const fetch = require('node-fetch')
const Provider = require('./provider')

class Yandere extends Provider {
  constructor () {
    super([
      'SENKO', 'KANNA', 'YURI',
      'BDSM',
      'THIGH', 'THIGH_NSFW',
      'NEKO', 'NEKO_NSFW',
      'MAID', 'MAID_NSFW'
    ])
  }

  provide (type) {
    switch (type) {
      case 'SENKO':
        return this._getPost('senko-san', [ Yandere.SAFE ])
      case 'KANNA':
        return this._getPost('kanna_kamui', [ Yandere.SAFE ])
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
      default:
        return null
    }
  }

  async _getPost (tag, ratings) {
    const allPosts = await fetch(`https://yande.re/post.json?tags=${tag}&limit=500`).then(res => res.json())
    const posts = allPosts.filter(post => ratings.includes(post.rating) && !post.tags.split(' ').includes('trap'))
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
