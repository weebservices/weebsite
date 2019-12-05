const fetch = require('node-fetch')
const Provider = require('./provider')

class Konachan extends Provider {
  constructor () {
    super([
      'SENKO', 'YURI', 'LOLI', 'KANNA',
      'THIGH', 'THIGH_NSFW',
      'NEKO', 'NEKO_NSFW',
      'MAID', 'MAID_NSFW'
    ])
  }

  provideSenko () {
    return this._getPost('senko', [ Konachan.SAFE ])
  }

  provideYuri () {
    return this._getPost('yuri', [ Konachan.SAFE, Konachan.QUESTIONABLE, Konachan.EXPLICIT ])
  }

  provideKanna () {
    return this._getPost('kanna_kamui', [ Konachan.SAFE ])
  }

  provideThigh () {
    return this._getPost('thighhighs', [ Konachan.SAFE ])
  }

  provideThighNsfw () {
    return this._getPost('thighhighs', [ Konachan.QUESTIONABLE, Konachan.EXPLICIT ])
  }

  provideNeko () {
    return this._getPost('cat', [ Konachan.SAFE ])
  }

  provideNekoNsfw () {
    return this._getPost('cat', [ Konachan.QUESTIONABLE, Konachan.EXPLICIT ])
  }

  provideMaid () {
    return this._getPost('maid', [ Konachan.SAFE ])
  }

  provideMaidNsfw () {
    return this._getPost('maid', [ Konachan.QUESTIONABLE, Konachan.EXPLICIT ])
  }

  provideLoli () {
    return this._getPost('loli', [ Konachan.SAFE ])
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
