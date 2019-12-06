const { join } = require('path')
const { createReadStream } = require('fs')

const asset404 = join(__dirname, '..', 'assets', 'not-found.png')
const asset5xx = join(__dirname, '..', 'assets', '5xx.png')

module.exports = {
  404: (req, res) => {
    res.type('image/png')
    createReadStream(asset404).pipe(res)
  },
  '5xx': (req, res) => {
    res.type('image/gif') // btw gif is pronounced /ɡɪf/
    createReadStream(asset5xx).pipe(res)
  }
}
