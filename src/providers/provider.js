class Provider {
  constructor (features) {
    this.features = features
  }

  canProvide (feature) {
    return this.features.includes(feature)
  }
}

Provider.available = [
  'SENKO', 'YURI', 'LOLI', 'KANNA',
  'THIGH', 'THIGH_NSFW',
  'NEKO', 'NEKO_NSFW',
  'MAID', 'MAID_NSFW'
]
module.exports = Provider
