class Provider {
  constructor (features) {
    this.features = features
  }

  canProvide (feature) {
    return this.features.includes(feature)
  }
}

Provider.available = [
  'SENKO', 'KANNA', 'YURI', 'TIED',
  'THIGH', 'THIGH_NSFW',
  'NEKO', 'NEKO_NSFW',
  'MAID', 'MAID_NSFW',
  'ANIME_MEMES'
]
Provider.nsfw = [
  'YURI', 'TIED', 'THIGH_NSFW', 'NEKO_NSFW', 'MAID_NSFW'
]
module.exports = Provider
