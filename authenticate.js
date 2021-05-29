const passport = require('passport')
const jwt = require('jsonwebtoken')
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const LocalStrategy = require('passport-local').Strategy

const config = require('./config')

const userModel = require('./models/user')

exports.local = passport.use(new LocalStrategy(userModel.authenticate()));

passport.serializeUser(userModel.serializeUser());
passport.deserializeUser(userModel.deserializeUser());

exports.getToken = (user) => {
    return jwt.sign(user, config.secretKey, { expiresIn: 36000 })
}

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.secretKey,
}

exports.jwtPassport = passport.use(
    new JwtStrategy(
        opts,
        (payload, done) => {
            userModel.findOne({
                _id: payload._id,
            }, (error, userFound) => {
                if (error) {
                    return done(error)
                } else if (userFound) {
                    return done(null, userFound)
                } else {
                    return done(null, false)
                }
            })
        }
    )
)

exports.verifyUser = passport.authenticate('jwt', { session: false })
