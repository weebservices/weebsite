/*
 * Copyright (c) 2020 Weeb Services
 * Licensed under the Open Software License version 3.0
 */

const Provider = require('../providers/provider')
const subDiscord = require('./subscriptions/discord')
const { http, errors, dogstatsd } = require('../utils')

module.exports = {
  '/robots.txt': (req, res) => res.end('User-agent: *\nDisallow: /'),
  '/subscriptions/telegram': (req, res) => {
    res.end('soon')
  },
  '/subscriptions/discord': (req, res) => {
    switch (req.method) {
      case 'GET':
        http.html(res, 'subscriptions/discord.html')
        dogstatsd.increment('weeb.services.subscriptions.view')
        dogstatsd.increment('weeb.services.subscriptions.discord.view')
        break
      case 'POST':
        subDiscord.post(req, res)
        break
      case 'DELETE':
        subDiscord.del(req, res)
        break
      default:
        errors['405'](req, res)
    }
  },
  '/providers': (req, res) => {
    if (req.method !== 'GET') {
      return errors['405'](req, res)
    }
    http.json(res, { available: Provider.available, nsfw: Provider.nsfw })
  },
  '/can/i/have/weeb/material/in/my/discord/server': (req, res) => {
    http.redirect(res, '/subscriptions/discord')
  },
  '/can/i/have/weeb/material/on/telegram': (req, res) => {
    http.redirect(res, '/subscriptions/telegram')
  }
}
