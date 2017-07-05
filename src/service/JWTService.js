import shortId from 'shortid';
import jwt from 'jsonwebtoken';
import config from 'config';
import Promise from 'bluebird';

function JWTService({redisClient}) {

    const secret = config.get('jwt.secret');

    this.createToken = ({data = {}, type = 'ACCESS', iss = 'garage'}) => {
        const id = data.id || ``;
        const jti = shortId.generate() + id;
        console.log(`${jti}:ACCESS:${iss}`)
        return Promise.promisify(jwt.sign)({...data, jti, type, iss}, secret)
            .then((token) => Promise.promisify(jwt.verify)(token, secret)
                .then((decoded) => (redisClient.hmset(`${jti}:${type}:${iss}`, {jti, type, iss, iat: decoded.iat}))
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

    this.isActualRefreshToken = ({jti, iss = `*`}) => {
        return redisClient
            .get(`${jti}:REFRESH:${iss}`)
            .then(Boolean);
    };

    this.isActualAccessToken = ({jti, iss = `*`}) =>{
        console.log(`${jti}:ACCESS:${iss}`)
        return redisClient
            .get(`${jti}:ACCESS:${'garage'}`)
            .tap(console.log)
            .then(Boolean);
    };

    this.breakToken = ({jti, iss = `*`, type = `*`, id}) => {
        const key = id && `*${id}:${type}:${iss}` || `${jti}:${type}:${iss}`;
        return redisClient
            .del(key)
            .return(id);
    };

    this.breakRefreshToken = ({jti, iss = `*`, id}) => {
        return this.breakToken({jti, iss, type: `REFRESH`, id})
            .return(id);
    };

    this.breakAccessToken = ({jti, iss = `*`, id}) => {
        return this.breakToken({jti, iss, type: `ACCESS`, id})
            .return(id);
    };
}

export default JWTService;
