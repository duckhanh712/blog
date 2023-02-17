import { avatarUrlPrefix } from '../../constants/index.js'
import User from '../../models/users.js'

export function insertUser(userBody) {
  const user = {
    _id: userBody.username,
    name: userBody.name,
    username: userBody.username,
    avatar: `${avatarUrlPrefix}/${userBody.avatar}`,
    followers_count: userBody.followers_count,
    posts_count: userBody.posts_count,
    reputation: userBody.reputation
  }

  return User.create(user)
}
