const express = require('express')
const Providers = require('./providers')

const providers = new Providers()
const app = express()

app.get('/robots.txt', (req, res) => res.type('text/plain').send('User-agent: *\nDisallow: /'))

app.get('/maid', (req, res) => providers.provide(req, res, 'MAID'))
app.get('/maid/kinky', (req, res) => providers.provide(req, res, 'MAID_NSFW'))

app.listen(1539)
