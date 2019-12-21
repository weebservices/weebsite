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

const { join } = require('path')
const { createReadStream } = require('fs')
const dogstatsd = require('./dogstatsd')

const asset404 = join(__dirname, '../../assets', 'not-found.png')
const asset405 = join(__dirname, '../../assets', 'method-not-allowed.png')
const asset5xx = join(__dirname, '../../assets', '5xx.png')

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
