/*
 * Copyright (c) 2020 Weeb Services
 * Licensed under the Open Software License version 3.0
 */

const { join } = require('path')
const { createReadStream } = require('fs')
const dogstatsd = require('./dogstatsd')

const asset404 = join(__dirname, '../../assets', 'not-found.png')
const asset405 = join(__dirname, '../../assets', 'method-not-allowed.png')
const asset5xx = join(__dirname, '../../assets', 'error.gif')

module.exports = {
  404: (req, res) => {
    res.setHeader('content-type', 'image/png')
    res.writeHead(404)
    createReadStream(asset404).pipe(res)
    dogstatsd.increment('weeb.services.error.404')
  },
  405: (req, res) => {
    res.setHeader('content-type', 'image/png')
    res.writeHead(405)
    createReadStream(asset405).pipe(res)
    dogstatsd.increment('weeb.services.error.405')
  },
  '5xx': (req, res, err = 500) => {
    res.setHeader('content-type', 'image/gif') // btw gif is pronounced /ɡɪf/
    res.writeHead(err)
    createReadStream(asset5xx).pipe(res)
    dogstatsd.increment('weeb.services.error.5xx')
  }
}
