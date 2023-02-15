import camelcaseKeys from 'camelcase-keys'
import PostModel from '../../models/posts.js'

export default async (req, res) => {
  const page = +req.query.page || 1
  const limit = +req.query.limit || 20

  let filters = {}

  if (page <= 0 || limit < 1) return res.sendStatus(400)
  const offset = page > 1 ? (page - 1) * limit : 0

  const { posts, meta } = await getPosts({
    offset,
    limit,
    filters
  })

  return res.send({ data: posts, pagination: { ...meta, page } })
}

async function getPosts({ offset, limit, filters }) {
  const populateOpt = {
    path: 'user',
    select: '-_id name username avatar reputation posts_count followers_count'
  }
  const total = await PostModel.count(filters)
  const posts = await PostModel.find(filters, '-__v -created_at -updated_at')
    .populate(populateOpt)
    .skip(offset)
    .limit(limit)
    .sort({published_at: -1})
    .lean()

  const meta = {
    total,
    perPage: limit
  }

  return { meta, posts: camelcaseKeys(posts, { deep: true }) }
}
