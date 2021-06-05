const passport = require('passport')
const jwt = require('jsonwebtoken')
const LocalStrategy = require('passport-local').Strategy
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt

const config = require('./config')

const userModel = require('./models/user')

/**
 * The passport local strategy middleware.
 * 
 * This middleware expects a `username` and `password` to be within `req.body`. If it is, it will 
 * place the user that the username and password is associated with on the req object.
 * 
 * See the `login` endpoint in /src/routes/authentication.js for more information.
 */
exports.local = passport.use(new LocalStrategy(userModel.authenticate()));

passport.serializeUser(userModel.serializeUser());
passport.deserializeUser(userModel.deserializeUser());

/**
 * This createToken function creates an encrypted json web token that will expire in an hour.
 */
exports.createToken = (jsonObject) => {
    return jwt.sign(jsonObject, config.secretKey, { expiresIn: 3600 })
}

/**
 * JSON Web Token strategy configuration
 * 
 * This configures our jwt strategy how to behave.
 */
const opts = {
    // Tells the jwt strategy how to pull the token from the request
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    // Tells the jwt strategy what key to use for encryption
    secretOrKey: config.secretKey,
}

exports.jwtPassport = passport.use(
    new JwtStrategy(
        // pass options to the strategy
        opts,
        /**
         * User Verification Callback
         * 
         * This is the code that places our user on the `req` object.
         */
        (payload, done) => {
            userModel.findOne({
                _id: payload._id,
            }, (error, userFound) => {
                if (error) {
                    // don't place a user on the req object if there was an error
                    return done(error)
                } else if (userFound) {
                    // place the userFound on the req object if there was no errors
                    return done(null, userFound)
                } else {
                    // don't place a user on the req object or return an error if something else happened
                    return done(null, false)
                }
            })
        }
    )
)

/**
 * This middleware expects a json web token to exist on the `Authorization` header of the request.
 * 
 * The token from the `Authorization` header is then used to look up the user and place it on the `req` object.
 * 
 * If a user is successfully verified, you can access all of their information except the password 
 * via `req.user`.
 */
exports.verifyUser = passport.authenticate('jwt', { session: false })
