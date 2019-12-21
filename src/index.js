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

const hook = require('./hooks/discord')
const database = require('./db')
const { errors } = require('./utils')
const globalEndpoints = require('./http/global')
const { services, aliases } = require('./http/services')

;(async () => {
  await database.initialize()
  hook.schedule()

  require('http')
    .createServer(async (req, res) => {
      try {
        // Request body
        if (req.method === 'POST' && req.headers['content-type'] === 'application/json') {
          req.body = await new Promise(resolve => {
            let data = ''
            req.on('data', chunk => (data += chunk))
            req.on('end', () => resolve(JSON.parse(data)))
          })
        }

        // Subdomain
        const { host } = req.headers
        if (!host) return errors['404'](req, res)

        let subdomain = host.split('.').shift()
        if (host.startsWith('localhost') || host.includes('ngrok.io')) {
          const path = req.url.split('/')
          if (path[1] && services[path[1]]) {
            [ , subdomain ] = path
            delete path[1]
          } else if (path[1] && aliases[path[1]]) {
            subdomain = aliases[path[1]]
            delete path[1]
          } else {
            subdomain = 'weeb'
          }
          req.url = path.join('/')
        }
        if (aliases[subdomain]) subdomain = aliases[subdomain]

        // Global services
        if (globalEndpoints[req.url]) {
          return globalEndpoints[req.url](req, res)
        }

        // Specific services
        if (req.method !== 'GET') {
          return errors['404'](req, res)
        }
        const service = services[subdomain]
        if (!service || !service[req.url]) {
          return errors['404'](req, res)
        }
        service[req.url](req, res)
      } catch (err) {
        console.error(err)
        return errors['5xx'](req, res)
      }
    }).listen(1539)
})()
