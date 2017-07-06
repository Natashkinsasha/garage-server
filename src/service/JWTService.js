import shortId from 'shortid';
import jwt from 'jsonwebtoken';
import config from 'config';
import Promise from 'bluebird';

function JWTService({redisClient}) {

    const secret = config.get('jwt.secret');

    this.createToken = ({data = {}, type = 'ACCESS', iss = 'garage'}) => {
        const id = data.id || ``;
        const jti = `${shortId.generate()}-${id}`;
        return Promise.promisify(jwt.sign)({data, jti, type, iss}, secret)
            .then((token) => Promise.promisify(jwt.verify)(token, secret)
                .then((decoded) => (redisClient.hmset(`${jti}:${type}:${iss}`, 'jti', jti, 'type', type, 'iss', iss, 'iat', decoded.iat, 'data', JSON.stringify(data)))
                    .return(token)
                )
            )
    };

    this.createAccessToken = ({data, iss = 'garage'}) => {
        return this.createToken({data, type: 'ACCESS', iss});
    };

    this.createRefreshToken = ({data, iss = 'garage'}) => {
        return this.createToken({data, type: 'REFRESH', iss});
    };

    this.createTokens = ({data, iss = `garage`}) => {
        return Promise
            .props({
                accessToken: this.createAccessToken({data, iss}),
                refreshToken: this.createRefreshToken({data, iss}),
            });
    };

    this.isActual = ({jti, iss, type}) => {
        if (!jti || !iss || !type) {
            return redisClient
                .keys(`${jti || '*'}:${type || '*'}:${iss || '*'}`)
                .get(0)
                .then(Boolean);
        }
        return redisClient
            .get(`${jti}:${type}:${iss}`)
            .then(Boolean);
    };

    this.isActualAccessToken = ({jti, iss}) => {
        return this.isActual({jti, iss, type: 'ACCESS'});
    };

    this.isActualRefreshToken = ({jti, iss = `*`}) => {
        return this.isActual({jti, iss, type: 'REFRESH'});
    };

    this.breakToken = ({jti, iss, type, id}) => {
        if (!jti || !iss || !type) {
            const key = id && `*${id || '*'}:${type || '*'}:${iss || '*'}` || `${jti || '*'}:${type || '*'}:${iss || '*'}`;
            return redisClient
                .keys(key)
                .then(redisClient.del);
        }
        return redisClient
            .del(`${jti}:${type}:${iss}`);
    };

    this.breakRefreshToken = ({jti, iss = `*`, id}) => {
        return this.breakToken({jti, iss, type: `REFRESH`, id})
            .return(id);
    };

    this.breakAccessToken = ({jti, iss = `*`, id}) => {
        return this.breakToken({jti, iss, type: `ACCESS`, id})
            .return(id);
    };

    this.getTokensPayload = ({jti, iss, type, id}) => {
        if (!jti || !iss || !type) {
            const key = id && `*${id || '*'}:${type || '*'}:${iss || '*'}` || `${jti || '*'}:${type || '*'}:${iss || '*'}`;
            return redisClient
                .keys(key)
                .map(redisClient.hgetall)
                .map((tokenPayload) => ({...tokenPayload, data: JSON.parse(tokenPayload.data)}))
        }
        return redisClient
            .hgetall(`${jti}:${type}:${iss}`)
            .then((tokenPayload) => ({...tokenPayload, data: JSON.parse(tokenPayload.data)}));
    };

    this.getTokens = ({jti, iss, type, id}) => {
        if (!jti || !iss || !type) {
            const key = id && `*${id || '*'}:${type || '*'}:${iss || '*'}` || `${jti || '*'}:${type || '*'}:${iss || '*'}`;
            return redisClient
                .keys(key)
                .map(redisClient.hgetall)
                .map((tokenPaylod) => (Promise.promisify(jwt.sign)({
                    ...tokenPaylod,
                    data: JSON.parse(tokenPaylod.data)
                }, secret)));
        }
        return redisClient
            .hgetall(`${jti}:${type}:${iss}`)
            .then((tokenPaylod) => (Promise.promisify(jwt.sign)({
                ...tokenPaylod,
                data: JSON.parse(tokenPaylod.data)
            }, secret)));
    };
}

export default JWTService;
