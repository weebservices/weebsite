const { join } = require('path')
const { readFileSync } = require('fs')
const fetch = require('node-fetch')
const errors = require('./error')
const dogstatsd = require('./dogstatsd')

class YeetBot {
  wrap (fn) {
    return (req, res, t) => {
      const bot = this._detectBot(req)
      if (bot) {
        dogstatsd.increment(`weeb.services.bots.${bot}`)
        return res.sendStatus(404)
      }
      return fn(req, res, t)
    }
  }

  wrapDiscord (code, desc, analytic) {
    return (req, res) => {
      const c = typeof code === 'function' ? code(req, res) : code
      if (!c) return errors['404'](req, res)
      const bot = this._detectBot(req)
      if (bot) {
        dogstatsd.increment(`weeb.services.bots.${bot}`)
        return this._answerDiscord(code, res)
      }
      if (analytic) dogstatsd.increment(analytic)
      res.redirect(`https://discord.gg/${c}`)
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
      if (/* data.guild.features.includes('BANNER') && */ data.guild.banner) {
        card = 'summary_large_image'
        img = `https://cdn.discordapp.com/banners/${data.guild.id}/${data.guild.banner}.jpg?size=1024`
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
        readFileSync(join(__dirname, '..', 'views', 'invite_embed.html'), 'utf8')
          .replace(/{card}/g, card)
          .replace(/{image}/g, img)
          .replace(/{server}/g, data.guild.name)
          .replace(/{online}/g, data.approximate_presence_count)
          .replace(/{members}/g, data.approximate_member_count)
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
