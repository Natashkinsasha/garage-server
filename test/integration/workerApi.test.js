const env = require('./env');
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const expect = chai.expect;
const config = require('config');


describe('Test worker API', () => {

    const port = config.get('server.port');

    it('get worker by id', (done) => {
        chai.request(`http://localhost:${port}`)
            .get('/worker/1')
            .then((res) => {
                expect(res).to.have.status(204);
                done();
            }).catch(err => (done(err)));
    });


    it('get workers by parameters', (done) => {
        chai.request(`http://localhost:${port}`)
            .get('/worker')
            .query({page: 1, number: 10})
            .then((res) => {
                expect(res).to.have.status(200);
                done();
            }).catch(err => (done(err)));
    });

    it('save worker', (done) => {
        chai.request(`http://localhost:${port}`)
            .post('/worker')
            .send({firstName: 'Pasha', secondName: 'Rydak'})
            .then((res) => {
                expect(res).to.have.status(201);
                done();
            }).catch(err => (done(err)));
    });


    it('update worker', (done) => {
        chai.request(`http://localhost:${port}`)
            .put('/worker')
            .send({id: 2, firstName: 'Peta', secondName: 'Parker'})
            .then((res) => {
                expect(res).to.have.status(204);
                done();
            }).catch(err => (done(err)));
    });


    it('delete workers', (done) => {
        chai.request(`http://localhost:${port}`)
            .delete('/worker')
            .query({ids: [1, 2]})
            .then((res) => {
                expect(res).to.have.status(200);
                done();
            }).catch(err => (done(err)));
    });
});
