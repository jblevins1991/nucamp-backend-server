const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')

const userSchema = mongoose.Schema({
  isAdmin: {
    type: Boolean,
    default: false,
  }
})

userSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model('users', userSchema)
