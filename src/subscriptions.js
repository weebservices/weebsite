const fetch = require('node-fetch')
const { stringify } = require('qs')

const Provider = require('./providers/provider')
const dogstatsd = require('./dogstatsd')
const keys = require('../keys.json')

const dickswordHookRegex = /^https:\/\/(?:canary\.|ptb\.)?discordapp.com\/api\/webhooks\/(\d+)\/(?:[\w-]+)$/
const verifyRecaptcha = async (code) => {
  const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: stringify({
      secret: keys.recaptcha,
      response: code
    })
  }).then(res => res.json())
  return res.success
}

module.exports = {
  post: async (req, res) => {
    dogstatsd.increment('weeb.services.subscriptions.new')
    if (!dickswordHookRegex.test(req.body.url)) {
      dogstatsd.increment('weeb.services.subscriptions.fail')
      dogstatsd.increment('weeb.services.subscriptions.fail.hook')
      return res.json({ type: 'error', content: 'Invalid webhook' })
    }
    if (!Array.isArray(req.body.subTo) || req.body.subTo.length < 1 || req.body.subTo.find(e => !Provider.available.includes(e))) {
      dogstatsd.increment('weeb.services.subscriptions.fail')
      dogstatsd.increment('weeb.services.subscriptions.fail.sub')
      return res.json({ type: 'error', content: 'Invalid subscriptions' })
    }
    const check = await verifyRecaptcha(req.body.recaptchaResponse)
    if (!check) {
      dogstatsd.increment('weeb.services.subscriptions.fail')
      dogstatsd.increment('weeb.services.subscriptions.fail.captcha')
      return res.json({ type: 'error', content: 'Invalid reCAPTCHA' })
    }
    // @todo: duplicate check + notification check + sql
    return res.json({ type: 'success', content: 'Subscription successful' })
  },
  del: async (req, res) => {
    if (!dickswordHookRegex.test(req.body.url)) {
      dogstatsd.increment('weeb.services.subscriptions.fail')
      dogstatsd.increment('weeb.services.subscriptions.fail.hook')
      return res.json({ type: 'error', content: 'Invalid webhook' })
    }
    const check = await verifyRecaptcha(req.body.recaptchaResponse)
    if (!check) {
      dogstatsd.increment('weeb.services.subscriptions.fail')
      dogstatsd.increment('weeb.services.subscriptions.fail.captcha')
      return res.json({ type: 'error', content: 'Invalid reCAPTCHA' })
    }
    // @todo: exists check + notification check + sql
    return res.json({ type: 'success', content: 'Subscription removed' })
  }
}
