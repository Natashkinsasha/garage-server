import shortId from 'shortid';
import jwt from 'jsonwebtoken';
import config from 'config';

function JWTService({redisClient}) {

    const secret = config.get('jwt.secret');

    this.createToken = (data) => {
        const tokenId = shortId.generate();
        return redisClient
            .sadd(tokenId)
            .then(() => (jwt.sign({data: {...data, tokenId}}, secret)));
    };

    this.createTokens = (data) => {
        // Может не сработать
        const refreshTokenId = shortId.generate();
        const accessTokenId = shortId.generate();
        return redisClient
            .pipeline()
            .sadd('accessToken', accessTokenId)
            .sadd('refreshToken', refreshTokenId)
            .exec()
            .then(() => ({
                accessToken: jwt.sign({data: {...data, accessTokenId}}, secret),
                refreshToken: jwt.sign({data: {...data, refreshTokenId}}, secret)
            }));
    };

    this.isActual = (id) => {
        return redisClient
            .sismember(id)
            .then(Boolean);
    };

    this.breakTokens = (...id) => {
        // Может не сработать
        return redisClient
            .srem(...id)
            .return(id);
    };
}
