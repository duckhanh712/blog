import mongoose from 'mongoose'

const { Schema } = mongoose
const AnswerSchema = new Schema(
  {
    _id: {
      type: String,
      required: [true, 'Id required!']
    },
    user: {
      type: String,
      required: [true, 'user required!']
    },
    accepted: {
      type: Boolean,
      default: 0
    },
    deleted_at: {
      type: Date,
      default: null
    },
    question_id: {
      type: String,
      required: [true, 'question_id required!']
    },
    contents: {
      type: String,
      required: [true, 'contents required!']
    },
    points: {
      type: Number,
      required: [true, 'points required!']
    },
    rated_value: {
      type: String,
      default: null
    }
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
  }
)

export default mongoose.model('answers', AnswerSchema)
