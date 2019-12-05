const express = require('express')
const Providers = require('./providers')

const providers = new Providers()
const app = express()

app.use((req, res, next) => {
  const host = req.get('host')
  if (!host || (req.get('user-agent') && req.get('user-agent').includes('discordapp.com'))) {
    return res.sendStatus(404)
  }
  req.sub = host.split('.').shift()
  next()
})

const services = {
  weeb: {
    '/': (req, res) => res.send("<body style='margin: 0;'><iframe width='100%' height='100%' src='https://www.youtube.com/embed/OnMPFBZfJew' frameBorder='0' allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture' allowFullScreen/></body>")
  },
  yuri: {
    '/': (req, res) => providers.provide(req, res, 'YURI')
  },
  senko: {
    '/': (req, res) => providers.provide(req, res, 'SENKO'),
    '/kinky': (req, res) => providers.provide(req, res, 'SENKO_NSFW'),
    '/lair': (req, res) => res.redirect('https://discord.gg/UrHhtWE')
  },
  kanna: {
    '/': (req, res) => providers.provide(req, res, 'KANNA'),
    '/kinky': (req, res) => providers.provide(req, res, 'KANNA_NSFW')
  },
  maid: {
    '/': (req, res) => providers.provide(req, res, 'MAID'),
    '/kinky': (req, res) => providers.provide(req, res, 'MAID_NSFW')
  },
  thigh: {
    '/': (req, res) => providers.provide(req, res, 'THIGH'),
    '/kinky': (req, res) => providers.provide(req, res, 'THIGH_NSFW')
  },
  neko: {
    '/': (req, res) => providers.provide(req, res, 'NEKO'),
    '/kinky': (req, res) => providers.provide(req, res, 'NEKO_NSFW')
  },
  loli: {
    '/': (req, res) => providers.provide(req, res, 'LOLI'),
    '/kinky': (req, res) => providers.provide(req, res, 'LOLI_NSFW')
  }
}

app.get('**', (req, res) => {
  const service = services[req.sub]
  if (!service || !service[req.path]) {
    return res.sendStatus(404)
  }
  service[req.path](req, res)
})

app.listen(1539)
