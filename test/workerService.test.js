const config = require('config');
import WorkerService from '../src/service/workerService';
const MongoClient = require('mongodb').MongoClient;
const url = `mongodb://${config.get('mongoDb.user')}:${config.get('mongoDb.password')}${config.get('mongoDb.host')}:${config.get('mongoDb.port')}/${config.get('mongoDb.db')}`;

let workerService;

describe('Test worker API', () => {

    before((done) => {
        MongoClient.connect(url).then((db) => {
            workerService = new WorkerService(db);
            done();
        }).catch(err => (done(err)));
    });

    after((done) => {
        workerService.closeDB().then(() => {
            done();
        }).catch(err => (done(err)));
    });


    it('get worker by id', (done) => {
        workerService.getById(1).then((worker) => {
            done();
        }).catch(err => (done(err)));
    });

    it('get workers by parameters', (done) => {
        workerService.get(0, 10).then((workers) => {
            done();
        }).catch(err => (done(err)));
    });

    it('delete all workers', (done) => {
        workerService.removeAll().then(() => {
            done();
        }).catch(err => (done(err)));
    });

    it('save worker', (done) => {
        workerService.save({firstName: 'Petia', secondName: 'Parker'}).then(() => {
            done();
        }).catch(err => (done(err)));
    });


    it('update worker', (done) => {
        workerService.update({id: '1', firstName: 'Petia', secondName: 'Parker'}).then(() => {
            done();
        }).catch(err => (done(err)));
    });


    it('delete workers by ids', (done) => {
        workerService.remove(1, 2, 3).then(() => {
            done();
        }).catch(err => (done(err)));
    });

});

