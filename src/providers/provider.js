class Provider {
  constructor (features) {
    this.features = features
  }

  canProvide (feature) {
    return this.features.includes(feature)
  }
}

module.exports = Provider
