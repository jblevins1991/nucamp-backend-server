const passport = require('passport')
const FacebookStrategy = require('passport-facebook-token')

const userModel = require('./models/user')
const config = require('./config')

exports.facebookTokenStrategy = passport.use(
    new FacebookStrategy({
        clientID: config.facebook.clientId,
        clientSecret: config.facebook.clientSecret,
    },
    (accessToken, refreshToken, profile, done) => {
        userModel.findOne({ facebookId: profile.id }, (error, userFound) => {
            if (error) {
                return done(error, false)
            } else if (!error & userFound) {
                return done(null, userFound)
            } else {
                const user = new userModel({ username: profile.displayName })
                user.facebookId = profile.id
                user.firstName = profile.name.givenName
                user.lastName = profile.name.familyName

                user.save((error, savedUser) => {
                    if (error) {
                        return done(error, false)
                    } else {
                        return done(null, savedUser)
                    }
                })
            }
        })
    })
)