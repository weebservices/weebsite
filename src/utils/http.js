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

const { join } = require('path')
const { readFileSync } = require('fs')
const fetch = require('node-fetch')
const errors = require('./errors')
const dogstatsd = require('./dogstatsd')

class Http {
  redirect (res, path) {
    res.writeHead(302, { location: path })
    res.end()
  }

  json (res, data) {
    res.setHeader('content-type', 'application/json')
    res.end(JSON.stringify(data))
  }

  html (res, file) {
    res.setHeader('content-type', 'text/html')
    res.end(readFileSync(join(__dirname, '../../views', file), 'utf8').split('\n').slice(17).join('\n'))
  }

  wrapYeetBots (fn) {
    return (req, res, t) => {
      const bot = this._detectBot(req)
      if (bot) {
        dogstatsd.increment(`weeb.services.bots.${bot}`)
        res.writeHead(404)
        return res.end()
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
    const reqUa = req.headers['user-agent']
    if (!reqUa) return null
    return Object.keys(Http.UserAgents).find(
      agents => Http.UserAgents[agents].find(ua => reqUa.includes(ua))
    )
  }

  async _answerDiscord (invite, res) {
    const data = await fetch(`https://discordapp.com/api/v6/invites/${invite}?with_counts=true`)
      .then(res => res.json())
      .catch(_ => null)
    if (data) {
      let img, card
      if (data.guild.features.includes('BANNER') && data.guild.banner) {
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

      res.setHeader('content-type', 'text/html')
      return res.end(
        readFileSync(join(__dirname, '..', 'views', 'invite_embed.html'), 'utf8')
          .replace(/{card}/g, card)
          .replace(/{image}/g, img)
          .replace(/{server}/g, data.guild.name)
          .replace(/{online}/g, data.approximate_presence_count)
          .replace(/{members}/g, data.approximate_member_count)
      )
    }
    res.writeHead(404)
  }
}

Http.UserAgents = {
  discord: [ 'https://discordapp.com' ],
  telegram: [ 'TelegramBot' ],
  twitter: [ 'TwitterBot' ],
  facebook: [ 'Facebot', 'facebookexternalhit/' ],
  keybase: [ 'Keybase' ],
  skype: [ 'SkypeUriPreview' ],
  reddit: [ 'redditbot/' ]
}
module.exports = new Http()
