const mongoose = require('mongoose')

const jobSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  pay: {
    type: Number,
    required: true,
  }
})

module.exports = mongoose.model('jobs', jobSchema)
