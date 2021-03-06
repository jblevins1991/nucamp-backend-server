var express = require('express');
const passport = require('passport')
const createToken = require('../authenticate').createToken
const cors = require('cors')
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
        const token = createToken({
            _id: req.user._id,
        })

        res.status(httpMethods.SUCCESS)
        res.contentType('application/json')
        res.send({
            success: true,
            token,
        })
    })

router.route('/facebook')
    .get(passport.authenticate('facebook-token'), (req, res, next) => {
        if (req.user) {
            const token = authenticate.getToken({ _id: req.user._id })
            res.status(httpMethods.SUCCESS)
            res.send({
                success: true,
                token,
            })
        }
    })

module.exports = router
