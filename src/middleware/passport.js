import passport from 'passport';
import config from 'config';
import crypto from 'crypto';

import AuthenticationError from '../error/AuthenticationError';
import BrokenTokenError from '../error/BrokenTokenError';
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const VKStrategy = require('passport-vkontakte').Strategy;
const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
const secret = config.get('jwt.secret');


function passportAuthenticate({userService, JWTService}) {
    passport.use({session: false}, new LocalStrategy((username, password, done) => {
            return userService
                .findByUsername(username)
                .then((user) => {
                    if (!user) {
                        return done(new AuthenticationError());
                    }
                    if (checkPassword(password, user.passwordHash, user.salt)) {
                        return done(new AuthenticationError());
                    }
                    return done(null, {username: user.username, roles: user.roles});
                })
                .catch(done)
        })
    );

    const opts = {
        jwtFromRequest: ExtractJwt.fromAuthHeader('JWT-Token'),
        secretOrKey: secret,
    };

    passport.use({session: false}, new JwtStrategy(opts, (payload, done) => {
        return JWTService
            .isActual(payload.data.tokenId)
            .then((isActual) => {
                if (isActual) {
                    done(null, payload.data);
                }
                done(new BrokenTokenError());
            })
            .catch(done);
    }));

    passport.use({session: false}, new FacebookStrategy({
            clientID: config.get('FACEBOOK_APP_ID'),
            clientSecret: config.get('FACEBOOK_APP_SECRET'),
            callbackURL: "auth/facebook/callback"
        },
        (accessToken, refreshToken, profile, done) => {
            return userService
                .findOrCreate({facebookId: profile.id})
                .then((user) => (done(null, {username: user.username, roles: user.roles})))
                .catch(done);
        }
    ));


    //для session
    passport.deserializeUser((data, done) => {
        return done(null, JSON.parse(data));
    });

    passport.serializeUser((user, done) => {
        return done(null, JSON.stringify(user));
    });

    return passport;
}

function checkPassword(password, passwordHash, salt) {
    if (!password) return false;
    if (!passwordHash) return false;
    return crypto.pbkdf2Sync(password, salt, 1, 128, 'sha1') === passwordHash;
}


export default passportAuthenticate;





