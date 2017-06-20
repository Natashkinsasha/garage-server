import jwt from 'jsonwebtoken';


function AuthController(userService, JWTService) {

    this.login = (req, res, next) => {
        return res.status(200).end()
    };

    this.logout = (req, res, next) => {
        return JWTService
            .breakToken(user.tokenId)
            .then((token) => (res.status(201).end()));
    };

    this.signup = (req, res, next) => {
        return userService
            .create({...req.body})
            .then((user) => {
                return JWTService
                    .createTokens(user)
                    .then(({accessToken, refreshToken}) => (res.status(201).json({accessToken, refreshToken})));
            })
            .catch(next);
    };

}

export default AuthController;

