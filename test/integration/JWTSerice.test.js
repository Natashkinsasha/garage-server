import jwt from 'jsonwebtoken';
import config from 'config';
import chai from 'chai';
import chaiThings from 'chai-things';
import dirtyChai from 'dirty-chai';

import JWTService from '../../src/service/JWTService';
import MockRedisClient from '../../src/lib/MockRedisClient';
const expect = chai.expect;
chai.should();
chai.use(chaiThings);
chai.use(dirtyChai);


describe('WorkerService', () => {
    const redisClient = new MockRedisClient();
    const jwtService = new JWTService({redisClient});
    const secret = config.get('jwt.secret');

    afterEach((done) => {
        redisClient
            .flushall()
            .then(() => done());
    });


    describe('#createToken', () => {
        it('', (done) => {
            jwtService
                .createToken({})
                .then((token) => (jwt.verify(token, secret)))
                .then((decoded) => {
                    expect(decoded).to.have.property('jti');
                    expect(decoded).to.have.property('type', 'ACCESS');
                    expect(decoded).to.have.property('iss', 'garage');
                    expect(decoded.jti).to.be.a('string');
                    expect(decoded.type).to.be.a('string');
                    expect(decoded.iss).to.be.a('string');
                    expect(decoded.iat).to.be.a('number');
                    done();
                })
                .catch(done)
        })
    });

    describe('#isActualRefreshToken', () => {
        it('', (done) => {
            jwtService
                .createToken({})
                .then((token) => (jwt.verify(token, secret)))
                .tap(console.log)
                .then((decoded) => (jwtService.isActualAccessToken({jti: decoded.jti})))
                .then((isActual)=>{
                    console.log(isActual)
                    expect(isActual).to.be.true();
                    done();
                })
                .catch(done)
        })
    });

});
