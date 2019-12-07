/* eslint-disable no-unused-vars */
const sqlite = require('sqlite')
const { existsSync, readFileSync, writeFileSync } = require('fs')

const migrations = [
  [ 'a', 'b' ]
]

class Database {
  async initialize () {
    this.sqlite = await sqlite.open('weeb.services.db')
    const lastMigration = existsSync('_migration.txt') ? readFileSync('_migration.txt') : -1
    if (lastMigration !== migrations.length - 1) {
      const todos = migrations.slice(lastMigration + 1)
      for (const todo of todos) {
        for (const query of todo) {
          // exec query
        }
      }
    }

    const subscriptions = await this.fetchSubscriptions()
    // @todo: check if db exists
    // @todo: check removed services
    // @todo: stats
  }

  async fetchSubscriptions () {

  }

  async hookExists (hook) {

  }

  async createSubscription (hook, subs) {

  }

  async deleteSubscription (hook, subs) {

  }
}

module.exports = new Database()
