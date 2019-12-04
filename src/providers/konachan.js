const fetch = require('node-fetch')
const Provider = require('./provider')

class Konachan extends Provider {
  constructor () {
    super([ 'MAID', 'MAID_NSFW' ])
  }

  provideMaid () {
    return this._getMaid([ Konachan.SAFE ])
  }

  provideMaidNsfw () {
    return this._getMaid([ Konachan.QUESTIONABLE, Konachan.EXPLICIT ])
  }

  async _getMaid (ratings) {
    const allMaids = await fetch('https://konachan.com/post.json?tags=maid&limit=500').then(res => res.json())
    const maids = allMaids.filter(maid => ratings.includes(maid.rating))
    const maid = maids[Math.floor(Math.random() * maids.length)]
    return [
      maid.file_url.split('.').pop(),
      await fetch(maid.file_url)
    ]
  }
}

Konachan.SAFE = 's'
Konachan.QUESTIONABLE = 'q'
Konachan.EXPLICIT = 'e'

module.exports = Konachan
