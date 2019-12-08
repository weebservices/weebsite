const { readdirSync } = require('fs')
const fetch = require('node-fetch')
const FormData = require('form-data')
const database = require('./db')
const providers = require('./providers')
const Provider = require('./providers/provider')
const avatars = readdirSync('assets/avatars')
const hearts = [ '❤️', '💙', '🤎', '💚', '🧡', '💜', '💛' ]

class Hook {
  notifySuccess (hook) {
    const heart = hearts[Math.floor(Math.random() * hearts.length)]
    return this._sendText(hook, `Hello there! Your webhook is now configured and will receive a random image every hour. Have fun! ${heart}`)
  }

  notifyDeletion (hook) {
    return this._sendText(hook, 'This webhook is no longer subscribed to weeb.services and will no longer receive a random image every hour. Sorry to see you go 💔')
  }

  notifyRemoval (id, sig, services, deleted) {
    let text = 'Hi there! Looks like you were subscribed to services that we no longer offer. Here is the list of affected services:\n'
    services.forEach(s => {
      let name = s.split('_').map(e => e !== 'NSFW' && e[0] + e.substring(1).toLowerCase()).filter(Boolean).join(' ')
      if (Provider.nsfw.includes(s)) name += ' (NSFW)'
      text += ` - ${name}\n`
    })
    if (deleted) {
      text += '\nSince you\'re no longer subscribed to anything, we\'ll no longer post anything.'
    } else {
      text += '\nWe\'ve updated your subscriptions, and you\'ll no longer receive those images here.'
    }
    return this._sendText(this._buildUrl(id, sig), text)
  }

  schedule () {
    setInterval(this._hookDelivery.bind(this), 1 * 3600 * 1e3)
  }

  async _hookDelivery () {
    const subscribed = await database.fetchSubscriptions()
    for (const subbed of subscribed) {
      // @todo: stats of failed uploads
      await this._sendImage(this._buildUrl(subbed.id, subbed.signature), JSON.parse(subbed.services))
      await this._sleep(100)
    }
  }

  async _sendImage (hook, subbed) {
    const service = subbed[Math.floor(Math.random() * subbed.length)]
    const payload = this._basePayload(service)
    const data = await providers.provideStream(service)
    if (!data) return
    const form = new FormData()
    form.append('file', await data[1].buffer(), `${payload.username}.${data[0]}`)
    form.append('payload_json', JSON.stringify(payload))
    const res = await fetch(hook, {
      method: 'POST',
      headers: form.getHeaders(),
      body: form.getBuffer()
    })
    return res.ok
  }

  async _sendText (hook, text) {
    const payload = JSON.stringify({
      ...this._basePayload(),
      content: text
    })
    const res = await fetch(hook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload
    })
    return res.ok
  }

  _buildUrl (id, sig) {
    // eslint-disable-next-line no-undef
    return `https://discordapp.com/api/webhooks/${BigInt(id).toString()}/${sig}`
  }

  _basePayload (service) {
    const name = service ? `${service.split('_').reverse().find(p => p !== 'NSFW').toLowerCase()}.weeb.services` : 'weeb.services'
    const avatar = `https://weeb.services/assets/avatars/${avatars[Math.floor(Math.random() * avatars.length)]}`
    return {
      username: name,
      avatar_url: avatar
    }
  }

  _sleep (time) {
    return new Promise(resolve => setTimeout(resolve, time))
  }
}

module.exports = new Hook()
