import jwt from 'jsonwebtoken';
import shortId from 'shortid';
import config from 'config';
import chai from 'chai';
import chaiThings from 'chai-things';
import dirtyChai from 'dirty-chai';
import Promise from 'bluebird';

import JWTService from '../../src/service/JWTService';
import MockRedisClient from '../../src/lib/MockRedisClient';
const expect = chai.expect;
chai.should();
chai.use(chaiThings);
chai.use(dirtyChai);


describe('JWTService', () => {
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
        });
    });

    describe('#createAccessToken', () => {
        it('', (done) => {
            const id = shortId.generate();
            const email = 'natashkinsasha@gmail.com';
            const iss = 'test';
            jwtService
                .createAccessToken({data: {id, email}, iss})
                .then((token) => (jwt.verify(token, secret)))
                .then((decoded) => {
                    expect(decoded).to.have.property('jti');
                    expect(decoded).to.have.property('type', 'ACCESS');
                    expect(decoded).to.have.property('iss', iss);
                    expect(decoded).to.have.property('data');
                    expect(decoded.jti).to.be.a('string');
                    expect(decoded.type).to.be.a('string');
                    expect(decoded.iss).to.be.a('string');
                    expect(decoded.iat).to.be.a('number');
                    expect(decoded.data).to.eql({id, email});
                    done();
                })
                .catch(done)
        });
    });

    describe('#isActualAccessToken', () => {
        it('', (done) => {
            jwtService
                .createToken({})
                .then((token) => (jwt.verify(token, secret)))
                .then((decoded) => (jwtService.isActualAccessToken({jti: decoded.jti})))
                .then((isActual) => {
                    expect(isActual).to.be.true();
                    done();
                })
                .catch(done)
        })
    });

    describe('#breakAccessToken', () => {
        it('', (done) => {
            jwtService
                .createToken({})
                .then((token) => (jwt.verify(token, secret)))
                .then((decoded) => {
                    return jwtService
                        .breakToken({jti: decoded.jti})
                        .then((numberOfDeleteTokens) => {
                            expect(numberOfDeleteTokens).to.be.a('number');
                            expect(numberOfDeleteTokens).to.be.equals(1);
                        })
                        .then(() => (jwtService.isActualAccessToken(decoded)))
                        .then((isActual) => {
                            expect(isActual).to.be.false();
                            done();
                        })
                })

                .catch(done)
        })
    });

    describe('#getTokens', () => {
        it('', (done) => {
            jwtService
                .createToken({})
                .then((token) => (jwt.verify(token, secret)))
                .then((decoded) => {
                    return jwtService.getTokens({jti: decoded.jti});
                })
                .then((tokens) => {
                    expect(tokens).to.be.a('array');
                    expect(tokens).to.have.lengthOf(1);
                    done();
                })
                .catch(done)
        })
    });

    describe('#getTokensPayload', () => {
        it('', (done) => {
            Promise
                .all([
                    jwtService
                        .createToken({}),
                    jwtService
                        .createToken({})
                ])
                .return({type: 'ACCESS'})
                .then(jwtService.getTokensPayload)
                .then((tokensPayload) => {
                    expect(tokensPayload).to.be.a('array');
                    expect(tokensPayload).to.have.lengthOf(2);
                    done();
                })
                .catch(done)
        });

        it('', (done) => {
            const id = shortId.generate();
            const email = 'natashkinsasha@gmail.com';
            const iss = 'test';
            jwtService
                .createAccessToken({data: {id, email}, iss})
                .then((token) => (jwt.verify(token, secret)))
                .then((decoded) => {
                    return jwtService
                        .getTokensPayload(decoded)
                        .then((tokenPayload) => {
                            expect(tokenPayload).to.have.property('jti');
                            expect(tokenPayload).to.have.property('type', 'ACCESS');
                            expect(tokenPayload).to.have.property('iss', iss);
                            expect(tokenPayload).to.have.property('data');
                            expect(tokenPayload.data).to.eql({id, email});
                            expect(tokenPayload.jti).to.have.string(`-${id}`);
                            expect(tokenPayload.jti).to.be.a('string');
                            expect(tokenPayload.type).to.be.a('string');
                            expect(tokenPayload.iss).to.be.a('string');
                            expect(tokenPayload.iat).to.be.a('number');
                            done();
                        });
                })
                .catch(done)
        });

        it('', (done) => {
            jwtService
                .createToken({})
                .then((token) => (jwt.verify(token, secret)))
                .then((decoded) => {
                    return jwtService
                        .getTokensPayload(decoded)
                        .then((tokenPayload) => {
                            expect(tokenPayload).to.have.property('jti');
                            expect(tokenPayload).to.have.property('type', 'ACCESS');
                            expect(tokenPayload).to.have.property('iss', 'garage');
                            expect(tokenPayload).to.have.property('data');
                            expect(tokenPayload.jti).to.be.a('string');
                            expect(tokenPayload.type).to.be.a('string');
                            expect(tokenPayload.iss).to.be.a('string');
                            expect(tokenPayload.iat).to.be.a('number');
                            expect(tokenPayload).to.eql(decoded);
                            done();
                        })
                })
                .catch(done)
        });
    });

});
