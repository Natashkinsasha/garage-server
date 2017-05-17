import Promise from 'bluebird';
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const expect = chai.expect;
const config = require('config');
import mongoose from 'mongoose'
import HttpServer from '../../src/server/HttpServer';
import WorkerService from '../../src/service/WorkerService';
import Worker from '../../src/model/Worker';
import WorkerRouter from '../../src/routers/WorkerRouter';
import App from '../../src/server/App';
import {Mockgoose} from 'mockgoose';
mongoose.Promise = Promise;
let mockgoose = new Mockgoose(mongoose);
const port = config.get('server.port');

describe('Test worker API', () => {
    before((done) => {
        new Promise((resolve, reject) => (
            mockgoose.prepareStorage().then(resolve, reject)
        ))
            .then(() => (mongoose.connect('mongodb://example.com/TestingDB')))
            .then(() => (new WorkerService(Worker)))
            .then((workerService) => (new WorkerRouter(workerService)))
            .then((workerRouter) => (new App({workerRouter})))
            .then((app) => (new HttpServer(app).start(config.get('server.port'))))
            .then(done)
            .catch((err) => {
                console.log(err);
                done(err);
            })
    });

    afterEach((done) => {
        mockgoose.helper.reset().then(() => {
            done()
        });
    });

    it('get worker by id', (done) => {
        chai.request(`http://localhost:${port}`)
            .post('/api/workers')
            .send({firstName: 'Pasha', secondName: 'Rydak'})
            .then((res) => {
                return chai.request(`http://localhost:${port}`).get(`/api/workers/${res.body.id}`)
            })
            .then((res) => {
                expect(res).to.have.status(200);
                done();
            })
            .catch(err => (done(err)));
    });

    it('get worker by non-existent id', (done) => {
        chai.request(`http://localhost:${port}`).get(`/api/workers/59185a8ad3f4da215cc0353b`)
            .then((res) => {
                expect(res).to.have.status(204);
                done();
            })
            .catch(err => (done(err)));
    });

    it('get worker by id with invalid id', (done) => {
        chai.request(`http://localhost:${port}`)
            .post('/api/workers')
            .send({firstName: 'Pasha', secondName: 'Rydak'})
            .then((res) => {
                return chai.request(`http://localhost:${port}`)
                    .get(`/api/workers/test`)
                    .catch((res) => {
                        expect(res).to.have.status(400);
                        done();
                    })
            })
            .catch(done)
    });

    it('get workers by parameters page ana number', (done) => {
        chai.request(`http://localhost:${port}`)
            .get('/api/workers')
            .query({page: 1, number: 10})
            .then((res) => {
                expect(res).to.have.status(200);
                done();
            })
            .catch(err => {
                done(err)
            });
    });

    it('get workers by parameters page, number, sortedColumn ', (done) => {
        chai.request(`http://localhost:${port}`)
            .get('/api/workers')
            .query({page: 1, number: 10, sortedColumn: 'firstName'})
            .then((res) => {
                expect(res).to.have.status(200);
                done();
            })
            .catch(err => {
                done(err)
            });
    });

    it('get workers by invalid direction', (done) => {
        chai.request(`http://localhost:${port}`)
            .get('/api/workers')
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
                        .post('/api/workers')
                        .send({firstName: 'Pasha', secondName: 'Rydak'}),
                    chai.request(`http://localhost:${port}`)
                        .post('/api/workers')
                        .send({firstName: 'Sasha', secondName: 'Natashkin'}),
                    chai.request(`http://localhost:${port}`)
                        .post('/api/workers')
                        .send({firstName: 'Petia', secondName: 'Parker'}),
                ]
            )
            .then(() => (
                chai.request(`http://localhost:${port}`)
                    .get('/api/workers')
                    .query({page: 1, number: 10, sortedColumn: 'firstName', direction: 'descending'})
            ))
            .then((res) => {
                expect(res).to.have.status(200);
                done();
            })
            .catch(err => {
                done(err)
            });
    });

    it('get workers by invalid parameters', (done) => {
        chai.request(`http://localhost:${port}`)
            .get('/api/workers')
            .query({page: 'test', number: 10})
            .catch((err) => {
                expect(err).to.have.status(400);
                done();
            })
            .catch(done)
    });

    it('get workers by positions', (done) => {
        chai.request(`http://localhost:${port}`)
            .post('/api/workers')
            .send({firstName: 'Pasha', secondName: 'Rydak', positions: ['student']})
            .then(()=>(
                chai.request(`http://localhost:${port}`)
                    .get('/api/workers/find/positions')
                    .send({positions: ['student']}))
            )
            .then((res) => {
                expect(res).to.have.status(200);
                done();
            })
            .catch(err => {
                done(err)
            });
    });


    it('save worker', (done) => {
        chai.request(`http://localhost:${port}`)
            .post('/api/workers')
            .send({firstName: 'Pasha', secondName: 'Rydak'})
            .then((res) => {
                expect(res).to.have.status(201);
                done();
            })
            .catch(done);
    });


    it('update worker', (done) => {
        chai.request(`http://localhost:${port}`)
            .post('/api/workers')
            .send({firstName: 'Pasha', secondName: 'Rydak'})
            .then((res) => {
                return chai.request(`http://localhost:${port}`)
                    .put('/api/workers')
                    .send({id: res.body.id, firstName: 'Peta', secondName: 'Parker'});
            })
            .then((res) => {
                expect(res).to.have.status(200);
                done();
            })
            .catch(done);
    });


    it('delete workers', (done) => {
        chai.request(`http://localhost:${port}`)
            .post('/api/workers')
            .send({firstName: 'Pasha', secondName: 'Rydak'})
            .then((res) => {
                return new Promise((resolve, reject) => chai.request(`http://localhost:${port}`)
                    .delete('/api/workers')
                    .send({ids: [res.body.id]})
                    .then(resolve, reject))
                    .return(res.body.id)
            })
            .then((id) => {
                return chai.request(`http://localhost:${port}`).get(`/api/workers/${id}`)
            })
            .then((res) => {
                expect(res).to.have.status(204);
                done();
            })
            .catch(done);
    });


    it('delete workers with invalid ids', (done) => {
        chai.request(`http://localhost:${port}`)
            .delete('/api/workers')
            .send({ids: ['test']})
            .catch((res) => {
                expect(res).to.have.status(400);
                done();
            })
            .catch(done)
    });

    it('delete workers without ids', (done) => {
        chai.request(`http://localhost:${port}`)
            .delete('/api/workers')
            .catch((res) => {
                expect(res).to.have.status(400);
                done();
            })
            .catch(done);
    });
});
