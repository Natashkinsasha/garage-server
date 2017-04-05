const config = require('config');
import WorkerService from '../../src/service/WorkerService';
import MongoClient from './mock/MongoClient';
const url = `mongodb://${config.get('mongoDb.host')}:${config.get('mongoDb.port')}/${config.get('mongoDb.db')}`;

describe('WorkerService', () => {
    let workerService;

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

    describe('#getById', () => {
        it('should find workers by id', (done) => {
            workerService.getById(1).then((worker) => {
                done();
            }).catch(err => (done(err)));
        });
    });

    describe('#get', () => {
        it('should return list of workers with given page, given size', (done) => {
            workerService.get(0, 10).then((workers) => {
                done();
            }).catch(err => (done(err)));
        });
    });

    describe('#removeAll', () => {
        it('should delete all workers', (done) => {
            workerService.removeAll().then(() => {
                done();
            }).catch(err => (done(err)));
        });
    });
    describe('#save', () => {
        it('should save worker and return worker with id field', (done) => {
            workerService.save({firstName: 'Petia', secondName: 'Parker'}).then(() => {
                done();
            }).catch(err => (done(err)));
        });
    });

    describe('#update', () => {
        it('should find by id and change given worker', (done) => {
            workerService.update({id: '1', firstName: 'Petia', secondName: 'Parker'}).then(() => {
                done();
            }).catch(err => (done(err)));
        });
    });

    describe('#remove', () => {
        it('should remove worker by id', (done) => {
            workerService.remove(1, 2, 3).then(() => {
                done();
            }).catch(err => (done(err)));
        });
    });
})
;

