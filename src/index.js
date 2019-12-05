const express = require('express')
const Providers = require('./providers')
const Provider = require('./providers/provider')
const subscriptions = require('./subscriptions/http')

const providers = new Providers()
const app = express()

app.use(express.json())
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
    '/': (req, res) => res.send("<body style='margin: 0;'><iframe width='100%' height='100%' src='https://www.youtube.com/embed/OnMPFBZfJew' frameBorder='0' allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture' allowFullScreen/></body>"),
    '/github': (req, res) => res.redirect('https://github.com/Bowser65/weeb.services'),
    '/license': (req, res) => res.redirect('https://github.com/Bowser65/weeb.services/blob/master/LICENSE'),
    '/canistealthis': (req, res) => res.redirect('https://github.com/Bowser65/weeb.services/blob/master/LICENSE'),
    '/isemmacute': (req, res) => res.send('<h1>yes</h1>')
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

app.get('/available', (req, res) => res.json(Provider.available))

app.get('/can/i/have/weeb/material/in/my/discord/server', subscriptions.html)
app.get('/style.css', subscriptions.css)

app.post('/can/i/have/weeb/material/in/my/discord/server', subscriptions.post)
app.delete('/can/i/have/weeb/material/in/my/discord/server', subscriptions.del)

app.get('**', (req, res) => {
  if (req.sub === 'localhost:1539') {
    const path = req.path.split('/')
    let sub = 'weeb'
    if (path[1] && services[path[1]]) {
      [ , sub ] = path
      delete path[1]
    }
    const service = services[sub]
    const target = path.join('/')
    if (!service[target]) {
      return res.sendStatus(404)
    }
    service[target](req, res)
  } else {
    const service = services[req.sub]
    if (!service || !service[req.path]) {
      return res.sendStatus(404)
    }
    service[req.path](req, res)
  }
})

app.listen(1539)
