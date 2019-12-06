const fetch = require('node-fetch')
const Provider = require('./provider')

class Konachan extends Provider {
  constructor () {
    super([
      'SENKO', 'KANNA', 'YURI', 'LOLI',
      'THIGH', 'THIGH_NSFW',
      'NEKO', 'NEKO_NSFW',
      'MAID', 'MAID_NSFW'
    ])
  }

  provide (type) {
    switch (type) {
      case 'SENKO':
        return this._getPost('senko', [ Konachan.SAFE ])
      case 'KANNA':
        return this._getPost('kanna_kamui', [ Konachan.SAFE ])
      case 'YURI':
        return this._getPost('yuri', [ Konachan.SAFE, Konachan.QUESTIONABLE, Konachan.EXPLICIT ])
      case 'LOLI':
        return this._getPost('loli', [ Konachan.SAFE ])
      case 'THIGH':
        return this._getPost('thighhighs', [ Konachan.SAFE ])
      case 'THIGH_NSFW':
        return this._getPost('thighhighs', [ Konachan.QUESTIONABLE, Konachan.EXPLICIT ])
      case 'NEKO':
        return this._getPost('cat', [ Konachan.SAFE ])
      case 'NEKO_NSFW':
        return this._getPost('cat', [ Konachan.QUESTIONABLE, Konachan.EXPLICIT ])
      case 'MAID':
        return this._getPost('maid', [ Konachan.SAFE ])
      case 'MAID_NSFW':
        return this._getPost('maid', [ Konachan.QUESTIONABLE, Konachan.EXPLICIT ])
      default:
        return null
    }
  }

  async _getPost (tag, ratings) {
    const allPosts = await fetch(`https://konachan.com/post.json?tags=${tag}&limit=500`).then(res => res.json())
    const posts = allPosts.filter(post => ratings.includes(post.rating) && !post.tags.split(' ').includes('trap'))
    const post = posts[Math.floor(Math.random() * posts.length)]
    return [
      post.file_url.split('.').pop(),
      await fetch(post.file_url)
    ]
  }
}

Konachan.SAFE = 's'
Konachan.QUESTIONABLE = 'q'
Konachan.EXPLICIT = 'e'

module.exports = Konachan
