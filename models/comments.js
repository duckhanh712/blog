import mongoose from 'mongoose'
const { Schema } = mongoose

const CommentSchema = new Schema(
  {
    _id: {
      type: String,
      required: [true, 'Id required!']
    },
    user: {
      type: String,
      required: [true, 'user required!']
    },
    points: {
      type: Number,
      required: [true, 'points required!']
    },
    rated_value: {
      type: String,
      default: null
    },
    comment_type: {
      type: Number,
      required: [true, 'related_id required!']
    },
    related_id: {
      type: String,
      required: [true, 'related_id required!']
    },
    contents: {
      type: String,
      required: [true, 'contents required!']
    },
    contents_short: {
      type: String,
      required: [true, 'contents_short required!']
    }
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
  }
)

export default mongoose.model('comments', CommentSchema)
