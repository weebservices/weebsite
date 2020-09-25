/*
 * Copyright (c) 2020 Weeb Services
 * Licensed under the Open Software License version 3.0
 */

const sqlite = require('sqlite')
const { existsSync, readFileSync, writeFileSync } = require('fs')
const Provider = require('./providers/provider')

const migrations = [
  [ 'CREATE TABLE subscriptions (`id` VARCHAR(20) NOT NULL, `signature` VARCHAR(75) NOT NULL, `services` TEXT NOT NULL, PRIMARY KEY (`id`))' ]
  // [ // soon
  //  'ALTER TABLE subscriptions ADD COLUMN `type` VARCHAR(16)',
  //  'UPDATE subscriptions SET type = "DISCORD"'
  // ]
]

// @todo: Un-tie webhook checkings
class Database {
  async initialize () {
    this.sqlite = await sqlite.open('weeb.services.db')
    const lastMigration = existsSync('_migration.txt') ? readFileSync('_migration.txt') : -1
    if (lastMigration !== migrations.length - 1) {
      const todos = migrations.slice(lastMigration + 1)
      for (const todo of todos) {
        for (const query of todo) {
          await this.sqlite.run(query)
        }
      }
      writeFileSync('_migration.txt', migrations.length - 1)
    }

    const subscriptions = await this.fetchSubscriptions()
    subscriptions.forEach(sub => {
      const services = JSON.parse(sub.services)
      const invalid = services.filter(s => !Provider.available.includes(s))
      if (invalid.length > 0) {
        const hook = require('./hooks/discord') // cyclic

        hook.notifyRemoval(sub.id, sub.signature, invalid, invalid.length === services.length)
        if (invalid.length === services.length) {
          this.sqlite.run('DELETE FROM subscriptions WHERE id = ?', sub.id)
        } else {
          const newServices = services.filter(s => Provider.available.includes(s))
          this.sqlite.run('UPDATE subscriptions SET services = ? WHERE id = ?', JSON.stringify(newServices), sub.id)
        }
      }
    })
  }

  fetchSubscriptions () {
    return this.sqlite.all('SELECT * FROM subscriptions')
  }

  hookExists (hook) {
    const [ id, sig ] = this._splitHook(hook)
    return this.sqlite.get('SELECT id FROM subscriptions WHERE id = ? AND signature = ?', id, sig)
  }

  createSubscription (hook, subs) {
    const [ id, sig ] = this._splitHook(hook)
    return this.sqlite.run('INSERT INTO subscriptions VALUES (?, ?, ?)', id, sig, JSON.stringify(subs))
  }

  deleteSubscription (hook) {
    const [ id, sig ] = this._splitHook(hook)
    return this.sqlite.run('DELETE FROM subscriptions WHERE id = ? AND signature = ?', id, sig)
  }

  _splitHook (hook) {
    return hook.match(/^https:\/\/(?:canary\.|ptb\.)?discordapp.com\/api\/webhooks\/(\d+)\/([\w-]+)$/).slice(1, 3)
  }
}

module.exports = new Database()
