import Post from '../../models/posts.js'
import { sleep } from '../../utils.js'
import axios from 'axios'
import User from '../../models/users.js'
import { Platforms } from '../../constants/index.js'
import fs from 'fs'

const avatar_url_prefix = `https://images.viblo.asia/avatar`

export default async () => {
  let limit = 100
  let page = 1
  let totalPost = 100

  while (totalPost >= 100) {
    
    await notePage(page)

    const viblo_url = `https://viblo.asia/api/posts/newest?page=${page}&limit=${limit}`
    console.log(viblo_url);
    const { users, posts } = await fecthData(viblo_url)

    await Promise.allSettled(users.map(user => insertUser(user)))

    await Promise.allSettled(posts.map(post => insertPost(post)))

    await sleep('5000')
    totalPost = posts.length
    page = page + 1
  }
}

async function fecthData(url) {
  const { data } = await axios.get(url)

  return data.data.reduce(
    (prepost, post) => {
      prepost.posts = [
        ...prepost.posts,
        {
          _id: `${Platforms.viblo}.${post.slug}`,
          title: post.title,
          alias: post.transliterated,
          canonical_url: post.canonical_url,
          content: post.contents,
          views_count: post.views_count,
          comments_count: post.comments_count,
          points: post.points,
          reading_time: post.reading_time,
          platform: Platforms.viblo,
          slug: post.slug,
          tags: post.tags.data,
          user: post.user.data.username,
          published_at: post.published_at,
          url: post.url
        }
      ]
      prepost.users = [
        ...prepost.users,
        {
          _id: post.user.data.username,
          name: post.user.data.name,
          username: post.user.data.username,
          avatar: `${avatar_url_prefix}/${post.user.data.avatar}`,
          followers_count: post.user.data.followers_count,
          posts_count: post.user.data.posts_count,
          reputation:  post.user.data.reputation
        }
      ]

      return prepost
    },
    { users: [], posts: [] }
  )
}

function notePage(page) {
  console.log(page)
  fs.writeFile('./log.txt', `${page}`, err => {
    if (err) {
      console.error(err)
    }
    // file written successfully
  })
}

function insertUser(user) {
  return User.create(user)
}

function insertPost(post) {
  return Post.create(post)
}
