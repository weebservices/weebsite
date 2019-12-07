const fetch = require('node-fetch')
const Provider = require('./provider')

class Reddit extends Provider {
  constructor () {
    super([
      'THIGH_NSFW', 'ANIME_MEMES'
    ])
  }

  provide (type) {
    const thighSubs = [ 'thighdeology', 'thighhighhentai' ]
    switch (type) {
      case 'THIGH_NSFW':
        return this._getPost(thighSubs[Math.floor(Math.random() * thighSubs.length)], true)
      case 'ANIME_MEMES':
        return this._getPost('animemes', false)
      default:
        return null
    }
  }

  async _getPost (sub, acceptNsfw) {
    const hot = await fetch(`https://www.reddit.com/r/${sub}/hot.json?limit=100`, {
      headers: {
        'User-Agent': 'NodeJS:weeb.services:v0.0.1 (by /u/Bowser65) - https://weeb.services/github'
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
