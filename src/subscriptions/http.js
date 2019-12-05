const fetch = require('node-fetch')
const { join } = require('path')
const { stringify } = require('qs')
const { createReadStream } = require('fs')

const Provider = require('../providers/provider')
const keys = require('../../keys.json')

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
  console.log(res)
  return res.success
}

module.exports = {
  html: (req, res) => {
    res.type('text/html')
    createReadStream(join(__dirname, 'index.html')).pipe(res)
  },
  css: (req, res) => {
    res.type('text/css')
    createReadStream(join(__dirname, 'style.css')).pipe(res)
  },
  post: async (req, res) => {
    if (!dickswordHookRegex.test(req.body.url)) {
      return res.json({ type: 'error', content: 'Invalid webhook' })
    }
    if (!Array.isArray(req.body.subTo) || req.body.subTo.length < 1 || req.body.subTo.find(e => !Provider.available.includes(e))) {
      return res.json({ type: 'error', content: 'Invalid subscriptions' })
    }
    const check = await verifyRecaptcha(req.body.recaptchaResponse)
    if (!check) {
      return res.json({ type: 'error', content: 'Invalid reCAPTCHA' })
    }
    // @todo: duplicate check + notification check + sql
    return res.json({ type: 'success', content: 'Subscription successful' })
  },
  del: async (req, res) => {
    if (!dickswordHookRegex.test(req.body.url)) {
      return res.json({ type: 'error', content: 'Invalid webhook' })
    }
    const check = await verifyRecaptcha(req.body.recaptchaResponse)
    if (!check) {
      return res.json({ type: 'error', content: 'Invalid reCAPTCHA' })
    }
    // @todo: exists check + notification check + sql
    return res.json({ type: 'success', content: 'Subscription removed' })
  }
}
