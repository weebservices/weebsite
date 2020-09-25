/*
 * Copyright (c) 2020 Weeb Services
 * Licensed under the Open Software License version 3.0
 */

class Provider {
  constructor (features) {
    this.features = features
  }

  canProvide (feature) {
    return this.features.includes(feature)
  }
}

Provider.available = [
  'SENKO', 'KANNA', 'TOHRU',
  'YURI', 'BDSM', 'TIED',
  'THIGH', 'THIGH_NSFW',
  'NEKO', 'NEKO_NSFW',
  'MAID', 'MAID_NSFW',
  'HANDHOLDING', 'HANDHOLDING_NSFW',
  'ANIME_MEMES',
  'FUTA', 'FEMDOM', 'FEET',
  'TENTACLE', 'YAOI',
  'TRAP' // Yes it exists and its a *shame*
]
Provider.nsfw = [
  'YURI', 'BONDAGE', 'TIED', 'THIGH_NSFW', 'NEKO_NSFW', 'MAID_NSFW',
  'HANDHOLDING_NSFW', 'FUTA', 'FEMDOM', 'FEET', 'TENTACLE', 'YAOI',
  'TRAP' // ...
]
// Provider.nsfl = [ 'TRAP' ]
module.exports = Provider
