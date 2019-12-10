const { join } = require('path')
const { createReadStream } = require('fs')
const express = require('express')
const hook = require('./hooks/discord')
const Provider = require('./providers/provider')
const subscriptions = require('./subscriptions')
const providers = require('./providers')
const dogstatsd = require('./dogstatsd')
const database = require('./db')
const errors = require('./error')
const yeetbot = require('./yeetbot')

const heCared = join(__dirname, '..', 'assets', 'even-he-cared.png')
const app = express()

const services = {
  weeb: {
    '/': (req, res) => {
      res.send("<body style='margin: 0;'><iframe width='100%' height='100%' src='https://www.youtube.com/embed/OnMPFBZfJew' frameBorder='0' allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture' allowFullScreen/></body>")
      dogstatsd.increment('weeb.services.home.view')
    },
    '/discord': yeetbot.wrap(
      (req, res) => {
        dogstatsd.increment('weeb.services.invite.discord')
        res.redirect('https://discord.gg/4KhX4SY')
      }, 'DISCORD', '4KhX4SY'
    ),
    '/github': (req, res) => res.redirect('https://github.com/Bowser65/weeb.services'),
    '/license': (req, res) => res.redirect('https://github.com/Bowser65/weeb.services/blob/master/LICENSE'),
    '/canistealthis': (req, res) => res.redirect('https://github.com/Bowser65/weeb.services/blob/master/LICENSE'),
    '/isemmacute': (req, res) => {
      res.type('text/html')
      createReadStream(join(__dirname, '..', 'views', 'emma.html')).pipe(res)
      dogstatsd.increment('weeb.services.emma.view')
    }
  },
  senko: {
    '/': (req, res) => providers.provide(req, res, 'SENKO'),
    '/lair': yeetbot.wrap(
      (req, res) => {
        dogstatsd.increment('weeb.services.invite.discord')
        res.redirect('https://discord.gg/UrHhtWE')
      }, 'DISCORD', 'UrHhtWE'
    )
  },
  kanna: {
    '/': (req, res) => providers.provide(req, res, 'KANNA')
  },
  yuri: {
    '/': (req, res) => providers.provide(req, res, 'YURI')
  },
  bondage: {
    // '/': (req, res) => providers.provide(req, res, 'BONDAGE'),
    '/tied': (req, res) => providers.provide(req, res, 'TIED')
  },
  thigh: {
    '/': (req, res) => providers.provide(req, res, 'THIGH'),
    '/kinky': (req, res) => providers.provide(req, res, 'THIGH_NSFW')
  },
  neko: {
    '/': (req, res) => providers.provide(req, res, 'NEKO'),
    '/kinky': (req, res) => providers.provide(req, res, 'NEKO_NSFW')
  },
  maid: {
    '/': (req, res) => providers.provide(req, res, 'MAID'),
    '/kinky': (req, res) => providers.provide(req, res, 'MAID_NSFW')
  },
  memes: {
    '/': (req, res) => providers.provide(req, res, 'ANIME_MEMES')
  },
  yiff: {
    '/': yeetbot.wrap(
      (req, res) => {
        res.type('image/png')
        createReadStream(heCared).pipe(res)
      }
    )
  }
}

const aliases = {
  lesbian: 'yuri'
}

app.use(express.json())
app.use((req, res, next) => {
  const host = req.get('host')
  if (!host) return errors['404'](req, res)

  req.sub = host.split('.').shift()
  if (aliases[req.sub]) req.sub = aliases[req.sub]
  next()
})

app.use('/assets', express.static(join(__dirname, '..', 'assets')))
app.get('/subscriptions', (req, res) => {
  res.type('text/html')
  createReadStream(join(__dirname, '..', 'views', 'subscriptions.html')).pipe(res)
  dogstatsd.increment('weeb.services.subscriptions.view')
})
app.post('/subscriptions', subscriptions.post)
app.delete('/subscriptions', subscriptions.del)

app.get('/providers', (req, res) => res.json({ available: Provider.available, nsfw: Provider.nsfw }))
app.get('/can/i/have/weeb/material/in/my/discord/server', (req, res) => res.redirect('/subscriptions'))

app.get('**', (req, res) => {
  if (req.sub === 'localhost:1539') {
    const path = req.path.split('/')
    let sub = 'weeb'
    if (path[1] && services[path[1]]) {
      [ , sub ] = path
      delete path[1]
    } else if (path[1] && aliases[path[1]]) {
      sub = aliases[path[1]]
      delete path[1]
    }
    const service = services[sub]
    const target = path.join('/')
    if (!service[target]) {
      return errors['404'](req, res)
    }
    service[target](req, res)
  } else {
    const service = services[req.sub]
    if (!service || !service[req.path]) {
      return errors['404'](req, res)
    }
    service[req.path](req, res)
  }
})

app.use((err, req, res, _) => { // eslint-disable-line no-unused-vars
  console.error(err)
  return errors['5xx'](req, res)
})

; (async () => {
  await database.initialize()
  hook.schedule()
  app.listen(1539)
})()
