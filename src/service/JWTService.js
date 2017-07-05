import shortId from 'shortid';
import jwt from 'jsonwebtoken';
import moment from 'moment';
import config from 'config';

function JWTService({redisClient}) {

    const secret = config.get('jwt.secret');

    this.createToken = ({data, type = 'ACCESS', iss = 'garage'}) => {
        const jti = shortId.generate() + data.id;
        return redisClient
            .hset('${jti}:${type}:${iss}', {jti, type, iss, createDate: moment()})
            .then(() => (jwt.sign({...data, jti, type, iss}, secret)));
    };

    this.createAccessToken = ({data, iss = 'garage'}) => {
        return this.createToken({data, type: 'ACCESS', iss});
    };

    this.createRefreshToken = (data, iss = 'garage') => {
        return this.createToken({data, type: 'REFRESH', iss});
    };

    this.createTokens = (data) => {

    };

    this.isActualRefreshToken = ({jti, iss = '*'}) => {
        return redisClient
            .get('${jti}:ACCESS:${iss}')
            .then(Boolean);
    };

    this.isActualAccessToken = ({jti, iss = '*'}) => {
        return redisClient
            .get('${jti}:REFRESH:${iss}')
            .then(Boolean);
    };

    this.breakToken = ({jti, iss = '*', type = '*', id}) => {
        const key = id && '*${id}:${type}:${iss}' || '${jti}:${type}:${iss}';
        return redisClient
            .del(key)
            .return(id);
    };

    this.breakRefreshToken = ({jti, iss = '*', id}) => {
        return this.breakToken({jti, iss, type: 'REFRESH', id})
            .return(id);
    };

    this.breakAccessToken = ({jti, iss = '*', id}) => {
        return this.breakToken({jti, iss, type: 'ACCESS', id})
            .return(id);
    };
}

export default JWTService;
