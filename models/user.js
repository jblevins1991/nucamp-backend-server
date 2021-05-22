const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    firstName: 'string',
    lastName: 'string',
    email: 'string',
    username: 'string',
})

module.exports = mongoose.model('user', userSchema)