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

app.get('/senko', (req, res) => providers.provide(req, res, 'SENKO'))
app.get('/senko/lair', (req, res) => res.redirect('https://discord.gg/UrHhtWE'))

app.get('/yuri', (req, res) => providers.provide(req, res, 'YURI'))

app.get('/kanna', (req, res) => providers.provide(req, res, 'KANNA'))
app.get('/kanna/kinky', (req, res) => providers.provide(req, res, 'KANNA_NSFW'))

app.get('/maid', (req, res) => providers.provide(req, res, 'MAID'))
app.get('/maid/kinky', (req, res) => providers.provide(req, res, 'MAID_NSFW'))

app.get('/loli', (req, res) => providers.provide(req, res, 'LOLI'))
app.get('/loli/kinky', (req, res) => providers.provide(req, res, 'LOLI_NSFW'))

app.listen(1539)
