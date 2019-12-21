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
const { createReadStream } = require('fs')
const providers = require('../providers')
const { http, dogstatsd } = require('../utils')
const heCared = join(__dirname, '..', 'assets', 'even-he-cared.png')

const provider = (type) => (req, res) => providers.provide(req, res, type)

const basicService = (type, hasKinky) => {
  const service = { '/': provider(type) }
  if (hasKinky) service['/kinky'] = provider(`${type}_NSFW`)
  return service
}

const services = {
  weeb: {
    '/': (req, res) => {
      http.html(res, 'homepage.html')
      dogstatsd.increment('weeb.services.home.view')
    },
    '/discord': http.wrapDiscord('4KhX4SY', 'weeb.services.invite.discord'),
    '/github': (req, res) => http.redirect(res, 'https://github.com/Bowser65/weeb.services'),
    '/license': (req, res) => http.redirect(res, 'https://github.com/Bowser65/weeb.services/blob/master/LICENSE'),
    '/canistealthis': (req, res) => http.redirect(res, 'https://github.com/Bowser65/weeb.services/blob/master/LICENSE'),
    '/isemmacute': (req, res) => {
      http.html(res, 'emma.html')
      dogstatsd.increment('weeb.services.emma.view')
    }
  },
  senko: {
    '/': provider('SENKO'),
    '/lair': http.wrapDiscord('UrHhtWE', 'weeb.services.invite.custom.lair')
  },
  kanna: basicService('KANNA'),
  yuri: basicService('YURI'),
  bdsm: {
    '/': provider('BDSM'),
    '/tied': provider('TIED')
  },
  thigh: basicService('THIGH', true),
  neko: basicService('NEKO', true),
  maid: basicService('MAID', true),
  memes: basicService('ANIME_MEMES'),
  futa: basicService('FUTA'),
  femdom: basicService('FEMDOM'),
  trap: basicService('TRAP'),
  tentacle: basicService('TENTACLE'),
  yaoi: basicService('YAOI'),
  handholding: basicService('HANDHOLDING'),
  yiff: {
    '/': http.wrapYeetBots(
      (req, res) => {
        res.setHeader('content-type', 'image/png')
        createReadStream(heCared).pipe(res)
      }
    )
  }
}

const aliases = {
  lesbian: 'yuri'
}

module.exports = {
  services, aliases
}
