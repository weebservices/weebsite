/*
 * Copyright (c) 2020 Weeb Services
 * Licensed under the Open Software License version 3.0
 */

const fetch = require('node-fetch')
const Provider = require('./provider')

class AbstractDanbooru extends Provider {
  get url () {
    throw new Error('Not implemented')
  }

  provide () {
    throw new Error('Not implemented')
  }

  async _getPost (tag, ratings, allowInsanity) {
    const allPosts = await fetch(this.url.replace('#{tag}', tag)).then(res => res.json())
    const posts = allPosts.filter(post =>
      post.file_url && ratings.includes(post.rating) && (allowInsanity || !(post.tag_string || post.tags).split(' ').includes('trap'))
    )
    const post = posts[Math.floor(Math.random() * posts.length)]
    return [
      post.file_url.split('.').pop(),
      await fetch(post.file_url)
    ]
  }
}

module.exports = AbstractDanbooru
