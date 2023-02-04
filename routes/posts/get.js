import camelcaseKeys from 'camelcase-keys'
import PostModel from '../../models/posts.js'

export default async (req, res) => {
  const { page = 1, limit = 20 } = req.query

  if (page <= 0 || limit < 1) return res.sendStatus(400)

  const offset = page > 1 ? (+page - 1) * +limit : 0

  const posts = await filterPosts({ skip: offset, limit, filters: {} })

  return res.send(camelcaseKeys(posts, { deep: true }))
}

function filterPosts({ skip, limit, filters }) {
  const populateOpt = {
    path: 'user',
    select: '-_id name username avatar reputation posts_count followers_count'
  }
  return PostModel.find(filters, '-__v -created_at -updated_at')
    .populate(populateOpt)
    .skip(skip)
    .limit(limit)
    .lean()
}
