const { join } = require('path')
const { readFileSync } = require('fs')
const fetch = require('node-fetch')
const dogstatsd = require('./dogstatsd')

class YeetBot {
  wrap (fn, type = 'NONE', data) {
    return (req, res, t) => {
      const bot = this._detectBot(req)
      if (bot) {
        dogstatsd.increment(`weeb.services.bots.${bot}`)
        if (type === 'DISCORD') return this._answerDiscord(data, res)
        return res.sendStatus(404)
      }
      return fn(req, res, t)
    }
  }

  _detectBot (req) {
    if (!req.get('user-agent')) return null
    return Object.keys(YeetBot.UserAgents).find(
      agents => YeetBot.UserAgents[agents].find(ua => req.get('user-agent').includes(ua))
    )
  }

  async _answerDiscord (invite, res) {
    const data = await fetch(`https://discordapp.com/api/v6/invites/${invite}?with_counts=true`)
      .then(res => res.json())
      .catch(_ => null)
    if (data) {
      let img, card
      if (data.guild.features.includes('INVITE_SPLASH') && data.guild.splash) {
        card = 'summary_large_image'
        img = `https://cdn.discordapp.com/splashes/${data.guild.id}/${data.guild.splash}.jpg?size=1024`
      } else {
        card = 'summary'
        if (data.guild.icon) {
          img = `https://cdn.discordapp.com/icons/${data.guild.id}/${data.guild.icon}.png?size=128`
        } else {
          img = 'https://cdn.discordapp.com/embed/avatars/0.png'
        }
      }

      res.type('text/html')
      return res.send(
        readFileSync(join(__dirname, '..', 'views', 'subscriptions.html'), 'utf8')
          .replace('{card}', card)
          .replace('{image}', img)
          .replace('{server}', data.guild.name)
          .replace('{online}', data.approximate_presence_count)
          .replace('{members}', data.approximate_member_count)
      )
    }
    res.sendStatus(404)
  }
}

YeetBot.UserAgents = {
  discord: [ 'https://discordapp.com' ],
  telegram: [ 'TelegramBot' ],
  twitter: [ 'TwitterBot' ],
  facebook: [ 'Facebot', 'facebookexternalhit/' ],
  keybase: [ 'Keybase' ],
  skype: [ 'SkypeUriPreview' ],
  reddit: [ 'redditbot/' ]
}
module.exports = new YeetBot()
