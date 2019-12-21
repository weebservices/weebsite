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
      post.file_url && ratings.includes(post.rating) && (allowInsanity || !post.tag_string.split(' ').includes('trap'))
    )
    const post = posts[Math.floor(Math.random() * posts.length)]
    return [
      post.file_url.split('.').pop(),
      await fetch(post.file_url)
    ]
  }
}

module.exports = AbstractDanbooru
