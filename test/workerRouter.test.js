const chai = require('chai')
    , chaiHttp = require('chai-http');
const mocha = require('mocha');

import HttpServer from '../src/http-server';
const httpServer = new HttpServer();

chai.use(chaiHttp);
const expect = chai.expect;


describe('Test worker API', () => {
    before(() => {
        httpServer.start(3001);
    });

    after((done) => {
        httpServer.finish(done);
    });


    it('get worker by id', (done) => {
        chai.request('http://localhost:3001')
            .get('/worker/1')
            .then((res) => {
                expect(res).to.have.status(204);
                done();
            }).catch(err => (done(err)));
    });


    it('get workers by parameters', (done) => {
        chai.request('http://localhost:3001')
            .get('/worker')
            .query({page: 1, number: 10})
            .then((res) => {
                expect(res).to.have.status(200);
                done();
            }).catch(err => (done(err)));
    });

    it('save worker', (done) => {
        chai.request('http://localhost:3001')
            .post('/worker')
            .send({firstName: 'Pasha', secondName: 'Rydak'})
            .then((res) => {
                expect(res).to.have.status(201);
                done();
            }).catch(err => (done(err)));
    });


    it('update worker', (done) => {
        chai.request('http://localhost:3001')
            .put('/worker')
            .send({id: 2, firstName: 'Peta', secondName: 'Parker'})
            .then((res) => {
                expect(res).to.have.status(204);
                done();
            }).catch(err => (done(err)));
    });


    it('delete workers', (done) => {
        chai.request('http://localhost:3001')
            .delete('/worker')
            .query({ids: [1, 2]})
            .then((res) => {
                expect(res).to.have.status(200);
                done();
            }).catch(err => (done(err)));
    });
});
