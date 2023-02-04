import mongoose from 'mongoose'
const { Schema } = mongoose
const UserSchema = new Schema(
  {
    _id: {
      type: String,
      required: true,
      alias: 'id'
    },
    name: {
      type: String,
      required: true
    },
    username: {
      type: String,
      required: true,
      unique: true
    },
    email: {
      type: String
    },
    avatar: {
      type: String
    },
    reputation: {
      type: String
    },
    posts_count: {
      type: Number,
      alias: 'postsCount'
    },
    followers_count: {
      type: Number,
      alias: 'followersCount'
    }
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
  }
)

export default mongoose.model('users', UserSchema)
