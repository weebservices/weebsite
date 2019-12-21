class Provider {
  constructor (features) {
    this.features = features
  }

  canProvide (feature) {
    return this.features.includes(feature)
  }
}

Provider.available = [
  'SENKO', 'KANNA', 'YURI',
  'BDSM', 'TIED',
  'THIGH', 'THIGH_NSFW',
  'NEKO', 'NEKO_NSFW',
  'MAID', 'MAID_NSFW',
  'ANIME_MEMES',
  'FUTA', 'FEMDOM', 'TRAP',
  'TENTACLE', 'YAOI'
]
Provider.nsfw = [
  'YURI', 'BONDAGE', 'TIED', 'THIGH_NSFW', 'NEKO_NSFW', 'MAID_NSFW',
  'FUTA', 'FEMDOM', 'TRAP', 'TENTACLE', 'YAOI'
]
module.exports = Provider
