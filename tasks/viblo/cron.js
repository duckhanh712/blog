import { CronJob } from 'cron'
import Post from '../../models/posts.js'
import axios from 'axios'
import User from '../../models/users.js'
import {
  Platforms,
  avatarUrlPrefix,
  vibloApiUrlPrefix
} from '../../constants/index.js'

export default async () => {
  const job = new CronJob(
    '*/10 * * * *',
    () => {
      crawl()
    },
    null,
    true,
    ''
  )

  job.start()
}

const crawl = async () => {
  let limit = 30
  let page = 1

  const viblo_url = `${vibloApiUrlPrefix}/posts/newest?page=${page}&limit=${limit}`
  console.log(viblo_url)
  const { users, posts } = await fecthData(viblo_url).catch(() => {})

  await Promise.allSettled(users.map(user => insertUser(user)))
  await Promise.allSettled(posts.map(post => insertPost(post)))

  return
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
          avatar: `${avatarUrlPrefix}/${post.user.data.avatar}`,
          followers_count: post.user.data.followers_count,
          posts_count: post.user.data.posts_count,
          reputation: post.user.data.reputation
        }
      ]

      return prepost
    },
    { users: [], posts: [] }
  )
}

function insertUser(user) {
  return User.create(user)
}

function insertPost(post) {
  return Post.create(post)
}
