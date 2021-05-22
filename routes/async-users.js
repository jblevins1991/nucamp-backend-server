var express = require('express');
var router = express.Router();

const userModel = require('../models/user')
const httpMethods = require('../constants')

router.route('/')
  .all((req, res, next) => {
    res.contentType('application/json')
    next()
  })
  .get(async (req, res, next) => {
    try {
        const userDocuments = await userModel.find({})

        res.status(httpMethods.SUCCESS)
        res.send({
            results: userDocuments,
        })
    } catch (error) {
        next(error)
    }
  })
  .post(async (req, res, next) => {
    const firstName = req.body.firstName
    const lastName = req.body.lastName
    const email = req.body.email
    const username = req.body.username

    try {
        const createdUser = await userModel.create({
        firstName,
        lastName,
        email,
        username,
        })

        res.status(httpMethods.SUCCESS)
        res.send({
        result: createdUser,
        })
    } catch (error) {
        next(error)
    }
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
  .get(async (req, res, next) => {
    const id = req.params.id

    try {
        const userDocument = userModel.find({
        id
        })

        res.status(httpMethods.SUCCESS)
        res.send({
        result: userDocument,
        })
    } catch (error) {
        next(error)
    }
  })
  .post((req, res, next) => {
    res.contentType('text/plain')
    res.status(httpMethods.METHOD_NOT_SUPPORTED)
    res.send('Post not supported.')
  })
  .put(async (req, res, next) => {
    const id = req.params.id

    const firstName = req.body.firstName
    const lastName = req.body.lastName
    const email = req.body.email
    const username = req.body.username

    try {
        const updatedUser = await userModel.findByIdAndUpdate(id, {
        firstName,
        lastName,
        email,
        username,
        }, {
        new: true,
        })

        res.status(httpMethods.SUCCESS)
        res.send({
        result: updatedUser,
        })
    } catch (error) {
        next(error)
    }
  })
  .delete(async (req, res, next) => {
    const id = req.params.id

    try {
        userModel.findByIdAndDelete(id, {})

        res.contentType('text/plain')
        res.status(httpMethods.SUCCESS)
        res.send('User was deleted successfully.')
    } catch (error) {
        next(error)
    }
  })

module.exports = router