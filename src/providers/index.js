const Konachan = require('./konachan')
const Danbooru = require('./danbooru')
const Yandere = require('./yandere')
const NekosLife = require('./nekoslife')
const Reddit = require('./reddit')
const errors = require('../error')
const dogstatsd = require('../dogstatsd')

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
  }

  async provide (req, res, type) {
    if (req.get('user-agent') && req.get('user-agent').includes('discordapp.com')) {
      return res.sendStatus(404)
    }

    const data = await this.provideStream(type)
    if (!data) return errors['404'](req, res)

    dogstatsd.increment('weeb.services.providers.all')
    dogstatsd.increment(`weeb.services.provider.${type.replace('_', '.').toLowerCase()}`)
    res.type(`image/${data[0]}`)
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
