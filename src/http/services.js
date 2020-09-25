/*
 * Copyright (c) 2020 Weeb Services
 * Licensed under the Open Software License version 3.0
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
    '/discord': http.wrapDiscord('4KhX4SY', 'Official Discord server for weeb.services', 'weeb.services.invite.discord'),
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
    '/lair': http.wrapDiscord('UrHhtWE', 'The safe haven where Senko and Senkists live', 'weeb.services.invite.custom.lair')
  },
  kanna: basicService('KANNA'),
  tohru: basicService('TOHRU'),
  yuri: basicService('YURI'),
  bdsm: {
    '/': provider('BDSM'),
    '/tied': provider('TIED')
  },
  thigh: basicService('THIGH', true),
  neko: basicService('NEKO', true),
  maid: basicService('MAID', true),
  handholding: basicService('HANDHOLDING', true),
  memes: basicService('ANIME_MEMES'),
  futa: basicService('FUTA'),
  femdom: basicService('FEMDOM'),
  feet: basicService('FEET'),
  tentacle: basicService('TENTACLE'),
  yaoi: basicService('YAOI'),
  trap: basicService('TRAP'),
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
  www: 'weeb',
  lesbian: 'yuri',
  wishmeluck: 'random',
  showmetheworstofhumanity: 'trap'
}

module.exports = {
  services, aliases
}
