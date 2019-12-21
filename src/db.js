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
