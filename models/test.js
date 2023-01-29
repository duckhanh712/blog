import mongoose from 'mongoose'
// import mongoosePaginate from 'mongoose-paginate-v2';
const { Schema } = mongoose
const UserSchema = new Schema({
  name: {
    type: String
  },
  email: {
    type: String
  }
})

// UserSchema.plugin(mongoosePaginate);
export default mongoose.model('users', UserSchema)
