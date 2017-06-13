import express from 'express';
import passport from 'passport';

module.exports = ({userController, authorizationCheck}) => {
    const userRouter = express.Router();
    return userRouter
        .post('/signup', userController.signup)
        .post('/login', passport.authenticate('local'), userController.login)
        .get('/logout', authorizationCheck(), passport.authenticate('local'), userController.logout);
};
