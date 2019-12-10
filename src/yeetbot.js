const dogstatsd = require('./dogstatsd')

class YeetBot {
  wrap (fn, type = 'NONE', data) {
    return (req, res, type) => {
      const bot = this._detectBot(req)
      if (bot) {
        dogstatsd.increment(`weeb.services.bots.${bot}`)
        if (type === 'DISCORD') return this._answerDiscord(data, res)
        return res.sendStatus(404)
      }
      return fn(req, res, type)
    }
  }

  _detectBot (req) {
    if (!req.get('user-agent')) return null
    return Object.keys(YeetBot.UserAgents).find(
      agents => YeetBot.UserAgents[agents].find(ua => req.get('user-agent').includes(ua))
    )
  }

  _answerDiscord (invite, res) {
    // @todo
    res.sendStatus(404)
  }
}

YeetBot.UserAgents = {
  discord: [ 'https://discordapp.com' ],
  telegram: [ 'TelegramBot' ],
  twitter: [ 'TwitterBot' ],
  facebook: [ 'Facebot', 'facebookexternalhit/' ]
}
module.exports = new YeetBot()
