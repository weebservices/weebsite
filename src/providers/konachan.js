const fetch = require('node-fetch')
const Provider = require('./provider')

class Konachan extends Provider {
  constructor () {
    super([
      'SENKO',
      'MAID', 'MAID_NSFW',
      'LOLI', 'LOLI_NSFW'
    ])
  }

  provideSenko () {
    return this._getPost('senko', [ Konachan.SAFE ])
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

  provideLoliNsfw () {
    return this._getPost('loli', [ Konachan.QUESTIONABLE, Konachan.EXPLICIT ])
  }

  async _getPost (tag, ratings) {
    const allPosts = await fetch(`https://konachan.com/post.json?tags=${tag}&limit=500`).then(res => res.json())
    const posts = allPosts.filter(post => ratings.includes(post.rating))
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
