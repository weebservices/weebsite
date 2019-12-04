const fetch = require('node-fetch')
const Provider = require('./provider')

class Yandere extends Provider {
  constructor () {
    super([
      'SENKO', 'YURI',
      'KANNA', 'KANNA_NSFW',
      'MAID', 'MAID_NSFW',
      'LOLI', 'LOLI_NSFW'
    ])
  }

  provideSenko () {
    return this._getPost('senko-san', [ Yandere.SAFE ])
  }

  provideYuri () {
    return this._getPost('yuri', [ Yandere.SAFE, Yandere.QUESTIONABLE, Yandere.EXPLICIT ])
  }

  provideKanna () {
    return this._getPost('kanna_kamui', [ Yandere.SAFE ])
  }

  provideKannaNsfw () {
    return this._getPost('kanna_kamui', [ Yandere.QUESTIONABLE, Yandere.EXPLICIT ])
  }

  provideMaid () {
    return this._getPost('maid', [ Yandere.SAFE ])
  }

  provideMaidNsfw () {
    return this._getPost('maid', [ Yandere.QUESTIONABLE, Yandere.EXPLICIT ])
  }

  provideLoli () {
    return this._getPost('loli', [ Yandere.SAFE ])
  }

  provideLoliNsfw () {
    return this._getPost('loli', [ Yandere.QUESTIONABLE, Yandere.EXPLICIT ])
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
