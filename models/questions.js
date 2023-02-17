import mongoose from 'mongoose'

const { Schema } = mongoose
const QuestionSchema = new Schema(
  {
    _id: {
      type: String,
      required: [true, 'Id required!']
    },
    seo: {
      type: Object,
      required: [true, 'seo required!']
    },
    title: {
      type: String,
      required: [true, 'title required!']
    },
    slug: {
      type: String,
      required: [true, 'slug required!']
    },
    alias: {
      type: String,
      required: [true, 'alias required!']
    },
    user: {
      type: String,
      required: [true, 'user required!']
    },
    url: {
      type: String,
      default: null
    },
    contents: {
      type: String,
      required: [true, 'contents required!']
    },
    sloved: {
      type: Boolean,
      default: false
    },
    points: {
      type: Number,
      default: 0
    },
    rated_value: {
      type: String,
      default: null
    },
    views_count: {
      type: Number,
       default: 0
    },
    answers_count: {
      type: Number,
       default: 0
    },
    tags: {
      type: Object,
      required: [true, 'tags required!']
    }
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
  }
)

export default mongoose.model('questions', QuestionSchema)
