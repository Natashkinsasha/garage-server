import express from 'express';
const userRouter = express.Router();


module.exports = (userService) => {
    return userRouter.get('/sign-out', function (req, res) {
        req.logout();
        res.redirect('/');
    }).post('/auth', passport.authenticate('local', {
            successRedirect: '/',
            failureRedirect: '/auth',
            failureFlash: true
        })
    ).get('/auth/fb',
        passport.authenticate('facebook', {
            scope: 'read_stream'
        })
    ).get('/auth/fb/callback',
        passport.authenticate('facebook', {
            successRedirect: '/',
            failureRedirect: '/auth'
        })
    ).get('/auth/vk',
        passport.authenticate('vk', {
            scope: ['friends']
        }),
        (req, res) => {

        }
    ).get('/auth/vk/callback',
        passport.authenticate('vk', {
            failureRedirect: '/auth'
        }),
        function (req, res) {
            res.redirect('/');
        }
    );
};

