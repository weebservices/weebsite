/**
 * A random image service for weebs because weebs are superior
 * Copyright (C) 2019 Weeb Services
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
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
