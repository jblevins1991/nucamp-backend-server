const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')

const userSchema = mongoose.Schema({
  facebookId: String,
  isAdmin: {
    type: Boolean,
    default: false,
  },
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'jobs'
  }
})

userSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model('users', userSchema)
