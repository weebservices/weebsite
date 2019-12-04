const Konachan = require('./konachan')

class Providers {
  constructor () {
    this.providers = [
      new Konachan()
    ]
  }

  async provide (req, res, type) {
    const provider = this._getProvider(type)
    if (!provider) return res.sendStatus(404)
    const method = this._typeToMethod(type)
    const [ extension, stream ] = await provider[method]()
    res.type(`image/${extension}`)
    stream.body.pipe(res)
  }

  _getProvider (type) {
    const available = this.providers.filter(p => p.canProvide(type))
    return available[Math.floor(Math.random() * available.length)]
  }

  _typeToMethod (type) {
    return `provide${type.split('_').map(t => t[0] + t.substring(1).toLowerCase()).join('')}`
  }
}

module.exports = Providers
