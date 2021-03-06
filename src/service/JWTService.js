import shortId from 'shortid';
import jwt from 'jsonwebtoken';
import Promise from 'bluebird';

function JWTService({redisClient, secret: globalSecret}) {


    this.createToken = ({data = {}, type = 'ACCESS', iss = 'garage', id, ...claims}, secret) => {
        const jti = `${shortId.generate()}-${id || data.id || ''}`;
        return Promise.promisify(jwt.sign)({data, jti, type, iss, ...claims}, secret || globalSecret)
            .then((token) => Promise.promisify(jwt.verify)(token, secret || globalSecret)
                .then((decoded) => (redisClient
                    .hmset(`${jti}:${type}:${iss}`, {
                        ...decoded,
                        data: JSON.stringify(data)
                    }))
                    .return(token)
                )
            )
    };

    this.createAccessToken = ({data, iss = 'garage'}, secret) => {
        return this.createToken({data, type: 'ACCESS', iss}, secret);
    };

    this.createRefreshToken = ({data, iss = 'garage'}, secret) => {
        return this.createToken({data, type: 'REFRESH', iss}, secret);
    };

    this.createTokens = ({data, iss = `garage`}, secret) => {
        return Promise
            .props({
                accessToken: this.createAccessToken({data, iss}, secret),
                refreshToken: this.createRefreshToken({data, iss}, secret),
            });
    };

    this.isActual = (payloadOrToken, secret) => {
        return getPayload(payloadOrToken, secret)
            .then(isActual);
    };

    this.isActualAccessToken = (payloadOrToken, secret) => {
        return getPayload(payloadOrToken, secret)
            .then(({jti, iss, type}) => {
                if (type !== 'ACCESS') {
                    return false;
                }
                return isActual({jti, iss, type});
            })
    };

    this.isActualRefreshToken = (payloadOrToken, secret) => {
        return getPayload(payloadOrToken, secret)
            .then(({jti, iss, type}) => {
                if (type !== 'REFRESH') {
                    return false;
                }
                return isActual({jti, iss, type});
            })
    };


    this.breakToken = (payloadOrToken, secret) => {
        return getPayload(payloadOrToken, secret)
            .then(({jti, iss, type, id}) => (breakToken({jti, iss, type, id})));
    };


    this.breakRefreshToken = ({jti, iss, id}) => {
        return getPayload(payloadOrToken, secret)
            .then(({jti, iss, type, id}) => {
                if (type !== `REFRESH`) {
                    return 0;
                }
                return breakToken({jti, iss, type, id})
            });
    };

    this.breakAccessToken = ({jti, iss, id}) => {
        return getPayload(payloadOrToken, secret)
            .then(({jti, iss, type, id}) => {
                if (type !== `ACCESS`) {
                    return 0;
                }
                return breakToken({jti, iss, type, id})
            });
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

    this.getTokens = ({jti, iss, type, id}, secret) => {
        if (!jti || !iss || !type) {
            const key = id && `*${id || '*'}:${type || '*'}:${iss || '*'}` || `${jti || '*'}:${type || '*'}:${iss || '*'}`;
            return redisClient
                .keys(key)
                .map(redisClient.hgetall)
                .map((tokenPaylod) => (Promise.promisify(jwt.sign)({
                    ...tokenPaylod,
                    data: JSON.parse(tokenPaylod.data)
                }, secret || globalSecret)));
        }
        return redisClient
            .hgetall(`${jti}:${type}:${iss}`)
            .then((tokenPaylod) => (Promise.promisify(jwt.sign)({
                ...tokenPaylod,
                data: JSON.parse(tokenPaylod.data)
            }, secret || globalSecret)));
    };


    function getPayload(payloadOrToken, secret) {
        return Promise
            .resolve()
            .then(() => {
                if (payloadOrToken instanceof Object) {
                    return payloadOrToken;
                }
                return Promise.promisify(jwt.verify)(payloadOrToken, secret || globalSecret);
            })
    }

    function isActual({jti, iss, type}) {
        return Promise
            .resolve({jti, iss, type})
            .then(({jti, iss, type}) => {
                if (!jti || !iss || !type) {
                    return redisClient
                        .keys(`${jti || '*'}:${type || '*'}:${iss || '*'}`)
                        .get(0)
                        .then(Boolean);
                }
                return redisClient
                    .get(`${jti}:${type}:${iss}`)
                    .then(Boolean);
            });
    }

    function breakToken({jti, iss, type, id}) {
        return Promise
            .resolve({jti, iss, type})
            .then(({jti, iss, type, id}) => {
                if (!jti || !iss || !type) {
                    const key = id && `*${id || '*'}:${type || '*'}:${iss || '*'}` || `${jti || '*'}:${type || '*'}:${iss || '*'}`;
                    return redisClient
                        .keys(key)
                        .then((keys) => (redisClient.del(...keys)));
                }
                return redisClient
                    .del(`${jti}:${type}:${iss}`);
            });
    }
}

export default JWTService;
