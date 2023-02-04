import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

const { Schema } = mongoose
const PostSchema = new Schema(
  {
    _id: {
      type: String,
      required: [true, 'Id required!']
    },
    title: {
      type: String,
      required: [true, 'title required!']
    },
    alias: {
      type: String,
      required: [true, 'alias required!'],
      unique: true
    },
    slug: {
      type: String,
      required: [true, 'slug required!'],
      unique: true
    },
    content: {
      type: String
    },
    category: {
      type: Object,
      default: null
    },
    views_count: {
      type: String,
      required: true
    },
    comments_count: {
      type: String,
      required: true
    },
    points: {
      type: String,
      required: true
    },
    reading_time: {
      type: String,
      required: true
    },
    platform: {
      type: String,
      required: true
    },
    url: {
      type: String
    },
    tags: {
      type: Object,
      required: true
    },
    user: { type: String, ref: 'users' },
    published_at: {
      type: Date,
      required: true
    }
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
  }
)

PostSchema.plugin(mongoosePaginate)

export default mongoose.model('posts', PostSchema)
