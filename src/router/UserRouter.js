import express from 'express';
import passport from 'passport';

export default ({userController, authorizationCheck = () => ((req, res, next) => (next()))}) => {
    const userRouter = express.Router();
    return userRouter
        .post('/signup', userController.signup)
        .post('/login', passport.authenticate('local'), userController.login)
        .get('/logout', authorizationCheck(), passport.authenticate('local'), userController.logout);
};
