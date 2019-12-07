const Konachan = require('./konachan')
const Danbooru = require('./danbooru')
const Yandere = require('./yandere')
const NekosLife = require('./nekoslife')
const errors = require('../error')
const dogstatsd = require('../dogstatsd')

class Providers {
  constructor () {
    this.providers = [
      new Konachan(),
      new Danbooru(),
      new Yandere(),
      new NekosLife()
      // @todo: nekobot.xyz
      // @todo: gelbooru
      // @todo: rule34.xxx
      // @todo: reddit (r/Animemes)
    ]
  }

  async provide (req, res, type) {
    if (req.get('user-agent') && req.get('user-agent').includes('discordapp.com')) {
      return res.sendStatus(404)
    }

    const provider = this._getProvider(type)
    if (!provider) return errors['404'](req, res)

    const data = await provider.provide(type)
    if (!data) return errors['404'](req, res)

    dogstatsd.increment(`weeb.services.provider.${type.replace('_', '.').toLowerCase()}`)
    res.type(`image/${data[0]}`)
    data[1].body.pipe(res)
  }

  _getProvider (type) {
    const available = this.providers.filter(p => p.canProvide(type))
    return available[Math.floor(Math.random() * available.length)]
  }
}

module.exports = Providers
