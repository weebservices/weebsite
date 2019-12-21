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

const Provider = require('../providers/provider')
const subDiscord = require('./subscriptions/discord')
const { http, errors, dogstatsd } = require('../utils')

module.exports = {
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
