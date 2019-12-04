const fetch = require('node-fetch')
const Provider = require('./provider')

class Yandere extends Provider {
  constructor () {
    super([
      'SENKO',
      'MAID', 'MAID_NSFW',
      'LOLI', 'LOLI_NSFW'
    ])
  }

  provideSenko () {
    return this._getPost('senko-san', [ Yandere.SAFE ])
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
    const posts = allPosts.filter(post => ratings.includes(post.rating))
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
