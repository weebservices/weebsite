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

const Konachan = require('./konachan')
const Danbooru = require('./danbooru')
const Yandere = require('./yandere')
const NekosLife = require('./nekoslife')
const Reddit = require('./reddit')
const Provider = require('./provider')
const errors = require('../utils/errors')
const dogstatsd = require('../utils/dogstatsd')
const yeetbot = require('../utils/http')

class Providers {
  constructor () {
    this.providers = [
      new Konachan(),
      new Danbooru(),
      new Yandere(),
      new NekosLife(),
      new Reddit()
      // @todo: nekobot.xyz
      // @todo: gelbooru
      // @todo: rule34.xxx
    ]

    this.provide = yeetbot.wrapYeetBots(this._provide.bind(this))
  }

  async _provide (req, res, type) {
    const data = await this.provideStream(type)
    if (!data) return errors['404'](req, res)

    if (Provider.nsfw.includes(type)) {
      dogstatsd.increment('weeb.services.providers.nsfw')
    } else {
      dogstatsd.increment('weeb.services.providers.sfw')
    }
    dogstatsd.increment(`weeb.services.provider.${type.replace('_', '.').toLowerCase()}`)
    res.setHeader('content-type', `image/${data[0]}`)
    data[1].body.pipe(res)
  }

  provideStream (type) {
    const provider = this._getProvider(type)
    if (!provider) return null
    return provider.provide(type)
  }

  _getProvider (type) {
    const available = this.providers.filter(p => p.canProvide(type))
    return available[Math.floor(Math.random() * available.length)]
  }
}

module.exports = new Providers()
