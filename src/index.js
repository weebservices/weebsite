const express = require('express')
const Providers = require('./providers')

const providers = new Providers()
const app = express()

app.use((req, res, next) => {
  if (req.get('user-agent') && req.get('user-agent').includes('discordapp.com')) {
    return res.sendStatus(200)
  }
  next()
})

app.get('/maid', (req, res) => providers.provide(req, res, 'MAID'))
app.get('/maid/kinky', (req, res) => providers.provide(req, res, 'MAID_NSFW'))

app.listen(1539)
