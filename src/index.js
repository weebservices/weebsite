/*
 * Copyright (c) 2020 Weeb Services
 * Licensed under the Open Software License version 3.0
 */

const http = require('http')
const hook = require('./hooks/discord')
const database = require('./db')
const { errors } = require('./utils')
const globalEndpoints = require('./http/global')
const { services, aliases } = require('./http/services')

;(async () => {
  await database.initialize()
  hook.schedule()

  const server = http.createServer()

  server.on('listening', () => {
    console.log('Ready to serve soviet union')
  })

  server.on('request', async (req, res) => {
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

        req.url = `/${path.filter(Boolean).join('/')}`
      }
      // eslint-disable-next-line prefer-destructuring
      req.url = req.url.split('?')[0].split('#')[0]
      if (aliases[subdomain]) subdomain = aliases[subdomain]

      // Global services
      if (globalEndpoints[req.url]) {
        return globalEndpoints[req.url](req, res)
      }

      // Specific services
      if (req.method !== 'GET') {
        return errors['404'](req, res)
      }
      console.log(subdomain, req.url)
      const service = services[subdomain]
      if (!service || !service[req.url]) {
        return errors['404'](req, res)
      }
      service[req.url](req, res)
    } catch (e) {
      console.error(e)
      return errors['5xx'](req, res)
    }
  })

  server.listen(1539)
})()
