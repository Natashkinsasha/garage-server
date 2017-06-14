import Promise from 'bluebird';
import chai from 'chai';
import chaiHttp from 'chai-http';
import dirtyChai from 'dirty-chai';
import queryString from 'query-string';
import config from 'config';

const port = config.get('server.port');
const expect = chai.expect;
chai.use(chaiHttp);
chai.use(dirtyChai);

import {start, stop} from '../../src/assembly';

describe('Test worker API', () => {

    before((done)=>{
        start().then(done).catch(done)
    });

    after((done)=>{
        stop().then(done).catch(done)
    });


    it('get worker by id', (done) => {
        chai
            .request(`http://localhost:${port}`)
            .post('/v1/api/workers')
            .send({firstName: 'Pasha', secondName: 'Rydak'})
            .then((res) => {
                return chai
                    .request(`http://localhost:${port}`)
                    .get(`/v1/api/workers/${res.body.id}`)
            })
            .then((res) => {
                expect(res).to.have.status(200);
                done();
            })
            .catch(err => (done(err)));
    });

    it('get worker by non-existent id', (done) => {
        chai
            .request(`http://localhost:${port}`)
            .get(`/v1/api/workers/59185a8ad3f4da215cc0353b`)
            .then((res) => {
                expect(res).to.have.status(204);
                done();
            })
            .catch(done);
    });

    it('get worker by id with invalid id', (done) => {
        chai
            .request(`http://localhost:${port}`)
            .post('/v1/api/workers')
            .send({firstName: 'Pasha', secondName: 'Rydak'})
            .then((res) => {
                return chai.request(`http://localhost:${port}`)
                    .get(`/v1/api/workers/test`)
                    .catch((res) => {
                        expect(res).to.have.status(400);
                        done();
                    })
            })
            .catch(done);
    });

    it('get workers by parameters page ana number', (done) => {
        chai
            .request(`http://localhost:${port}`)
            .get('/v1/api/workers')
            .query({page: 1, number: 10})
            .then((res) => {
                expect(res).to.have.status(200);
                done();
            })
            .catch(done);
    });

    it('get workers by parameters page, number, sortedColumn ', (done) => {
        chai
            .request(`http://localhost:${port}`)
            .get('/v1/api/workers')
            .query({page: 1, number: 10, sortedColumn: 'firstName'})
            .then((res) => {
                expect(res).to.have.status(200);
                done();
            })
            .catch(done);
    });

    it('get workers by invalid direction', (done) => {
        chai
            .request(`http://localhost:${port}`)
            .get('/v1/api/workers')
            .query({page: 1, number: 10, sortedColumn: 'firstName', direction: 'test'})
            .catch(err => {
                expect(err).to.have.status(400);
                done();
            })
            .catch(done);
    });

    it('get workers by parameters page, number, sortedColumn ', (done) => {
        Promise
            .all(
                [
                    chai.request(`http://localhost:${port}`)
                        .post('/v1/api/workers')
                        .send({firstName: 'Pasha', secondName: 'Rydak'}),
                    chai.request(`http://localhost:${port}`)
                        .post('/v1/api/workers')
                        .send({firstName: 'Sasha', secondName: 'Natashkin'}),
                    chai.request(`http://localhost:${port}`)
                        .post('/v1/api/workers')
                        .send({firstName: 'Petia', secondName: 'Parker'}),
                ]
            )
            .then(() => (
                chai.request(`http://localhost:${port}`)
                    .get('/v1/api/workers')
                    .query({page: 1, number: 10, sortedColumn: 'firstName', direction: 'descending'})
            ))
            .then((res) => {
                expect(res).to.have.status(200);
                done();
            })
            .catch(done);
    });

    it('get workers by invalid parameters', (done) => {
        chai
            .request(`http://localhost:${port}`)
            .get('/v1/api/workers')
            .query({page: 'test', number: 10})
            .catch((err) => {
                expect(err).to.have.status(400);
                done();
            })
            .catch(done);
    });

    it('get workers by positions', (done) => {
        chai
            .request(`http://localhost:${port}`)
            .post('/v1/api/workers')
            .send({firstName: 'Pasha', secondName: 'Rydak', positions: ['student']})
            .then(() => (
                chai
                    .request(`http://localhost:${port}`)
                    .get(`/v1/api/workers/find/positions?${queryString.stringify({positions: ['student']}, {arrayFormat: 'bracket'})}`)
                )
            )
            .then((res) => {
                expect(res).to.have.status(200);
                done();
            })
            .catch(done);
    });


    it('save worker', (done) => {
        chai
            .request(`http://localhost:${port}`)
            .post('/v1/api/workers')
            .send({firstName: 'Pasha', secondName: 'Rydak'})
            .then((res) => {
                expect(res).to.have.status(201);
                done();
            })
            .catch(done);
    });


    it('update worker', (done) => {
        chai
            .request(`http://localhost:${port}`)
            .post('/v1/api/workers')
            .send({firstName: 'Pasha', secondName: 'Rydak'})
            .then((res) => {
                return chai
                    .request(`http://localhost:${port}`)
                    .put('/v1/api/workers')
                    .send({id: res.body.id, firstName: 'Peta', secondName: 'Parker'});
            })
            .then((res) => {
                expect(res).to.have.status(200);
                done();
            })
            .catch(done);
    });


    it('delete workers', (done) => {
        chai
            .request(`http://localhost:${port}`)
            .post('/v1/api/workers')
            .send({firstName: 'Pasha', secondName: 'Rydak'})
            .then((res) => {
                return chai.request(`http://localhost:${port}`)
                    .delete(`/v1/api/workers?${queryString.stringify({ids: [res.body.id]}, {arrayFormat: 'bracket'})}`)
                    .then(() => {
                        return res.body.id;
                    })
            })
            .then((id) => {
                return chai
                    .request(`http://localhost:${port}`)
                    .get(`/v1/api/workers/${id}`)
            })
            .then((res) => {
                expect(res).to.have.status(204);
                done();
            })
            .catch((err) => {
                done(err);
            });
    });


    it('delete workers with invalid ids', (done) => {
        chai
            .request(`http://localhost:${port}`)
            .delete(`/v1/api/workers?${queryString.stringify({ids: ['test']}, {arrayFormat: 'bracket'})}`)
            .catch((res) => {
                expect(res).to.have.status(400);
                done();
            })
            .catch(done)
    });

    it('delete workers without ids', (done) => {
        chai
            .request(`http://localhost:${port}`)
            .delete('/v1/api/workers')
            .catch((res) => {
                expect(res).to.have.status(400);
                done();
            })
            .catch(done);
    });
});
