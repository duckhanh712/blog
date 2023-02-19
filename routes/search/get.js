import camelcaseKeys from 'camelcase-keys'
import PostModel from '../../models/posts.js'

export default async (req, res) => {
  const keyword = req.query.q
  const page = +req.query.page || 1
  const limit = +req.query.limit || 20

  let filters = { $text: { $search: keyword } }

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
  const selectOpt = '-__v -created_at -updated_at -platform -category -url'
  const total = await PostModel.count(filters)
  const posts = await PostModel.find(filters, selectOpt)
    .populate(populateOpt)
    .skip(offset)
    .limit(limit)
    .lean()

  const meta = {
    total,
    perPage: limit
  }

  return { meta, posts: camelcaseKeys(posts, { deep: true }) }
}
