import Promise from 'bluebird';
import R from 'ramda'
import mongoose from 'mongoose';
import {Mockgoose} from 'mockgoose';
import chai from 'chai';
import chaiThings from 'chai-things';
import dirtyChai from 'dirty-chai';

import WorkerService from '../../src/service/WorkerService';
import Worker from '../../src/model/Worker';

const expect = chai.expect;
chai.should();
chai.use(chaiThings);
chai.use(dirtyChai);
mongoose.Promise = Promise;

describe('WorkerService', () => {
    const workerService = new WorkerService(Worker);
    const mockgoose = new Mockgoose(mongoose);

    before((done) => {
        mockgoose
            .prepareStorage()
            .then(() => (mongoose.connect('mongodb://example.com/TestingDB')))
            .then(() => (done()))
            .catch(done);
    });


    afterEach((done) => {
        mockgoose.helper
            .reset()
            .then(done)
            .catch(done);
    });

    describe('#getById', () => {
        it('should find workers by id', (done) => {
            workerService
                .save({firstName: 'Petia', secondName: 'Parker'})
                .then((worker) => {
                    return workerService.getById(worker.id);
                })
                .then((worker) => {
                    expect(worker).to.not.be.null();
                    expect(worker.id).to.be.a('string');
                    done();
                })
                .catch(done);
        });
    });

    describe('#get', () => {
        it('should return list of workers with given page, given size', (done) => {
            Promise
                .all([
                    workerService.save({firstName: 'Petia', secondName: 'Parker'}),
                    workerService.save({firstName: 'Alex', secondName: 'Natashkin'}),
                    workerService.save({firstName: 'Pasha', secondName: 'Rydak'})
                ])
                .then(() => {
                    return workerService.get({page: 1, limit: 3})
                })
                .then((result) => {
                    expect(result).to.have.property('total', 3);
                    expect(result).to.have.property('limit', 3);
                    expect(result).to.have.property('page', 1);
                    expect(result).to.have.property('pages', 1);
                    expect(result).to.have.property('docs');
                    expect(result.docs).to.have.lengthOf(3);
                    done();
                })
                .catch(done);
        });

        it('should return list of sorted by firstName workers with given page, given size', (done) => {
            Promise
                .all([
                    workerService.save({firstName: 'Petia', secondName: 'Parker'}),
                    workerService.save({firstName: 'Alex', secondName: 'Natashkin'}),
                    workerService.save({firstName: 'Pasha', secondName: 'Rydak'})
                ])
                .then(() => {
                    return workerService.get({page: 1, limit: 3, sort: {'firstName': 'descending'}})
                })
                .then((result) => {
                    expect(result.docs).to.have.lengthOf(3);
                    done();
                })
                .catch(done);
        });

        it('should return list of sorted by firstName workers with given page, given size', (done) => {
            Promise
                .all([
                    workerService.save({firstName: 'Petia', secondName: 'Parker'}),
                    workerService.save({firstName: 'Alex', secondName: 'Natashkin'}),
                    workerService.save({firstName: 'Pasha', secondName: 'Rydak'})
                ])
                .then(() => {
                    return workerService.get({page: 1, limit: 3, sort: {'test': 'descending'}})
                })
                .then((result) => {
                    expect(result.docs).to.have.lengthOf(3);
                    done();
                })
                .catch(done);
        });
    });

    describe('#removeAll', () => {
        it('should delete all workers', (done) => {
            workerService
                .removeAll()
                .then(() => {
                    done();
                })
                .catch(done);
        });
    });

    describe('#save', () => {
        it('should save worker and return worker with id field', (done) => {
            workerService
                .save({firstName: 'Petia', secondName: 'Parker'})
                .then((worker) => {
                    expect(worker.id).to.be.a('string');
                    expect(worker).to.have.property('firstName', 'Petia');
                    expect(worker).to.have.property('secondName', 'Parker');
                    done();
                })
                .catch(done);
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
                })
                .catch(done);
        });
    });

    describe('#findByPositions', () => {
        it('should find worker by positions', (done) => {
            Promise
                .all([
                    workerService.save({
                        firstName: 'Petia',
                        secondName: 'Parker',
                        positions: ['superman', 'photographer']
                    }),
                    workerService.save({firstName: 'Alex', secondName: 'Natashkin', positions: ['programmer']})
                ])
                .spread((petia, alex) => {
                    return Promise
                        .all([
                            workerService.findByPositions('superman'),
                            workerService.findByPositions('programmer', 'student'),
                        ])
                        .spread((supermans, programmersORstudents) => {
                            supermans.should.include.something.that.deep.equals(petia);
                            programmersORstudents.should.include.something.that.deep.equals(alex);
                            done();
                        })
                })
                .catch(done);
        });
    });

    describe('#remove', () => {
        it('should remove worker by id', (done) => {
            Promise
                .all([
                    workerService.save({firstName: 'Petia', secondName: 'Parker'}),
                    workerService.save({firstName: 'Alex', secondName: 'Natashkin'})
                ])
                .then(R.pluck('id'))
                .spread((petiaId, alexId) => {
                    return workerService.remove(petiaId, alexId)
                })
                .then(R.pluck('id'))
                .spread((petiaId, alexId) => {
                    return Promise.all([
                        workerService.getById(petiaId),
                        workerService.getById(alexId),
                    ]);
                })
                .spread((petia, alex) => {
                    expect(petia).to.be.null();
                    expect(alex).to.be.null();
                    done();
                })
                .catch(done);
        });
    });

});

