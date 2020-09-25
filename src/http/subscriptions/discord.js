/*
 * Copyright (c) 2020 Weeb Services
 * Licensed under the Open Software License version 3.0
 */

const fetch = require('node-fetch')
const { stringify } = require('querystring')

const Provider = require('../../providers/provider')
const { http, dogstatsd } = require('../../utils')
const database = require('../../db')
const hook = require('../../hooks/discord')
const keys = require('../../../keys.json')

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
      return http.json(res, { type: 'error', content: 'Invalid webhook' })
    }
    if (!Array.isArray(req.body.subTo) || req.body.subTo.length < 1 || req.body.subTo.find(e => !Provider.available.includes(e))) {
      dogstatsd.increment('weeb.services.subscriptions.fail')
      dogstatsd.increment('weeb.services.subscriptions.fail.sub')
      return http.json(res, { type: 'error', content: 'Invalid subscriptions' })
    }
    const check = await verifyRecaptcha(req.body.recaptchaResponse)
    if (!check) {
      dogstatsd.increment('weeb.services.subscriptions.fail')
      dogstatsd.increment('weeb.services.subscriptions.fail.captcha')
      return http.json(res, { type: 'error', content: 'Invalid reCAPTCHA' })
    }
    const exists = await database.hookExists(req.body.url)
    if (exists) {
      dogstatsd.increment('weeb.services.subscriptions.fail')
      dogstatsd.increment('weeb.services.subscriptions.fail.duplicate')
      return http.json(res, { type: 'error', content: 'Webhook already registered' })
    }
    const success = await hook.notifySuccess(req.body.url)
    if (!success) {
      dogstatsd.increment('weeb.services.subscriptions.fail')
      dogstatsd.increment('weeb.services.subscriptions.fail.hook_failure')
      return http.json(res, { type: 'error', content: 'Failed to POST through this webhook' })
    }

    await database.createSubscription(req.body.url, req.body.subTo)
    return http.json(res, { type: 'success', content: 'Subscription successful' })
  },
  del: async (req, res) => {
    if (!dickswordHookRegex.test(req.body.url)) {
      dogstatsd.increment('weeb.services.subscriptions.fail')
      dogstatsd.increment('weeb.services.subscriptions.fail.hook')
      return http.json(res, { type: 'error', content: 'Invalid webhook' })
    }
    const check = await verifyRecaptcha(req.body.recaptchaResponse)
    if (!check) {
      dogstatsd.increment('weeb.services.subscriptions.fail')
      dogstatsd.increment('weeb.services.subscriptions.fail.captcha')
      return http.json(res, { type: 'error', content: 'Invalid reCAPTCHA' })
    }
    const exists = await database.hookExists(req.body.url)
    if (!exists) {
      dogstatsd.increment('weeb.services.subscriptions.fail')
      dogstatsd.increment('weeb.services.subscriptions.fail.inexistent')
      return http.json(res, { type: 'error', content: 'This webhook does not have an active subscription' })
    }

    http.json(res, { type: 'success', content: 'Subscription removed' })
    await database.deleteSubscription(req.body.url)
    await hook.notifyDeletion(req.body.url)
  }
}
