var express = require('express');
const passport = require('passport')
const getToken = require('../authenticate').getToken

var router = express.Router();

const userModel = require('../models/user')
const httpMethods = require('../constants')

router.route('/sign-up')
    .post((req, res) => {
        userModel.register(
            new userModel({ username: req.body.username }),
            req.body.password,
            error => {
                if (error) {
                    res.status(500)
                    res.contentType('application/json')
                    res.send({
                        error,
                    })
                } else {
                    res.status(httpMethods.SUCCESS)
                    res.contentType('application/json')
                    res.send({
                        success: true,
                    })
                }
            }
        )
    })

router.route('/login')
    .post(passport.authenticate('local'), (req, res) => {
        const token = getToken({
            _id: req.user._id,
        })

        res.status(httpMethods.SUCCESS)
        res.contentType('application/json')
        res.send({
            success: true,
            token,
        })
    })

module.exports = router