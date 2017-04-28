const config = require('config');
import Promise from 'bluebird';
import WorkerService from '../../src/service/WorkerService';
import Worker from '../../src/model/Worker';
import mongoose from 'mongoose';
import {Mockgoose} from 'mockgoose';
let mockgoose = new Mockgoose(mongoose);
const expect = require('chai').expect;

describe('WorkerService', () => {
    let workerService;

    before((done) => {
        mockgoose.prepareStorage().then(() => {
            mongoose.connect('mongodb://example.com/TestingDB', (err) => {
                workerService = new WorkerService(Worker);
                done(err);
            });
        }).catch(err => (done(err)));
    });


    afterEach((done) => {
        mockgoose.helper.reset().then(() => {
            done()
        });
    });

    describe('#getById', () => {
        it('should find workers by id', (done) => {
            workerService
                .save({firstName: 'Petia', secondName: 'Parker'})
                .then((worker) => {
                    return workerService.getById(worker.id);
                })
                .then((worker) => {
                    expect(worker).to.not.be.null;
                    done();
                }).catch(err => (done(err)));
        });
    });

    describe('#get', () => {
        it('should return list of workers with given page, given size', (done) => {
            Promise.all([
                workerService.save({firstName: 'Petia', secondName: 'Parker'}),
                workerService.save({firstName: 'Alex', secondName: 'Natashkin'}),
                workerService.save({firstName: 'Pasha', secondName: 'Rydak'})
            ])
                .then(() => {
                    return workerService.get(1, 2)
                })
                .then((workersPage) => {
                    expect(workersPage.docs[0]).to.have.property('firstName', 'Pasha');
                    expect(workersPage.docs[0]).to.have.property('secondName', 'Rydak');
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
            workerService
                .save({firstName: 'Petia', secondName: 'Parker'})
                .then((worker) => {
                    expect(worker).to.have.property('firstName', 'Petia');
                    expect(worker).to.have.property('secondName', 'Parker');
                    done();
                })
                .catch(err => (done(err)));
        });
    });

    describe('#update', () => {
        it('should find by id and change given worker', (done) => {
            workerService
                .save({firstName: 'Petia', secondName: 'Parker'})
                .then((worker) => {
                    return workerService.update({id: worker.id, firstName: 'Alex', secondName: 'Parker'})
                })
                .then((worker) => {
                    expect(worker).to.have.property('firstName', 'Alex');
                    done();
                }).catch(err => (done(err)));
        });
    });

    describe('#remove', () => {
        it('should remove worker by id', (done) => {
            Promise.all([
                workerService.save({firstName: 'Petia', secondName: 'Parker'}),
                workerService.save({firstName: 'Alex', secondName: 'Natashkin'})
            ])
                .map((worker) => (worker.id))
                .spread((petiaId, alexId) => {
                    return workerService.remove(petiaId, alexId)
                })
                .map((worker) => (worker.id))
                .spread((petiaId, alexId) => {
                    return Promise.all([
                        workerService.getById(petiaId),
                        workerService.getById(alexId),
                    ]);
                })
                .spread((petia, alex) => {
                    expect(petia).to.be.null;
                    expect(alex).to.be.null;
                    done();
                })
                .catch(err => (done(err)));
        });
    });
})
;

