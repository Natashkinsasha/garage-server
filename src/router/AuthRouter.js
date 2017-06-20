import express from 'express';

export default ({authController, passport, authorizationCheck = () => ((req, res, next) => (next()))}) => {
    const authRouter = express.Router();
    return authRouter
        .post('/signup', authController.signup)
        .post('/login', passport.authenticate('local'), authController.login)
        .get('/logout', authorizationCheck(), authController.logout)
        .get('/auth/facebook', passport.authenticate('facebook'))
        .get('/auth/facebook/callback', passport.authenticate('facebook'), authController.login);
};
