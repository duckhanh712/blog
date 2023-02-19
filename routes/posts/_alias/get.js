import PostModel from '../../../models/posts.js'
import camelcaseKeys from 'camelcase-keys'

export default async (req, res) => {
  const { alias } = req.params

  const post = await getPost(alias)
  if (!post) return res.sendStatus(404)

  return res.send(camelcaseKeys(post, { deep: true }))
}

async function getPost(alias) {
  const selectOpt = '-__v -created_at -updated_at -platform -category -url'

  return PostModel.findOne({ alias }, selectOpt)
    .populate({
      path: 'user',
      select: '-_id -__v'
    })
    .lean()
}
