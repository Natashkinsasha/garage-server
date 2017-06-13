import passport from 'passport';
import config from 'config';
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const VKStrategy = require('passport-vkontakte').Strategy;

import AuthenticationError from '../error/AuthenticationError';


function passportAuthenticate({userService}) {
    passport.use(new LocalStrategy((username, password, done) => {
            return userService
                .findByUsername(username)
                .then((user) => {
                    if (!user) {
                        return done(new AuthenticationError());
                    }
                    if (user.password !== password) {
                        return done(new AuthenticationError());
                    }
                    return done(null, {username: user.username, roles: user.roles});
                })
                .catch(done)
        })
    );

    passport.deserializeUser((data, done) => {
        return done(null, JSON.parse(data));
    });

    passport.serializeUser((user, done) => {
        return done(null, JSON.stringify(user));
    });

    return passport;
}

export default passportAuthenticate;





