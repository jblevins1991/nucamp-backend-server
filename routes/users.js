var express = require('express');
var router = express.Router();

const userModel = require('../models/user')
const httpMethods = require('../constants')

router.route('/')
  .all((req, res, next) => {
    res.contentType('application/json')
    next()
  })
  .get((req, res, next) => {
    userModel.find({} , (error, userDocuments) => {
      if (error) {
        next(error)
      }

      res.status(httpMethods.SUCCESS)
      res.send({
        results: userDocuments,
      })
    })
  })
  .post((req, res, next) => {    
    const firstName = req.body.firstName
    const lastName = req.body.lastName
    const email = req.body.email
    const username = req.body.username

    userModel.create({
      firstName,
      lastName,
      email,
      username,
    }, (error, createdUser) => {
      if (error) {
        next(error)
      }

      res.status(httpMethods.SUCCESS)
      res.send({
        result: createdUser,
      })
    })
  })
  .put((req, res, next) => {
    res.contentType('text/plain')
    res.status(httpMethods.METHOD_NOT_SUPPORTED)
    res.send('Put not supported.')
  })
  .delete((req, res, next) => {
    res.contentType('text/plain')
    res.status(httpMethods.METHOD_NOT_SUPPORTED)
    res.send('Delete not supported.')
  })

router.route('/:id')
  .all((req, res, next) => {
    res.contentType('application/json')
    next()
  })
  .get((req, res, next) => {
    const id = req.params.id

    userModel.find({
      id
    }, (error, userDocument) => {
      if (error) {
        next(error)
      }

      res.status(httpMethods.SUCCESS)
      res.send({
        result: userDocument,
      })
    })
  })
  .post((req, res, next) => {
    res.contentType('text/plain')
    res.status(httpMethods.METHOD_NOT_SUPPORTED)
    res.send('Post not supported.')
  })
  .put((req, res, next) => {
    const id = req.params.id

    const firstName = req.body.firstName
    const lastName = req.body.lastName
    const email = req.body.email
    const username = req.body.username

    userModel.findByIdAndUpdate(id, {
      firstName,
      lastName,
      email,
      username,
    }, {
      new: true,
    }, (error, updatedUser) => {
      if (error) {
        next(error)
      }

      res.status(httpMethods.SUCCESS)
      res.send({
        result: updatedUser,
      })
    })
  })
  .delete((req, res, next) => {
    const id = req.params.id

    userModel.findByIdAndDelete(id, {}, (error, deletedUser) => {
      if (error) {
        next(error)
      }

      res.contentType('text/plain')
      res.status(httpMethods.SUCCESS)
      res.send('User was deleted successfully.')
    })
  })

module.exports = router