const express = require('express')
const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const userModel = require('../models/user')
const jobModel = require('../models/job')
const authenticate = require('../authenticate')

const router = express.Router()

router.route('/')
  .get((req, res, next) => {
    jobModel.find({}, (error, jobsFound) => {
      if (error) {
        next(error)
      }

      res.send({
        results: jobsFound,
      })
    })
  })
  .post(authenticate.verifyUser, (req, res, next) => {
    jobModel.create({
      title: req.body.title,
      pay: req.body.pay,
    }, (error, jobCreated) => {
      if (error) {
        return next(error)
      }

      userModel.findByIdAndUpdate(
        req.user._id, {
          job: new ObjectId(jobCreated._id)
        },
        (error, _) => {
          if (error) {
            return next(error)
          }

          res.send({
            result: jobCreated,
          })
        })
    })
  })

router.route('/:id')
  .get((req, res, next) => {
    jobModel.findById(req.params.id, (error, jobFound) => {
      if (error) {
        next(error)
      }

      res.status(200)
      res.send({
        result: jobFound,
      })
    })
  })
  .put(authenticate.verifyUser, (req, res, next) => {
    jobModel.findByIdAndUpdate(req.params.id, {
      title: req.body.title,
      pay: req.body.pay,
    }, {
      new: true,
    }, (error, updatedJob) => {
      if (error) {
        return next(error)
      }

      res.status(200)
      res.send({
        result: updatedJob,
      })
    })
  })
  .delete(authenticate.verifyUser, (req, res, next) => {
    jobModel.findByIdAndDelete(req.params.id, (error, _) => {
      if (error) {
        return next(error)
      }

      res.status(200)
      res.send('The job was successfully deleted.')
    })
  })

module.exports = router

