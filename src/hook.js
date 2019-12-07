const database = require('./db')

class Hook {
  async notifySuccess (hook) {

  }

  async notifyDeletion (hook) {

  }

  async notifyRemoval (hook, deleted) {

  }

  schedule () {

  }

  async _sendImages () {
    const subscribed = await database.fetchSubscriptions()
    for (const subbed of subscribed) {
      console.log(subbed)
    }
  }

  async _execHook (id, sig, sub) {

  }
}

module.exports = new Hook()
